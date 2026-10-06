#!/usr/bin/env node

/**
 * Refreshes cli/template from the starter repo that contains this cli folder.
 * Runs automatically before `npm pack` / `npm publish`.
 * When the cli folder is used on its own (no parent repo), the existing template is kept.
 */

const fs = require('fs');
const path = require('path');
const { copyDirectoryRecursive } = require('../lib/copy-src');

const CLI_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(CLI_ROOT, '..');
const TEMPLATE_DIR = path.join(CLI_ROOT, 'template');

const DIRECTORIES = ['src', 'patches'];
const FILES = ['.env.example'];

function main() {
  if (!fs.existsSync(path.join(REPO_ROOT, 'src'))) {
    if (!fs.existsSync(path.join(TEMPLATE_DIR, 'src'))) {
      console.error('❌ No starter src/ found next to cli/ and cli/template is empty.');
      process.exit(1);
    }
    console.log('ℹ️  Starter repo not found next to cli/. Keeping the existing template.');
    return;
  }

  fs.rmSync(TEMPLATE_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });

  for (const dir of DIRECTORIES) {
    const from = path.join(REPO_ROOT, dir);
    if (fs.existsSync(from)) {
      copyDirectoryRecursive(from, path.join(TEMPLATE_DIR, dir));
      console.log(`✅ template/${dir}`);
    }
  }

  for (const file of FILES) {
    const from = path.join(REPO_ROOT, file);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, path.join(TEMPLATE_DIR, file));
      console.log(`✅ template/${file}`);
    }
  }

  console.log('🎉 cli/template is up to date.');
}

main();
