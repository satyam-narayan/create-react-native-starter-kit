const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory, ignoring unwanted system files
 */
function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.DS_Store' || entry.name === 'Thumbs.db') {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Recursively find all files in a directory
 */
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Sanitize all source files to prevent accidental 'node_modules/' prefixes in imports
 */
function sanitizeSourceFiles(targetSrcDir) {
  if (!fs.existsSync(targetSrcDir)) return;

  const files = getAllFiles(targetSrcDir);
  let sanitizedCount = 0;

  for (const filePath of files) {
    if (!/\.(tsx?|jsx?)$/.test(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('node_modules/')) {
      // Replaces 'node_modules/package-name' -> 'package-name'
      const sanitized = content.replace(/(['"])node_modules\//g, '$1');
      if (sanitized !== content) {
        fs.writeFileSync(filePath, sanitized, 'utf8');
        sanitizedCount++;
      }
    }
  }

  if (sanitizedCount > 0) {
    console.log(`🧹 Sanitized ${sanitizedCount} file(s) with clean module import paths.`);
  }
}

/**
 * Copy starter src directory to target project and sanitize imports
 */
function copySrcFolder(starterRoot, targetDir) {
  const sourceSrc = path.join(starterRoot, 'src');
  const targetSrc = path.join(targetDir, 'src');

  if (!fs.existsSync(sourceSrc)) {
    throw new Error(`Starter src directory not found at: ${sourceSrc}`);
  }

  console.log('📦 Copying src/ directory into target project...');
  copyDirectoryRecursive(sourceSrc, targetSrc);
  sanitizeSourceFiles(targetSrc);
  console.log('✅ Successfully copied and validated src/ directory');
}


/**
 * Copy starter patches directory to target project if it exists
 */
function copyPatchesFolder(starterRoot, targetDir) {
  const sourcePatches = path.join(starterRoot, "patches");
  const targetPatches = path.join(targetDir, "patches");

  if (fs.existsSync(sourcePatches)) {
    console.log("📦 Copying patches/ directory into target project...");
    copyDirectoryRecursive(sourcePatches, targetPatches);
    console.log("✅ Successfully copied patches/ directory");
  }
}

/**
 * Copy the starter .env.example (documents the mock API switch) into the target project
 */
function copyEnvExample(starterRoot, targetDir) {
  const source = path.join(starterRoot, '.env.example');
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(targetDir, '.env.example'));
  }
}

module.exports = {
  copySrcFolder,
  copyPatchesFolder,
  copyEnvExample,
  copyDirectoryRecursive,
  sanitizeSourceFiles,
};
