const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { STARTER_DEPENDENCIES, STARTER_DEV_DEPENDENCIES } = require('./deps');
const { patchAllConfigs } = require('./patch-configs');
const { patchAllNative } = require('./patch-native');
const { copySrcFolder, copyPatchesFolder, copyEnvExample } = require('./copy-src');

/**
 * Execute command with stdout/stderr inherited
 */
function runCommand(cmd, cwd = process.cwd()) {
  console.log(`\n🚀 Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

/**
 * Validate project name
 */
function validateProjectName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Project name must be provided.');
  }
  const cleanName = name.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(cleanName)) {
    throw new Error(
      `Invalid project name: "${cleanName}". Project name must start with a letter and contain only alphanumeric characters or underscores (e.g. MyProject or my_project).`
    );
  }
  return cleanName;
}

/**
 * Update package.json with starter dependencies and devDependencies
 */
function updatePackageJsonDependencies(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`package.json not found in ${projectDir}`);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  pkg.dependencies = pkg.dependencies || {};
  pkg.devDependencies = pkg.devDependencies || {};

  console.log('\n📦 Adding starter dependencies to package.json...');

  for (const dep of STARTER_DEPENDENCIES) {
    if (dep === 'react' || dep === 'react-native') {
      continue;
    }
    pkg.dependencies[dep] = 'latest';
  }

  for (const dep of STARTER_DEV_DEPENDENCIES) {
    pkg.devDependencies[dep] = 'latest';
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('✅ package.json dependencies updated.');
}

/**
 * Main project creation orchestrator
 */
async function createProject({
  projectName,
  targetDir = process.cwd(),
  starterRoot = path.resolve(__dirname, '../template'),
  packageManager = 'yarn', // or 'npm'
  skipInstall = false,
  skipPods = false,
  dryRun = false,
}) {
  const name = validateProjectName(projectName);
  const projectDir = path.join(targetDir, name);

  console.log('\n============================================================');
  console.log(`✨ Creating React Native Starter Project: ${name}`);
  console.log(`📂 Destination: ${projectDir}`);
  console.log(`🔧 Package Manager: ${packageManager}`);
  console.log('⚛️  React Native: latest stable release');
  console.log('⚡ Installing latest library versions directly from npm registry');
  console.log('============================================================\n');

  if (fs.existsSync(projectDir)) {
    throw new Error(`Directory "${projectDir}" already exists. Please choose a different name or remove the existing directory.`);
  }

  if (!fs.existsSync(path.join(starterRoot, 'src'))) {
    throw new Error(`Starter template not found at ${starterRoot}. Run "npm run sync-template" inside the cli folder first.`);
  }

  if (dryRun) {
    console.log('🔍 [DRY RUN] Simulating steps without writing files:');
    console.log(`1. Initialize bare React Native CLI project (${name}, latest stable React Native)`);
    console.log('2. Copy src/ folder, patches/, and scripts');
    console.log(`3. Install latest starter dependencies dynamically via ${packageManager} add`);
    console.log('4. Apply JS/TS configurations (babel, metro, tsconfig, declarations, App.tsx)');
    console.log('5. Apply Native configurations (Android build.gradle, MainActivity, AndroidManifest, iOS Info.plist)');
    console.log('6. Link font assets (react-native-asset) and generate icons');
    console.log('7. Run pod install (if on macOS)');
    console.log('\n✅ Dry run completed successfully.');
    return;
  }

  // Step 1: Initialize bare React Native CLI project
  console.log('\n📥 Step 1/7: Initializing bare React Native CLI project (latest stable React Native)...');
  // Without --version, init uses react-native's "latest" dist-tag, which only points to stable releases (RCs go to "next").
  const initCmd = `npx @react-native-community/cli@latest init ${name} --skip-install`;
  runCommand(initCmd, targetDir);

  // Step 2: Copy src directory and assets
  console.log('\n📁 Step 2/7: Copying src/ directory, patches/, and assets...');
  copySrcFolder(starterRoot, projectDir);
  copyPatchesFolder(starterRoot, projectDir);

  // Step 3: Install starter dependencies (always latest from registry)
  if (!skipInstall) {
    console.log(`\n📦 Step 3/7: Installing latest starter dependencies using ${packageManager}...`);
    const depsString = STARTER_DEPENDENCIES.join(' ');
    const devDepsString = STARTER_DEV_DEPENDENCIES.join(' ');

    if (packageManager === 'yarn') {
      runCommand(`yarn add ${depsString}`, projectDir);
      runCommand(`yarn add -D ${devDepsString}`, projectDir);
    } else {
      runCommand(`npm install --legacy-peer-deps ${depsString}`, projectDir);
      runCommand(`npm install -D --legacy-peer-deps ${devDepsString}`, projectDir);
    }
  } else {
    console.log('\n📝 Step 3/7: Adding starter dependencies to package.json (latest)...');
    updatePackageJsonDependencies(projectDir);
  }

  // Step 4: Apply JS/TS config patches
  console.log('\n⚙️ Step 4/7: Applying Babel, Metro, TS, and App configurations...');
  patchAllConfigs(projectDir);
  copyEnvExample(starterRoot, projectDir);

  // Apply dependency patches via patch-package if present
  const patchesDir = path.join(projectDir, 'patches');
  if (fs.existsSync(patchesDir) && !skipInstall) {
    console.log('\n🩹 Applying dependency patches (patch-package)...');
    try {
      runCommand('npx patch-package', projectDir);
    } catch (e) {
      console.log('⚠️ Note: patch-package completed with warnings:', e.message);
    }
  }

  // Step 5: Apply Native Android and iOS patches
  console.log('\n📱 Step 5/7: Applying Android and iOS native configurations & permissions...');
  patchAllNative(projectDir);

  // Step 6: Asset linking & Icon generation
  if (!skipInstall) {
    console.log('\n🎨 Step 6/7: Linking font assets & generating icons...');
    try {
      runCommand('npx react-native-asset', projectDir);
    } catch (e) {
      console.log('⚠️ Note: react-native-asset completed with warnings:', e.message);
    }

    try {
      runCommand('node scripts/generate-icons.js', projectDir);
    } catch (e) {
      console.log('⚠️ Note: Icon generation completed with warnings:', e.message);
    }
  } else {
    console.log('\n⏭️ Step 6/7: Skipped asset linking & icon generation (--skip-install).');
  }

  // Step 7: iOS Pods installation (macOS only)
  if (!skipPods && !skipInstall && process.platform === 'darwin') {
    const iosDir = path.join(projectDir, 'ios');
    if (fs.existsSync(iosDir)) {
      console.log('\n🍎 Step 7/7: Installing iOS CocoaPods...');
      try {
        runCommand('pod install', iosDir);
      } catch (e) {
        console.log('⚠️ CocoaPods installation encountered an issue. You can run "cd ios && pod install" manually.');
      }
    }
  } else {
    console.log('\n⏭️ Step 7/7: Skipped CocoaPods installation.');
  }

  // Finished!
  console.log('\n============================================================');
  console.log(`🎉 Project ${name} is ready!`);
  console.log('============================================================');
  console.log('\nNext steps:');
  console.log(`  1. cd ${name}`);
  if (skipInstall) {
    console.log(`  2. ${packageManager === 'yarn' ? 'yarn install' : 'npm install'}`);
    if (process.platform === 'darwin') {
      console.log('  3. cd ios && pod install && cd ..');
    }
  }
  console.log(`  ${skipInstall ? '4' : '2'}. ${packageManager === 'yarn' ? 'yarn' : 'npm run'} android   (Run Android)`);
  console.log(`  ${skipInstall ? '5' : '3'}. ${packageManager === 'yarn' ? 'yarn' : 'npm run'} ios       (Run iOS)`);
  console.log('============================================================\n');
}

module.exports = {
  createProject,
  validateProjectName,
  updatePackageJsonDependencies,
};
