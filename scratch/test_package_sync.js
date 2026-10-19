const fs = require('fs');

const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};
global.window = {
  addEventListener: () => {},
  dispatchEvent: () => {}
};
global.document = {
  getElementById: () => null,
  querySelectorAll: () => []
};

const mainJs = fs.readFileSync('js/main.js', 'utf8');

// Extract VACATION_PACKAGES and getClientVacationPackages
const sliceCode = mainJs.substring(
  mainJs.indexOf('const VACATION_PACKAGES = ['),
  mainJs.indexOf('function renderPackageCards')
);

// Run the extracted code
const fn = new Function('global', 'localStorage', 'window', 'document', sliceCode + '; return { VACATION_PACKAGES, getClientVacationPackages };');
const { VACATION_PACKAGES, getClientVacationPackages } = fn(global, global.localStorage, global.window, global.document);

console.log('VACATION_PACKAGES loaded:', VACATION_PACKAGES.length);
let clientPkgs = getClientVacationPackages();
console.log('Initial client packages count:', clientPkgs.length);
console.log('Boracay initial price:', clientPkgs.find(p => p.id === 'boracay-escape').basePrice);

// Simulate admin saving modified packages
const adminPackages = [
  {
    id: 'boracay-escape',
    altId: 'boracay-escape',
    name: 'Boracay Ultimate Tropical Retreat (Super Promo)',
    destination: 'Boracay Island, Aklan',
    duration: '3D2N',
    price: 6999,
    basePrice: 6999,
    originalPrice: 11999,
    status: 'Active',
    booked: 28,
    capacity: 30
  },
  {
    id: 'coron-odyssey',
    altId: 'coron-odyssey',
    name: 'Coron Island Odyssey',
    destination: 'Coron, Palawan',
    duration: '4D3N',
    price: 11999,
    basePrice: 11999,
    originalPrice: 15999,
    status: 'Paused',
    booked: 25,
    capacity: 25
  },
  {
    id: 'banaue-heritage',
    altId: 'baguio-banaue',
    name: 'Banaue & Batad Rice Terraces Heritage',
    destination: 'Banaue, Ifugao',
    duration: '3D2N',
    price: 4999,
    basePrice: 4999,
    originalPrice: 7999,
    status: 'Active',
    booked: 10,
    capacity: 20
  }
];

global.localStorage.setItem('mckanes_admin_packages', JSON.stringify(adminPackages));

clientPkgs = getClientVacationPackages();
const boracay = clientPkgs.find(p => p.id === 'boracay-escape');
console.log('Boracay updated name:', boracay.name);
console.log('Boracay updated basePrice:', boracay.basePrice);
console.log('Boracay updated discount:', boracay.discount);

const coron = clientPkgs.find(p => p.id === 'coron-odyssey');
console.log('Coron status:', coron.status);

const banaue = clientPkgs.find(p => p.id === 'baguio-banaue');
console.log('Banaue (mapped via altId) basePrice:', banaue.basePrice);
console.log('Banaue discount:', banaue.discount);

if (boracay.basePrice === 6999 && coron.status === 'Paused' && banaue.basePrice === 4999) {
  console.log('\nTEST RESULT: ALL SYNC CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('\nTEST RESULT: SYNC FAILED');
  process.exit(1);
}
