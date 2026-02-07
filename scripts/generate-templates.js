// Comprehensive template generator - creates all 255+ templates
const fs = require('fs');

// Helper function to create template variations
function createTemplateSet(marketplace, prefix, color, category) {
  const sizes = [
    { id: '4x6-thermal-203', name: '4x6 Thermal (203 DPI)', size: '4" × 6"', dims: '101.6mm × 152.4mm', badge: 'Popular' },
    { id: '4x6-thermal-300', name: '4x6 Thermal (300 DPI)', size: '4" × 6"', dims: '101.6mm × 152.4mm', badge: '300 DPI' },
    { id: '4x6-inkjet', name: '4x6 Inkjet', size: '4" × 6"', dims: '101.6mm × 152.4mm', badge: 'Inkjet' },
    { id: '2.5x4-thermal-203', name: '2.5x4 Thermal (203 DPI)', size: '2.5" × 4"', dims: '63.5mm × 101.6mm', badge: 'Compact' },
    { id: '3x5-thermal-203', name: '3x5 Thermal (203 DPI)', size: '3" × 5"', dims: '76.2mm × 127mm', badge: 'Mid-Size' },
    { id: '3x5-thermal-300', name: '3x5 Thermal (300 DPI)', size: '3" × 5"', dims: '76.2mm × 127mm', badge: '300 DPI' },
    { id: '2x4-thermal-203', name: '2x4 Thermal (203 DPI)', size: '2" × 4"', dims: '50.8mm × 101.6mm', badge: 'Small' },
    { id: '2x4-thermal-300', name: '2x4 Thermal (300 DPI)', size: '2" × 4"', dims: '50.8mm × 101.6mm', badge: '300 DPI' },
    { id: '1.5x4-thermal-203', name: '1.5x4 Thermal (203 DPI)', size: '1.5" × 4"', dims: '38.1mm × 101.6mm', badge: 'Narrow' },
    { id: '4x6-desktop', name: '4x6 Desktop', size: '4" × 6"', dims: '101.6mm × 152.4mm', badge: 'Desktop' },
    { id: '6x4-thermal-203', name: '6x4 Thermal (203 DPI)', size: '6" × 4"', dims: '152.4mm × 101.6mm', badge: 'Landscape' },
    { id: '6x4-thermal-300', name: '6x4 Thermal (300 DPI)', size: '6" × 4"', dims: '152.4mm × 101.6mm', badge: '300 DPI' },
    { id: '4x3-thermal-203', name: '4x3 Thermal (203 DPI)', size: '4" × 3"', dims: '101.6mm × 76.2mm', badge: 'Compact' },
    { id: '4x3-thermal-300', name: '4x3 Thermal (300 DPI)', size: '4" × 3"', dims: '101.6mm × 76.2mm', badge: '300 DPI' },
    { id: '2.625x1-thermal-203', name: '2.625x1 Thermal (203 DPI)', size: '2.625" × 1"', dims: '66.675mm × 25.4mm', badge: 'Item' },
    { id: '3.25x2-thermal-203', name: '3.25x2 Thermal (203 DPI)', size: '3.25" × 2"', dims: '82.55mm × 50.8mm', badge: 'Small' },
    { id: '5x3-thermal-203', name: '5x3 Thermal (203 DPI)', size: '5" × 3"', dims: '127mm × 76.2mm', badge: 'Landscape' },
    { id: '5x3-thermal-300', name: '5x3 Thermal (300 DPI)', size: '5" × 3"', dims: '127mm × 76.2mm', badge: '300 DPI' },
    { id: '6x3-thermal-203', name: '6x3 Thermal (203 DPI)', size: '6" × 3"', dims: '152.4mm × 76.2mm', badge: 'Wide' },
    { id: '6x3-thermal-300', name: '6x3 Thermal (300 DPI)', size: '6" × 3"', dims: '152.4mm × 76.2mm', badge: '300 DPI' },
    { id: '4x7-thermal-203', name: '4x7 Thermal (203 DPI)', size: '4" × 7"', dims: '101.6mm × 177.8mm', badge: 'Tall' },
    { id: '4x7-thermal-300', name: '4x7 Thermal (300 DPI)', size: '4" × 7"', dims: '101.6mm × 177.8mm', badge: '300 DPI' },
    { id: '2.5x5-thermal-203', name: '2.5x5 Thermal (203 DPI)', size: '2.5" × 5"', dims: '63.5mm × 127mm', badge: 'Narrow' },
    { id: '2.5x5-thermal-300', name: '2.5x5 Thermal (300 DPI)', size: '2.5" × 5"', dims: '63.5mm × 127mm', badge: '300 DPI' },
    { id: '4x6-inkjet-300', name: '4x6 Inkjet (300 DPI)', size: '4" × 6"', dims: '101.6mm × 152.4mm', badge: '300 DPI' }
  ];

  return sizes.map(s => ({
    id: `${prefix}-${s.id}`,
    name: `${marketplace} ${s.name}`,
    size: s.size,
    dimensions: s.dims,
    type: s.id.includes('inkjet') ? 'Inkjet' : s.id.includes('desktop') ? 'Desktop' : 'Thermal',
    badge: s.badge,
    badgeColor: s.badge === '300 DPI' ? 'bg-purple-600' : color,
    category
  }));
}

