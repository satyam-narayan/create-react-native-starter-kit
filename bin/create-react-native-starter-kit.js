#!/usr/bin/env node

const readline = require('readline');
const { createProject } = require('../lib/creator');

function showHelp() {
  console.log(`
Usage: create-react-native-starter-kit <ProjectName> [options]

Arguments:
  <ProjectName>       Name of the new React Native project (e.g. MyApp)

Options:
  --npm               Use npm as the package manager (default is yarn)
  --yarn              Use yarn as the package manager (default)
  --skip-install      Skip npm/yarn install and pod install
  --skip-pods         Skip CocoaPods pod install (macOS only)
  --dry-run           Simulate the creation process without writing files
  -h, --help          Display this help message

Examples:
  npx create-react-native-starter-kit MyApp
  npx create-react-native-starter-kit MyApp --npm
  npx create-react-native-starter-kit MyApp --skip-install
`);
}

async function promptProjectName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question('? Enter your project name (e.g. MyApp): ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  let projectName = null;
  const options = {
    packageManager: 'yarn',
    skipInstall: false,
    skipPods: false,
    dryRun: false,
  };

  for (const arg of args) {
    if (arg === '--npm') {
      options.packageManager = 'npm';
    } else if (arg === '--yarn') {
      options.packageManager = 'yarn';
    } else if (arg === '--skip-install') {
      options.skipInstall = true;
    } else if (arg === '--skip-pods') {
      options.skipPods = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (!arg.startsWith('-') && !projectName) {
      projectName = arg;
    }
  }

  if (!projectName) {
    projectName = await promptProjectName();
  }

  if (!projectName) {
    console.error('❌ Error: Project name is required.');
    process.exit(1);
  }

  try {
    await createProject({
      projectName,
      ...options,
    });
  } catch (error) {
    console.error('\n❌ Failed to create project:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
