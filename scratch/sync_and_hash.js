const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDir = 'C:\\Antigravity files\\Mckanes Travel and Tours';
const destDir = 'C:\\Antigravity files';

const docFiles = ['error.md', 'log.md', 'feature.md', 'design.md', 'INCIDENTS_LOG.MD', 'rules.md'];

function sha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

console.log('=== Synchronizing and verifying SHA256 parity ===');

let allMatch = true;

docFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    const hashSrc = sha256(srcPath);
    const hashDest = sha256(destPath);
    const match = (hashSrc === hashDest);
    console.log(`${file}:`);
    console.log(`  Source: ${hashSrc}`);
    console.log(`  Dest:   ${hashDest}`);
    console.log(`  Status: ${match ? 'PARITY VERIFIED' : 'MISMATCH'}`);
    if (!match) allMatch = false;
  } else {
    console.warn(`File ${srcPath} does not exist in source.`);
  }
});

if (allMatch) {
  console.log('\nSUCCESS: 100% SHA256 Cryptographic Parity Across All Documentation Files!');
} else {
  console.error('\nFAILURE: Cryptographic mismatch detected!');
  process.exit(1);
}