// Generate all templates
const templates = {
  amazon: createTemplateSet('Amazon FBA', 'amazon-fba', 'bg-[#FF9900]', 'Amazon'),
  walmart: createTemplateSet('Walmart FWA', 'walmart-fwa', 'bg-[#0071DC]', 'Walmart'),
  ebay: createTemplateSet('eBay', 'ebay', 'bg-[#E53238]', 'eBay'),
  shopify: createTemplateSet('Shopify', 'shopify', 'bg-[#95BF47]', 'Shopify'),
  etsy: createTemplateSet('Etsy', 'etsy', 'bg-[#F1641E]', 'Etsy'),
  usps: createTemplateSet('USPS Priority Mail', 'usps', 'bg-[#333366]', 'Carrier'),
  fedex: createTemplateSet('FedEx Ground', 'fedex', 'bg-[#4D148C]', 'Carrier'),
  ups: createTemplateSet('UPS Ground', 'ups', 'bg-[#351C15]', 'Carrier'),
  dhl: createTemplateSet('DHL Express', 'dhl', 'bg-[#D40511]', 'Carrier'),
  ontrac: createTemplateSet('OnTrac', 'ontrac', 'bg-[#F26522]', 'Carrier').slice(0, 2),
  lasership: createTemplateSet('LaserShip', 'lasership', 'bg-[#D41C3C]', 'Carrier').slice(0, 2),
  pitneybowes: createTemplateSet('Pitney Bowes', 'pitneybowes', 'bg-[#002D72]', 'Carrier').slice(0, 2),
  stampscom: createTemplateSet('Stamps.com', 'stampscom', 'bg-[#0066CC]', 'Software').slice(0, 2),
  shipstation: createTemplateSet('ShipStation', 'shipstation', 'bg-[#95bf47]', 'Software').slice(0, 2),
  endicia: createTemplateSet('Endicia', 'endicia', 'bg-[#004e82]', 'Software').slice(0, 2),
  shippo: createTemplateSet('Shippo', 'shippo', 'bg-[#00af66]', 'Software').slice(0, 2),
  easypost: createTemplateSet('EasyPost', 'easypost', 'bg-[#0b163d]', 'Software').slice(0, 2),
  canadapost: createTemplateSet('Canada Post', 'canadapost', 'bg-[#E31837]', 'Carrier').slice(0, 2),
  royalmail: createTemplateSet('Royal Mail', 'royalmail', 'bg-[#D6001D]', 'Carrier').slice(0, 2),
  australiapost: createTemplateSet('Australia Post', 'australiapost', 'bg-[#DC1928]', 'Carrier').slice(0, 2),
  woocommerce: createTemplateSet('WooCommerce', 'woocommerce', 'bg-[#96588a]', 'E-Commerce').slice(0, 2),
  bigcommerce: createTemplateSet('BigCommerce', 'bigcommerce', 'bg-[#121118]', 'E-Commerce').slice(0, 2),
  magento: createTemplateSet('Magento', 'magento', 'bg-[#f26322]', 'E-Commerce').slice(0, 2),
  prestashop: createTemplateSet('PrestaShop', 'prestashop', 'bg-[#Df0067]', 'E-Commerce').slice(0, 2),
  opencart: createTemplateSet('OpenCart', 'opencart', 'bg-[#26b4d7]', 'E-Commerce').slice(0, 2),
  squarespace: createTemplateSet('Squarespace', 'squarespace', 'bg-[#000000]', 'E-Commerce').slice(0, 2),
  wix: createTemplateSet('Wix', 'wix', 'bg-[#0C6EFC]', 'E-Commerce').slice(0, 2),
  depop: createTemplateSet('Depop', 'depop', 'bg-[#FF0000]', 'Resale').slice(0, 2),
  poshmark: createTemplateSet('Poshmark', 'poshmark', 'bg-[#8d2a3c]', 'Resale').slice(0, 2),
  mercari: createTemplateSet('Mercari', 'mercari', 'bg-[#3333ff]', 'Resale').slice(0, 2),
  generic: createTemplateSet('Generic', 'generic', 'bg-slate-600', 'Generic').slice(0, 15)
};


// Calculate and display stats
const total = Object.values(templates).reduce((sum, arr) => sum + arr.length, 0);
console.log(`\n✅ Generated ${total} templates:`);
Object.entries(templates).forEach(([key, arr]) => {
  console.log(`   ${key}: ${arr.length} templates`);
});

// Write to file
fs.writeFileSync('d:/Projects/Label/src/data/templates.json', JSON.stringify(templates, null, 2));
console.log('\n✅ templates.json created successfully!\n');
