const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { validateProjectName, updatePackageJsonDependencies } = require('./lib/creator');
const { patchAllConfigs } = require('./lib/patch-configs');
const { patchAllNative } = require('./lib/patch-native');
const { copySrcFolder, copyPatchesFolder, sanitizeSourceFiles } = require('./lib/copy-src');

const TEST_DIR = path.join(__dirname, '__test_mock_project__');

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

function runTests() {
  console.log('🧪 Starting CLI Patcher and Generator Verification Tests...\n');
  cleanup();

  // Test 1: Project Name Validation
  console.log('Test 1: Project Name Validation');
  assert.strictEqual(validateProjectName('AwesomeApp'), 'AwesomeApp');
  assert.strictEqual(validateProjectName('my_app_123'), 'my_app_123');
  assert.throws(() => validateProjectName('123App'), /Invalid project name/);
  assert.throws(() => validateProjectName('App with spaces'), /Invalid project name/);
  assert.throws(() => validateProjectName('App-with-dash'), /Invalid project name/);
  console.log('✅ Passed Test 1: Project Name Validation');

  // Create mock directory structure simulating React Native CLI init output
  fs.mkdirSync(TEST_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(TEST_DIR, 'package.json'),
    JSON.stringify({ name: 'mock_project', version: '0.0.1', scripts: { start: 'react-native start' }, dependencies: { react: '19.2.0', 'react-native': '0.83.1' } }, null, 2)
  );

  fs.writeFileSync(
    path.join(TEST_DIR, 'tsconfig.json'),
    `{
  // React Native template tsconfig
  "extends": "@react-native/typescript-config",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["**/node_modules", "**/Pods"],
}
`
  );

  // Mock android structure
  const androidAppDir = path.join(TEST_DIR, 'android', 'app');
  const androidSrcDir = path.join(androidAppDir, 'src', 'main');
  const javaDir = path.join(androidSrcDir, 'java', 'com', 'mockproject');
  fs.mkdirSync(javaDir, { recursive: true });
  fs.writeFileSync(
    path.join(androidAppDir, 'build.gradle'),
    `dependencies {
    implementation("com.facebook.react:react-android")
}`
  );
  fs.writeFileSync(
    path.join(javaDir, 'MainActivity.kt'),
    `package com.mockproject

import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "mock_project"
}
`
  );
  const wrapperDir = path.join(TEST_DIR, 'android', 'gradle', 'wrapper');
  fs.mkdirSync(wrapperDir, { recursive: true });
  fs.writeFileSync(
    path.join(wrapperDir, 'gradle-wrapper.properties'),
    `distributionUrl=https\\://services.gradle.org/distributions/gradle-9.0.0-bin.zip
networkTimeout=10000
`,
  );
  fs.writeFileSync(
    path.join(androidSrcDir, 'AndroidManifest.xml'),
    `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
      android:name=".MainApplication"
      android:label="@string/app_name">
    </application>
</manifest>`
  );

  // Mock ios structure
  const iosProjectDir = path.join(TEST_DIR, 'ios', 'mockproject');
  fs.mkdirSync(iosProjectDir, { recursive: true });
  fs.writeFileSync(
    path.join(iosProjectDir, 'Info.plist'),
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>CFBundleName</key>
\t<string>mockproject</string>
</dict>
</plist>`
  );
  fs.writeFileSync(
    path.join(iosProjectDir, 'AppDelegate.swift'),
    `import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "mockproject",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
}
`
  );
  const xcodeprojDir = path.join(TEST_DIR, 'ios', 'mockproject.xcodeproj');
  fs.mkdirSync(xcodeprojDir, { recursive: true });
  fs.writeFileSync(
    path.join(xcodeprojDir, 'project.pbxproj'),
    `// !$*UTF8*$!
{
\tobjects = {

/* Begin PBXBuildFile section */
\t\t761780ED2CA45674006654EE /* AppDelegate.swift in Sources */ = {isa = PBXBuildFile; fileRef = 761780EC2CA45674006654EE /* AppDelegate.swift */; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
\t\t761780EC2CA45674006654EE /* AppDelegate.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; name = AppDelegate.swift; path = mockproject/AppDelegate.swift; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXGroup section */
\t\t13B07FAE1A68108700A75B9A /* mockproject */ = {
\t\t\tisa = PBXGroup;
\t\t\tchildren = (
\t\t\t\t761780EC2CA45674006654EE /* AppDelegate.swift */,
\t\t\t);
\t\t};
/* End PBXGroup section */

/* Begin PBXSourcesBuildPhase section */
\t\t13B07F871A680F5B00A75B9A /* Sources */ = {
\t\t\tisa = PBXSourcesBuildPhase;
\t\t\tfiles = (
\t\t\t\t761780ED2CA45674006654EE /* AppDelegate.swift in Sources */,
\t\t\t);
\t\t};
/* End PBXSourcesBuildPhase section */
\t};
}
`
  );

  // Test 2: Copy src folder
  console.log('\nTest 2: Copy src/ directory & sanitize imports');
  const starterRoot = path.resolve(__dirname, 'template');
  copySrcFolder(starterRoot, TEST_DIR);
  copyPatchesFolder(starterRoot, TEST_DIR);
  assert(fs.existsSync(path.join(TEST_DIR, "patches", "react-native-element-dropdown+2.12.4.patch")), "patches/react-native-element-dropdown+2.12.4.patch should exist");
  assert(fs.existsSync(path.join(TEST_DIR, 'src', 'app', 'App.tsx')), 'src/app/App.tsx should exist');
  assert(fs.existsSync(path.join(TEST_DIR, 'src', 'services', 'query', 'queryClient.ts')), 'query client should be copied');
  assert(fs.existsSync(path.join(TEST_DIR, 'src', 'context', 'NetworkContext.tsx')), 'network context should be copied');
  assert(fs.existsSync(path.join(TEST_DIR, 'src', 'assets', 'fonts')), 'src/assets/fonts should exist');

  // Test import sanitizer
  const dummyFile = path.join(TEST_DIR, 'src', 'dummy-test.ts');
  fs.writeFileSync(dummyFile, "import { init } from 'node_modules/react-i18next';", 'utf8');
  sanitizeSourceFiles(path.join(TEST_DIR, 'src'));
  const sanitizedContent = fs.readFileSync(dummyFile, 'utf8');
  assert.strictEqual(sanitizedContent, "import { init } from 'react-i18next';");
  fs.unlinkSync(dummyFile);
  console.log('✅ Passed Test 2: Copy src directory & sanitize imports');

  // Test 3: Update package.json
  console.log('\nTest 3: Update package.json dependencies');
  updatePackageJsonDependencies(TEST_DIR);
  const pkg = JSON.parse(fs.readFileSync(path.join(TEST_DIR, 'package.json'), 'utf8'));
  assert(pkg.dependencies['@reduxjs/toolkit'], '@reduxjs/toolkit should be in dependencies');
  assert(pkg.dependencies['react-native-screens'], 'react-native-screens should be in dependencies');
  assert(pkg.dependencies['rn-international-phone-number'], 'rn-international-phone-number should be in dependencies');
  assert(!pkg.dependencies['react-native-international-phone-number'], 'old phone library should be removed');
  assert(pkg.dependencies['@tanstack/react-query'], '@tanstack/react-query should be in dependencies');
  assert(pkg.dependencies['@react-native-community/netinfo'], 'netinfo should be in dependencies');
  assert(pkg.dependencies['@react-native-documents/picker'], 'document picker should be in dependencies');
  assert(pkg.devDependencies['babel-plugin-module-resolver'], 'babel-plugin-module-resolver should be in devDependencies');
  assert(pkg.devDependencies['dotenv'], 'dotenv should be in devDependencies');
  assert(pkg.devDependencies['patch-package'], 'patch-package should be in devDependencies');
  console.log('✅ Passed Test 3: package.json updated');

  // Test 4: JS/TS Config Patches
  console.log('\nTest 4: JS/TS Config Patches');
  patchAllConfigs(TEST_DIR);
  const babelContent = fs.readFileSync(path.join(TEST_DIR, 'babel.config.js'), 'utf8');
  assert(babelContent.includes('module-resolver') && babelContent.includes('//by own'), 'babel.config.js has custom setup');
  assert(babelContent.includes('transform-inline-environment-variables'), 'babel.config.js inlines env vars');
  assert(fs.existsSync(path.join(TEST_DIR, '.env.example')), '.env.example should be generated');

  const metroContent = fs.readFileSync(path.join(TEST_DIR, 'metro.config.js'), 'utf8');
  assert(metroContent.includes('react-native-svg-transformer') && metroContent.includes('//by own'), 'metro.config.js has custom setup');

  const tsConfig = JSON.parse(fs.readFileSync(path.join(TEST_DIR, 'tsconfig.json'), 'utf8'));
  assert(tsConfig.compilerOptions.paths['@/*'][0] === './src/*', 'tsconfig paths alias configured');
  assert(tsConfig.compilerOptions.baseUrl === undefined, 'tsconfig should not use deprecated baseUrl');
  assert.deepStrictEqual(tsConfig.include, ['**/*.ts', '**/*.tsx'], 'tsconfig include globs should survive comment stripping');

  const rnConfig = fs.readFileSync(path.join(TEST_DIR, 'react-native.config.js'), 'utf8');
  assert(rnConfig.includes('./src/assets/fonts/'), 'react-native.config.js has font assets');

  const decContent = fs.readFileSync(path.join(TEST_DIR, 'declarations.d.ts'), 'utf8');
  assert(decContent.includes("declare module '*.svg'"), 'declarations.d.ts has svg declaration');

  const appContent = fs.readFileSync(path.join(TEST_DIR, 'App.tsx'), 'utf8');
  assert(appContent.includes("export { default } from './src/app/App';"), 'App.tsx points to src/app/App');

  const updatedPkg = JSON.parse(fs.readFileSync(path.join(TEST_DIR, 'package.json'), 'utf8'));
  assert(updatedPkg.scripts['generate:icons'] === 'node scripts/generate-icons.js', 'generate:icons script added');
  assert(updatedPkg.scripts['postinstall'] === 'patch-package', 'postinstall patch-package script added');
  console.log('✅ Passed Test 4: All JS/TS configs patched');

  // Test 5: Native Android & iOS Patches
  console.log('\nTest 5: Native Android & iOS Patches');
  patchAllNative(TEST_DIR);

  const gradleContent = fs.readFileSync(path.join(androidAppDir, 'build.gradle'), 'utf8');
  assert(gradleContent.includes('implementation("androidx.activity:activity:1.+") //by own'), 'build.gradle has custom androidx.activity');

  const mainActivity = fs.readFileSync(path.join(javaDir, 'MainActivity.kt'), 'utf8');
  assert(mainActivity.includes('RNScreensFragmentFactory()') && mainActivity.includes('//By Own'), 'MainActivity.kt has RNScreensFragmentFactory');
  assert(mainActivity.includes('reloadIfDisplaySizeChanged'), 'MainActivity.kt reloads when display size changes');
  for (const line of mainActivity.split('\n')) {
    assert(!/import\s+\S+import\s/.test(line), `MainActivity.kt has two imports on one line: ${line}`);
  }
  for (const name of ['android.os.Bundle', 'com.facebook.react.ReactApplication', 'com.facebook.react.ReactActivity']) {
    assert(new RegExp(`^import ${name.replace(/\./g, '\\.')}$`, 'm').test(mainActivity), `MainActivity.kt imports ${name} on its own line`);
  }

  const manifest = fs.readFileSync(path.join(androidSrcDir, 'AndroidManifest.xml'), 'utf8');
  assert(manifest.includes('enableOnBackInvokedCallback="false"'), 'AndroidManifest has enableOnBackInvokedCallback');
  assert(manifest.includes('android.permission.CAMERA'), 'AndroidManifest has camera permission');
  assert(manifest.includes('android.permission.READ_MEDIA_IMAGES'), 'AndroidManifest has photo permission');

  const wrapperProps = fs.readFileSync(
    path.join(TEST_DIR, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties'),
    'utf8',
  );
  assert(wrapperProps.includes('networkTimeout=180000'), 'Gradle wrapper download timeout is 180s');

  const infoPlist = fs.readFileSync(path.join(iosProjectDir, 'Info.plist'), 'utf8');
  assert(infoPlist.includes('NSPhotoLibraryUsageDescription'), 'Info.plist has Photo library permission');
  assert(infoPlist.includes('NSCameraUsageDescription'), 'Info.plist has Camera permission');
  assert(infoPlist.includes('UIAppFonts'), 'Info.plist has UIAppFonts');
  assert(infoPlist.includes('$(PRODUCT_MODULE_NAME).SceneDelegate'), 'Info.plist registers the SceneDelegate');
  assert(/<\/dict>\s*<\/dict>\s*<\/plist>\s*$/.test(infoPlist), 'Info.plist scene manifest is inside the root dict');

  const appDelegate = fs.readFileSync(path.join(iosProjectDir, 'AppDelegate.swift'), 'utf8');
  assert(!appDelegate.includes('UIWindow') && !appDelegate.includes('RCTReactNativeFactory'), 'AppDelegate no longer starts React Native');

  const sceneDelegate = fs.readFileSync(path.join(iosProjectDir, 'SceneDelegate.swift'), 'utf8');
  assert(sceneDelegate.includes('class SceneDelegate: RCTDefaultReactNativeFactoryDelegate, UIWindowSceneDelegate'), 'SceneDelegate.swift is created');
  assert(sceneDelegate.includes('withModuleName: "mockproject"'), 'SceneDelegate starts the app module');
  assert(sceneDelegate.includes('UIWindow(windowScene: windowScene)'), 'SceneDelegate creates the window from the scene');

  const pbxproj = fs.readFileSync(path.join(xcodeprojDir, 'project.pbxproj'), 'utf8');
  assert.strictEqual((pbxproj.match(/SceneDelegate\.swift in Sources/g) || []).length, 2, 'pbxproj has SceneDelegate build file and Sources entry');
  assert(pbxproj.includes('path = mockproject/SceneDelegate.swift; sourceTree = "<group>"'), 'pbxproj has SceneDelegate file reference');
  assert(/^\t\t\t\t[0-9A-F]{24} \/\* SceneDelegate\.swift \*\/,$/m.test(pbxproj), 'SceneDelegate is in the app group');

  const { patchIOSSceneLifecycle } = require('./lib/patch-native');
  assert.strictEqual(patchIOSSceneLifecycle(TEST_DIR), false, 'UIScene patch is idempotent');
  console.log('✅ Passed Test 5: All Android and iOS native files patched');

  // Clean up mock directory
  cleanup();
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The CLI generator is fully verified.\n');
}

runTests();
