// Quick test script for LabelPro
const pages = [
  'http://localhost:3000',
  'http://localhost:3000/login',
  'http://localhost:3000/signup',
  'http://localhost:3000/pricing',
  'http://localhost:3000/features',
  'http://localhost:3000/about',
  'http://localhost:3000/blog'
];

console.log('🧪 Testing LabelPro Pages...\n');

pages.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n📋 Manual Test Checklist:');
console.log('□ Homepage loads');
console.log('□ Login/Signup works');
console.log('□ Dashboard accessible after login');
console.log('□ Editor opens and functions');
console.log('□ Batch processor works');
console.log('□ Templates load');
console.log('□ Settings pages work');
console.log('□ Admin panel (after setting is_admin=true)');
console.log('\n✅ Run: npm run dev');
console.log('🌐 Open: http://localhost:3000');