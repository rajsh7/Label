/**
 * Database Label Dimension Validation
 * Checks all labels in the database for dimension accuracy
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

function mmToInches(mm: number): number {
  return Math.round((mm / 25.4) * 10000) / 10000
}

function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4)
}

async function validateAllLabels() {
  console.log('🔍 Validating all labels in database...\n')
  
  const { data: labels, error } = await supabase
    .from('labels')
    .select('*')
    .order('category', { ascending: true })
  
  if (error) {
    console.error('❌ Error fetching labels:', error)
    return
  }
  
  let totalLabels = 0
  let accurateLabels = 0
  let inaccurateLabels: any[] = []
  
  labels?.forEach(label => {
    totalLabels++
    
    const calculatedWidthInch = mmToInches(label.width_mm)
    const calculatedHeightInch = mmToInches(label.height_mm)
    const calculatedWidth203 = mmToPixels(label.width_mm, 203)
    const calculatedHeight203 = mmToPixels(label.height_mm, 203)
    const calculatedWidth300 = mmToPixels(label.width_mm, 300)
    const calculatedHeight300 = mmToPixels(label.height_mm, 300)
    
    const widthInchMatch = Math.abs(calculatedWidthInch - (label.width_inch || 0)) < 0.001
    const heightInchMatch = Math.abs(calculatedHeightInch - (label.height_inch || 0)) < 0.001
    const width203Match = calculatedWidth203 === (label.width_px_203dpi || 0)
    const height203Match = calculatedHeight203 === (label.height_px_203dpi || 0)
    const width300Match = calculatedWidth300 === (label.width_px_300dpi || 0)
    const height300Match = calculatedHeight300 === (label.height_px_300dpi || 0)
    
    const isAccurate = widthInchMatch && heightInchMatch && width203Match && height203Match && width300Match && height300Match
    
    if (isAccurate) {
      accurateLabels++
    } else {
      inaccurateLabels.push({
        id: label.id,
        name: label.name,
        category: label.category,
        issues: {
          widthInch: !widthInchMatch ? `${label.width_inch} → ${calculatedWidthInch}` : null,
          heightInch: !heightInchMatch ? `${label.height_inch} → ${calculatedHeightInch}` : null,
          width203: !width203Match ? `${label.width_px_203dpi} → ${calculatedWidth203}` : null,
          height203: !height203Match ? `${label.height_px_203dpi} → ${calculatedHeight203}` : null,
          width300: !width300Match ? `${label.width_px_300dpi} → ${calculatedWidth300}` : null,
          height300: !height300Match ? `${label.height_px_300dpi} → ${calculatedHeight300}` : null,
        }
      })
    }
  })
  
  console.log(`📊 Validation Results:`)
  console.log(`✅ Accurate labels: ${accurateLabels}/${totalLabels}`)
  console.log(`❌ Inaccurate labels: ${inaccurateLabels.length}/${totalLabels}`)
  
  if (inaccurateLabels.length > 0) {
    console.log('\n🔧 Labels needing correction:')
    inaccurateLabels.forEach(label => {
      console.log(`\n${label.id} (${label.category}):`)
      Object.entries(label.issues).forEach(([key, value]) => {
        if (value) console.log(`  ${key}: ${value}`)
      })
    })
  } else {
    console.log('\n🎉 All labels have accurate dimensions!')
  }
}

validateAllLabels()