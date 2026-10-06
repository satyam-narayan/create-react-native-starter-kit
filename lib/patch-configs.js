const fs = require('fs');
const path = require('path');

/**
 * Patch or generate babel.config.js
 */
function patchBabelConfig(projectDir) {
  const babelPath = path.join(projectDir, 'babel.config.js');
  const babelContent = `const path = require('path');
const env =
  require('dotenv').config({
    path: path.resolve(__dirname, '.env'),
  }).parsed || {};

module.exports = {
  presets: ['module:@react-native/babel-preset'],

  //by own
  plugins: [
    [
      'transform-inline-environment-variables',
      { include: Object.keys(env) },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    ['react-native-worklets/plugin'],
  ],
};
`;
  fs.writeFileSync(babelPath, babelContent, 'utf8');
}

/**
 * Ship a sample env file and keep real env files out of git.
 */
function patchEnvExample(projectDir) {
  const envExample = [
    '# Leave API_BASE_URL unset to use the built-in mock API (src/services/api/mock).',
    '# Set it to your backend URL to call the real server.',
    '# API_BASE_URL=https://api.example.com',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(projectDir, '.env.example'), envExample, 'utf8');

  const gitignorePath = path.join(projectDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    return;
  }

  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!/(^|\n)\.env(\n|$)/.test(gitignore)) {
    fs.appendFileSync(
      gitignorePath,
      '\n# Environment\n.env\n.env.local\n',
      'utf8',
    );
  }
}

/**
 * Patch or generate metro.config.js
 */
function patchMetroConfig(projectDir) {
  const metroPath = path.join(projectDir, 'metro.config.js');
  const metroContent = `const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

//by own
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  //by own
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native',
    ),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
`;
  fs.writeFileSync(metroPath, metroContent, 'utf8');
}

/**
 * Remove // and /* *\/ comments and trailing commas from JSONC, leaving string contents
 * untouched (globs like "**\/*.ts" contain comment-like sequences).
 */
function stripJsonComments(raw) {
  let out = '';
  let inString = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const next = raw[i + 1];
    if (inString) {
      out += ch;
      if (ch === '\\') {
        out += next ?? '';
        i++;
      } else if (ch === '"') {
        inString = false;
      }
    } else if (ch === '"') {
      inString = true;
      out += ch;
    } else if (ch === '/' && next === '/') {
      while (i < raw.length && raw[i] !== '\n') i++;
      out += '\n';
    } else if (ch === '/' && next === '*') {
      i += 2;
      while (i < raw.length && !(raw[i] === '*' && raw[i + 1] === '/')) i++;
      i++;
    } else {
      out += ch;
    }
  }
  return out.replace(/,(\s*[}\]])/g, '$1');
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(stripJsonComments(raw));
  }
}

/**
 * Patch tsconfig.json
 */
function patchTsConfig(projectDir) {
  const tsConfigPath = path.join(projectDir, 'tsconfig.json');
  let tsConfig = { extends: '@react-native/typescript-config' };
  if (fs.existsSync(tsConfigPath)) {
    try {
      tsConfig = readJsonc(tsConfigPath);
    } catch (e) {
      console.log('⚠️ Could not parse tsconfig.json, writing a default one:', e.message);
    }
  }

  tsConfig.compilerOptions = tsConfig.compilerOptions || {};
  // `paths` resolves relative to tsconfig without `baseUrl`; TypeScript 6 rejects `baseUrl` as deprecated.
  delete tsConfig.compilerOptions.baseUrl;
  tsConfig.compilerOptions.paths = {
    '@/*': ['./src/*'],
    ...(tsConfig.compilerOptions.paths || {}),
  };
  tsConfig.compilerOptions.skipLibCheck = true;

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2) + '\n', 'utf8');
}

/**
 * Generate react-native.config.js
 */
function patchReactNativeConfig(projectDir) {
  const configPath = path.join(projectDir, 'react-native.config.js');
  const content = `module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: [
    './src/assets/fonts/',
  ],
};
`;
  fs.writeFileSync(configPath, content, 'utf8');
}

/**
 * Generate declarations.d.ts
 */
function patchDeclarations(projectDir) {
  const decPath = path.join(projectDir, 'declarations.d.ts');
  const content = `declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
`;
  fs.writeFileSync(decPath, content, 'utf8');
}

/**
 * Update App.tsx
 */
function patchAppTsx(projectDir) {
  const appPath = path.join(projectDir, 'App.tsx');
  const content = `/**
 * React Native Starter Kit
 *
 * Main entry point - exports the App component from src/app
 *
 * @format
 */

// Export the main App component from the src directory
export { default } from './src/app/App';
`;
  fs.writeFileSync(appPath, content, 'utf8');
}

/**
 * Copy or create scripts/generate-icons.js and update package.json scripts
 */
function patchScriptsAndPackageJson(projectDir) {
  const scriptsDir = path.join(projectDir, 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  const iconScriptPath = path.join(scriptsDir, 'generate-icons.js');
  const iconScriptContent = `const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.resolve(__dirname, '../src/assets/icons');
const OUTPUT_FILE = path.join(ICONS_DIR, 'index.ts');

if (!fs.existsSync(ICONS_DIR)) {
  console.log('⚠️ Icons directory not found:', ICONS_DIR);
  process.exit(0);
}

const files = fs.readdirSync(ICONS_DIR).filter(file => file.endsWith('.svg'));

const toPascalCase = name =>
  name.replace(/(^\\w|-\\w)/g, m => m.replace('-', '').toUpperCase());

const imports = files
  .map(file => {
    const name = toPascalCase(path.basename(file, '.svg'));
    return \`import \${name} from './\${file}';\`;
  })
  .join('\\n');

const mappings = files
  .map(file => {
    const key = path.basename(file, '.svg');
    const value = toPascalCase(key);
    return \`  \${key}: \${value},\`;
  })
  .join('\\n');

const content = \`\${imports}

export const Icons = {
\${mappings}
} as const;

export type IconName = keyof typeof Icons;
\`;

fs.writeFileSync(OUTPUT_FILE, content);
console.log('✅ Icons index.ts generated');
`;
  fs.writeFileSync(iconScriptPath, iconScriptContent, 'utf8');

  // Update target package.json
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['generate:icons'] = 'node scripts/generate-icons.js';
    pkg.scripts['postinstall'] = 'patch-package';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  }
}

/**
 * Run all JS/TS config patches
 */
function patchAllConfigs(projectDir) {
  patchBabelConfig(projectDir);
  patchEnvExample(projectDir);
  patchMetroConfig(projectDir);
  patchTsConfig(projectDir);
  patchReactNativeConfig(projectDir);
  patchDeclarations(projectDir);
  patchAppTsx(projectDir);
  patchScriptsAndPackageJson(projectDir);
}

module.exports = {
  patchAllConfigs,
  patchBabelConfig,
  patchEnvExample,
  patchMetroConfig,
  patchTsConfig,
  patchReactNativeConfig,
  patchDeclarations,
  patchAppTsx,
  patchScriptsAndPackageJson,
};
