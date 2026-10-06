const fs = require('fs');
const path = require('path');

/**
 * Find files recursively matching a pattern or name
 */
function findFile(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'Pods' || entry.name === 'build') continue;
      const found = findFile(fullPath, fileName);
      if (found) return found;
    } else if (entry.name === fileName) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Patch android/app/build.gradle
 */
function patchAndroidBuildGradle(projectDir) {
  const gradlePath = path.join(projectDir, 'android', 'app', 'build.gradle');
  if (!fs.existsSync(gradlePath)) {
    console.log('⚠️ Could not find android/app/build.gradle');
    return false;
  }

  let content = fs.readFileSync(gradlePath, 'utf8');

  // Check if androidx.activity is already added
  if (!content.includes('androidx.activity:activity')) {
    const target = 'dependencies {';
    const injection = `dependencies {
    implementation("androidx.activity:activity:1.+") //by own`;
    if (content.includes(target)) {
      content = content.replace(target, injection);
      fs.writeFileSync(gradlePath, content, 'utf8');
      console.log('✅ Patched android/app/build.gradle');
      return true;
    }
  }
  return false;
}

/**
 * Patch MainActivity.kt
 */
function patchAndroidMainActivity(projectDir) {
  const javaDir = path.join(projectDir, 'android', 'app', 'src', 'main', 'java');
  const mainActivityPath = findFile(javaDir, 'MainActivity.kt');

  if (!mainActivityPath) {
    console.log('⚠️ Could not find MainActivity.kt');
    return false;
  }

  let content = fs.readFileSync(mainActivityPath, 'utf8');

  const requiredImports = [
    'android.os.Bundle',
    'com.facebook.react.ReactApplication',
    'com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory',
  ].filter(name => !new RegExp(`^import\\s+${name.replace(/\./g, '\\.')}\\s*$`, 'm').test(content));

  if (requiredImports.length > 0) {
    const importBlock = `//By Own\n${requiredImports.map(name => `import ${name}`).join('\n')}\n`;
    // Match only the package line itself so the inserted block always ends on its own line.
    const packageLineRegex = /^package\s+[\w.]+[ \t]*\r?\n/m;
    if (packageLineRegex.test(content)) {
      content = content.replace(packageLineRegex, match => `${match}\n${importBlock}`);
    } else {
      content = `${importBlock}\n${content}`;
    }
  }

  const activityHooks = `
  //By Own
  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)
    reloadIfDisplaySizeChanged()
  }

  /**
   * Changing "Display size" recreates this activity but keeps the JS runtime alive, so sizes
   * computed once at JS load (normalize(), screen-width constants) stay stale and layouts break.
   * Reloading the bundle recomputes them for the new density.
   */
  private fun reloadIfDisplaySizeChanged() {
    val densityDpi = resources.configuration.densityDpi
    if (lastDensityDpi != 0 && lastDensityDpi != densityDpi) {
      (application as ReactApplication).reactHost?.reload("Display size changed")
    }
    lastDensityDpi = densityDpi
  }

  //By Own
  private companion object {
    /** Survives activity recreation (same process); 0 means first launch. */
    var lastDensityDpi = 0
  }
`;

  if (!content.includes('reloadIfDisplaySizeChanged')) {
    const classRegex = /(class\s+MainActivity\s*:\s*ReactActivity\(\)\s*\{)/;
    if (classRegex.test(content)) {
      content = content.replace(classRegex, `$1${activityHooks}`);
    }
  }

  fs.writeFileSync(mainActivityPath, content, 'utf8');
  console.log('✅ Patched MainActivity.kt');
  return true;
}

/**
 * Patch AndroidManifest.xml
 */
function patchAndroidManifest(projectDir) {
  const manifestPath = path.join(projectDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️ Could not find AndroidManifest.xml');
    return false;
  }

  let content = fs.readFileSync(manifestPath, 'utf8');
  let modified = false;

  if (!content.includes('xmlns:tools')) {
    content = content.replace(
      '<manifest xmlns:android="http://schemas.android.com/apk/res/android"',
      '<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    xmlns:tools="http://schemas.android.com/tools"',
    );
    modified = true;
  }

  if (!content.includes('android.permission.CAMERA')) {
    const permissionBlock = `    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission
      android:name="android.permission.READ_EXTERNAL_STORAGE"
      android:maxSdkVersion="32" />
    <!-- RN debug adds this for Metro over LAN; use adb reverse instead. -->
    <uses-permission
      android:name="android.permission.ACCESS_LOCAL_NETWORK"
      tools:node="remove" />

`;
    if (content.includes('<application')) {
      content = content.replace('<application', `${permissionBlock}<application`);
      modified = true;
    }
  }

  if (!content.includes('enableOnBackInvokedCallback')) {
    content = content.replace(
      '<application',
      '<application\n      android:enableOnBackInvokedCallback="false"',
    );
    modified = true;
  }

  if (
    content.includes('<activity') &&
    !content.includes('android:screenOrientation=')
  ) {
    content = content.replace(
      '<activity',
      '<activity\n        android:screenOrientation="portrait"',
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(manifestPath, content, 'utf8');
    console.log('✅ Patched AndroidManifest.xml');
  }
  return modified;
}

/**
 * Get all font files from src/assets/fonts
 */
function getFontFiles(projectDir) {
  const fontsDir = path.join(projectDir, 'src', 'assets', 'fonts');
  if (!fs.existsSync(fontsDir)) return [];
  return fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf') || f.endsWith('.otf'));
}

/**
 * Patch iOS Info.plist
 */
function patchIOSInfoPlist(projectDir) {
  const iosDir = path.join(projectDir, 'ios');
  const infoPlistPath = findFile(iosDir, 'Info.plist');

  if (!infoPlistPath) {
    console.log('⚠️ Could not find iOS Info.plist');
    return false;
  }

  let content = fs.readFileSync(infoPlistPath, 'utf8');
  let modified = false;

  // Add Photo & Camera Permissions
  const permissionsToAdd = [];
  if (!content.includes('NSPhotoLibraryUsageDescription')) {
    permissionsToAdd.push(`\t<key>NSPhotoLibraryUsageDescription</key>
\t<string>We need access to your photo gallery to update your profile picture.</string>`);
  }
  if (!content.includes('NSCameraUsageDescription')) {
    permissionsToAdd.push(`\t<key>NSCameraUsageDescription</key>
\t<string>We need access to your camera to take photos for your profile picture.</string>`);
  }

  // Add UIAppFonts
  const fonts = getFontFiles(projectDir);
  if (fonts.length > 0 && !content.includes('<key>UIAppFonts</key>')) {
    const fontStrings = fonts.map(font => `\t\t<string>${font}</string>`).join('\n');
    permissionsToAdd.push(`\t<key>UIAppFonts</key>
\t<array>
${fontStrings}
\t</array>`);
  }

  if (content.includes('UIInterfaceOrientationLandscapeLeft')) {
    content = content.replace(
      /<key>UISupportedInterfaceOrientations<\/key>\s*<array>[\s\S]*?<\/array>/,
      `<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>`,
    );
    modified = true;
  }

  if (permissionsToAdd.length > 0) {
    const insertion = permissionsToAdd.join('\n') + '\n</dict>';
    content = content.replace(/<\/dict>\s*<\/plist>/, `${insertion}\n</plist>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(infoPlistPath, content, 'utf8');
    console.log('✅ Patched iOS Info.plist with permissions and custom fonts');
  }

  return modified;
}

/**
 * Keep CocoaPods on the same iOS minimum as the app target.
 */
function patchIOSPodfile(projectDir) {
  const podfilePath = path.join(projectDir, 'ios', 'Podfile');
  if (!fs.existsSync(podfilePath)) {
    return false;
  }

  let content = fs.readFileSync(podfilePath, 'utf8');
  if (content.includes("min_ios = '15.1'")) {
    return false;
  }

  const marker = 'react_native_post_install(';
  const start = content.indexOf(marker);
  if (start === -1) {
    return false;
  }

  const callEnd = content.indexOf('\n    )', start);
  if (callEnd === -1) {
    return false;
  }

  const injection = `
    # Force every pod (including resource bundles) to match the app's
    # iOS 15.1 minimum. Without this, some pods stay on 9.0 and Xcode fails.
    min_ios = '15.1'
    installer.pods_project.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios
    end
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios
      end
    end`;

  content =
    content.slice(0, callEnd + '\n    )'.length) +
    injection +
    content.slice(callEnd + '\n    )'.length);
  fs.writeFileSync(podfilePath, content, 'utf8');
  console.log('✅ Patched ios/Podfile deployment target');
  return true;
}

/**
 * The wrapper default (10s) drops the Gradle distribution download on slow networks.
 */
function patchGradleWrapper(projectDir) {
  const wrapperPath = path.join(
    projectDir,
    'android',
    'gradle',
    'wrapper',
    'gradle-wrapper.properties',
  );
  if (!fs.existsSync(wrapperPath)) {
    return false;
  }

  const timeoutMs = 180000;
  let content = fs.readFileSync(wrapperPath, 'utf8');
  const match = content.match(/^networkTimeout=(\d+)\s*$/m);

  if (match && Number(match[1]) >= timeoutMs) {
    return false;
  }

  if (match) {
    content = content.replace(
      /^networkTimeout=\d+\s*$/m,
      `networkTimeout=${timeoutMs}`,
    );
  } else if (content.includes('distributionUrl=')) {
    content = content.replace(
      /^(distributionUrl=.*)$/m,
      `$1\nnetworkTimeout=${timeoutMs}`,
    );
  } else {
    content = `${content.replace(/\s*$/, '')}\nnetworkTimeout=${timeoutMs}\n`;
  }

  fs.writeFileSync(wrapperPath, content, 'utf8');
  console.log('✅ Patched gradle-wrapper.properties (networkTimeout)');
  return true;
}

/**
 * Draw behind system bars. Screens already use safe area insets.
 */
function patchGradleProperties(projectDir) {
  const propsPath = path.join(projectDir, 'android', 'gradle.properties');
  if (!fs.existsSync(propsPath)) {
    return false;
  }

  let content = fs.readFileSync(propsPath, 'utf8');
  if (!content.includes('edgeToEdgeEnabled=false')) {
    return false;
  }

  content = content.replace('edgeToEdgeEnabled=false', 'edgeToEdgeEnabled=true');
  fs.writeFileSync(propsPath, content, 'utf8');
  console.log('✅ Patched android/gradle.properties (edgeToEdgeEnabled)');
  return true;
}

/**
 * Run all native patches
 */
function patchAllNative(projectDir) {
  patchAndroidBuildGradle(projectDir);
  patchAndroidMainActivity(projectDir);
  patchAndroidManifest(projectDir);
  patchGradleWrapper(projectDir);
  patchGradleProperties(projectDir);
  patchIOSInfoPlist(projectDir);
  patchIOSPodfile(projectDir);
}

module.exports = {
  patchAllNative,
  patchAndroidBuildGradle,
  patchAndroidMainActivity,
  patchAndroidManifest,
  patchGradleWrapper,
  patchGradleProperties,
  patchIOSInfoPlist,
  patchIOSPodfile,
};
