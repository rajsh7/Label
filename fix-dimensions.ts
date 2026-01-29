/**
 * Fix all label dimensions in database
 * Corrects mm to inch conversions and pixel calculations
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

async function fixAllDimensions() {
  console.log('🔧 Fixing all label dimensions...\n')
  
  const { data: labels, error } = await supabase
    .from('labels')
    .select('*')
  
  if (error) {
    console.error('❌ Error fetching labels:', error)
    return
  }
  
  let fixedCount = 0
  
  for (const label of labels || []) {
    const correctWidthInch = mmToInches(label.width_mm)
    const correctHeightInch = mmToInches(label.height_mm)
    const correctWidth203 = mmToPixels(label.width_mm, 203)
    const correctHeight203 = mmToPixels(label.height_mm, 203)
    const correctWidth300 = mmToPixels(label.width_mm, 300)
    const correctHeight300 = mmToPixels(label.height_mm, 300)
    
    const needsUpdate = 
      Math.abs(correctWidthInch - (label.width_inch || 0)) >= 0.001 ||
      Math.abs(correctHeightInch - (label.height_inch || 0)) >= 0.001 ||
      correctWidth203 !== (label.width_px_203dpi || 0) ||
      correctHeight203 !== (label.height_px_203dpi || 0) ||
      correctWidth300 !== (label.width_px_300dpi || 0) ||
      correctHeight300 !== (label.height_px_300dpi || 0)
    
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('labels')
        .update({
          width_inch: correctWidthInch,
          height_inch: correctHeightInch,
          width_px_203dpi: correctWidth203,
          height_px_203dpi: correctHeight203,
          width_px_300dpi: correctWidth300,
          height_px_300dpi: correctHeight300
        })
        .eq('id', label.id)
      
      if (updateError) {
        console.error(`❌ Error updating ${label.id}:`, updateError)
      } else {
        console.log(`✅ Fixed ${label.id} (${label.category})`)
        fixedCount++
      }
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} labels with accurate dimensions!`)
}

fixAllDimensions()