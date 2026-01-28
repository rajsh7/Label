/**
 * Verify extracted labels script
 * Run with: npx tsx scripts/verify-labels.ts
 */

import { ALL_LABELS, getCategories, getMarketplaces } from '../src/lib/constants/labels'

function verifyLabels() {
  console.log('🏷️  LabelPro - Label Extraction Verification')
  console.log('=' .repeat(50))
  
  console.log(`📦 Total Labels: ${ALL_LABELS.length}`)
  console.log(`📂 Categories: ${getCategories().length}`)
  console.log(`🏪 Marketplaces: ${getMarketplaces().length}`)
  
  console.log('\n📊 Labels by Category:')
  const categoryCounts = getCategories().map(category => ({
    category,
    count: ALL_LABELS.filter(label => label.category === category).length
  }))
  
  categoryCounts.forEach(({ category, count }) => {
    console.log(`  ${category}: ${count} labels`)
  })
  
  console.log('\n🏪 Labels by Marketplace:')
  const marketplaceCounts = getMarketplaces().map(marketplace => ({
    marketplace,
    count: ALL_LABELS.filter(label => label.marketplace === marketplace).length
  }))
  
  marketplaceCounts.forEach(({ marketplace, count }) => {
    console.log(`  ${marketplace}: ${count} labels`)
  })
  
  console.log('\n🖨️  Print Methods:')
  const printMethods = ['thermal', 'inkjet', 'desktop']
  printMethods.forEach(method => {
    const count = ALL_LABELS.filter(label => label.print_method === method).length
    console.log(`  ${method}: ${count} labels`)
  })
  
  console.log('\n✅ Sample Labels:')
  ALL_LABELS.slice(0, 5).forEach(label => {
    console.log(`  ${label.id}: ${label.name} (${label.width_mm}x${label.height_mm}mm)`)
  })
  
  console.log('\n🎉 Label extraction verification complete!')
  console.log(`Ready to seed ${ALL_LABELS.length} labels to your database.`)
  console.log('\nNext steps:')
  console.log('1. Set up your Supabase credentials in .env.local')
  console.log('2. Run the database schema: scripts/database-schema.sql')
  console.log('3. Seed the labels: npm run seed:labels')
}

if (require.main === module) {
  verifyLabels()
}

export { verifyLabels }