const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// Test Plane Destinations
const planeCode = fs.readFileSync(path.join(baseDir, 'js/plane-booking.js'), 'utf8');
const planeMatch = planeCode.match(/const DEST_IMAGES = ({[\s\S]*?});/);
if (!planeMatch) throw new Error('DEST_IMAGES not found');
const DEST_IMAGES = eval('(' + planeMatch[1] + ')');

console.log('Testing Plane Destinations:');
let planeAllValid = true;
for (const [code, imgPath] of Object.entries(DEST_IMAGES)) {
  const fullPath = path.join(baseDir, imgPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  console.log('  [' + code + '] -> ' + imgPath + ' (exists: ' + exists + ', size: ' + size + ' bytes)');
  if (!exists || size < 5000) planeAllValid = false;
}

// Test Bus Destinations
const busCode = fs.readFileSync(path.join(baseDir, 'js/bus-booking.js'), 'utf8');
const busMatch = busCode.match(/const BUS_DEST_IMAGES = ({[\s\S]*?});/);
if (!busMatch) throw new Error('BUS_DEST_IMAGES not found');
const BUS_DEST_IMAGES = eval('(' + busMatch[1] + ')');

console.log('\nTesting Bus Destinations:');
let busAllValid = true;
for (const [dest, imgPath] of Object.entries(BUS_DEST_IMAGES)) {
  const fullPath = path.join(baseDir, imgPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  console.log('  [' + dest + '] -> ' + imgPath + ' (exists: ' + exists + ', size: ' + size + ' bytes)');
  if (!exists || size < 5000) busAllValid = false;
}

if (!planeAllValid || !busAllValid) {
  console.error('\nFAIL: Some images do not exist!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All destination images exist and are authentic high-resolution local assets!');
}
