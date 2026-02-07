'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEditorStore } from '@/lib/store/editorStore'
import { supabase } from '@/lib/supabase/client'
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { TopBar } from '@/components/features/editor-new/TopBar'
import { SidebarLeft } from '@/components/features/editor-new/SidebarLeft'
import { SidebarRight } from '@/components/features/editor-new/SidebarRight'
import { EditorCanvas } from '@/components/features/editor-new/Canvas'
import { LayersPanel } from '@/components/features/editor-new/LayersPanel'
import templatesData from '@/data/templates.json'

// Helper to parse dimensions string like "101.6mm × 152.4mm (4" × 6")"
function parseDimensions(dimStr: string) {
    // Handle both × (correct) and Ã— (encoding corruption) as fallback
    const mmMatch = dimStr.match(/([\d.]+)mm\s*[x×Ã—]\s*([\d.]+)mm/)
    if (mmMatch) {
        return {
            width: parseFloat(mmMatch[1]),
            height: parseFloat(mmMatch[2])
        }
    }
    return { width: 101.6, height: 152.4 } // Default 4x6
}

export default function EditorPage() {
  const searchParams = useSearchParams()
  const { resetEditor, setCanvasZoom, setSelectedLabel } = useEditorStore()

  useEffect(() => {
    const templateId = searchParams.get('template')

    if (templateId) {
        const loadDesign = async () => {
            // 1. Try to find in Static Data first
            const allTemplates = Object.values(templatesData).flat()
            const template = allTemplates.find(t => t.id === templateId)

            if (template) {
                // STATIC TEMPLATE LOGIC
                // 1. Reset Editor FIRST to clear old state (prevents overwriting canvas size later)
                resetEditor()

                const { width, height } = parseDimensions(template.dimensions)
                // Calculate pixels
                const dpi = template.id.includes('300_dpi') ? 300 : 203
                const width_px = Math.round((width / 25.4) * dpi)
                const height_px = Math.round((height / 25.4) * dpi)
                
                // 2. Set Label Dimensions (This sets the canvas size in store)
                setSelectedLabel({
                    id: template.id,
                    name: template.name,
                    width_mm: width,
                    height_mm: height,
                    width_px_203dpi: dpi === 203 ? width_px : Math.round((width / 25.4) * 203),
                    height_px_203dpi: dpi === 203 ? height_px : Math.round((height / 25.4) * 203),
                    width_px_300dpi: dpi === 300 ? width_px : Math.round((width / 25.4) * 300),
                    height_px_300dpi: dpi === 300 ? height_px : Math.round((height / 25.4) * 300),
                })
                
                // 3. Seed Elements based on Category/ID
                const elements: any[] = []

                // Universal Responsive Shipping Label Layout
                // Works for ALL carriers and platforms with any dimension size
                const margin = Math.round(width_px * 0.025) // 2.5% margin
                
                // Determine logo based on category
                const logoMap: Record<string, string> = {
                    'amazon': '/amazon-logo.png',
                    'walmart': '/walmart-logo.png',
                    'ebay': '/ebay-logo-display.png',
                    'shopify': '/shopify-logo.png',
                    'etsy': '/etsy-logo.png',
                    'usps': '/usps-logo.png',
                    'fedex': '/fedex-label.png',
                    'ups': '/ups-label.png',
                    'dhl': '/dhl-logo.png',
                }
                
                const logoSrc = logoMap[template.category.toLowerCase()] || null
                
                // Detect if label is PORTRAIT (tall) or LANDSCAPE (wide)
                const isPortrait = height_px > width_px
                
                if (isPortrait) {
                    // PORTRAIT LAYOUT (Vertical Stack) - for tall labels
                    // COMPACTED to prevent overflow on small labels (e.g. 3x5)
                    elements.push(
                        // Logo (Top Center)
                        ...(logoSrc ? [{
                            id: 'logo-carrier', type: 'image', 
                            content: logoSrc, 
                            x: Math.round(width_px * 0.5 - width_px * 0.15), y: Math.round(height_px * 0.02), 
                            width: Math.round(width_px * 0.3), height: Math.round(height_px * 0.04), 
                            visible: true 
                        }] : []),
                        
                        // SHIP FROM (Full Width)
                        { 
                            id: 'text-from-header', type: 'text', 
                            content: 'SHIP FROM:', 
                            x: margin, y: Math.round(height_px * 0.07), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.012)), fontWeight: 'bold' } 
                        },
                        { 
                            id: 'text-from-addr', type: 'text', 
                            content: 'SENDER NAME\n123 ORIGIN WAY\nCITY, ST 12345', 
                            x: margin, y: Math.round(height_px * 0.09), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.011)), lineHeight: 1.1, fontWeight: 'normal' } 
                        },

                        // SHIP TO (Full Width)
                        { 
                            id: 'text-to-header', type: 'text', 
                            content: 'SHIP TO:', 
                            x: margin, y: Math.round(height_px * 0.16), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.012)), fontWeight: 'bold' } 
                        },
                        { 
                            id: 'text-to-addr', type: 'text', 
                            content: 'RECIPIENT NAME\n456 DESTINATION DR\nCITY, ST 67890', 
                            x: margin, y: Math.round(height_px * 0.18), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.011)), lineHeight: 1.1, fontWeight: 'bold' } 
                        },

                        // Tracking Barcode
                        { 
                            id: 'barcode-tracking', type: 'barcode', 
                            content: '1Z9999999999999999', 
                            barcodeType: 'CODE128', 
                            x: Math.round(width_px * 0.05), 
                            y: Math.round(height_px * 0.27), 
                            width: Math.round(width_px * 0.9), 
                            height: Math.round(height_px * 0.11), 
                            visible: true,
                            displayValue: false 
                        },
                        // Tracking Number
                        { 
                            id: 'text-tracking-num', type: 'text', 
                            content: '1Z9999999999999999', 
                            x: Math.round(width_px * 0.1), y: Math.round(height_px * 0.39), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.018)), fontWeight: 'bold', letterSpacing: '0.5px' } 
                        },
                        
                        // Service Type / Brand Name
                        { 
                            id: 'text-service', type: 'text', 
                            content: template.marketplace?.toUpperCase() || 'GROUND', 
                            x: Math.round(width_px * 0.5 - width_px * 0.2), y: Math.round(height_px * 0.45), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(10, Math.round(height_px * 0.020)), fontWeight: 'bold', textAlign: 'center' } 
                        },

                        // Secondary Barcode
                        { 
                            id: 'barcode-secondary', type: 'barcode', 
                            content: '123456789012', 
                            barcodeType: 'CODE128', 
                            x: Math.round(width_px * 0.05), 
                            y: Math.round(height_px * 0.52), 
                            width: Math.round(width_px * 0.9), 
                            height: Math.round(height_px * 0.11), 
                            visible: true,
                            displayValue: false
                        },
                        
                        // Reference Number
                        { 
                            id: 'text-reference', type: 'text', 
                            content: 'REF: 123456789012', 
                            x: Math.round(width_px * 0.1), y: Math.round(height_px * 0.64), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.018)), fontWeight: 'bold' } 
                        },
                        
                        // Details Row 1
                        { 
                            id: 'text-weight', type: 'text', 
                            content: 'Weight: 2.5 lbs', 
                            x: margin, y: Math.round(height_px * 0.72), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.015)), fontWeight: 'normal' } 
                        },
                        // Details Row 2
                        { 
                            id: 'text-date', type: 'text', 
                            content: 'Date: ' + new Date().toLocaleDateString(), 
                            x: margin, y: Math.round(height_px * 0.76), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.015)), fontWeight: 'normal' } 
                        }
                    )
                } else {
                    // LANDSCAPE LAYOUT (Vertical Stack) - User requested specific order
                    // Logo -> Ship From -> Ship To -> Barcode -> Details
                    // We need to compact this vertically to fit in landscape height
                    
                    elements.push(
                        // Logo (Top Center)
                        ...(logoSrc ? [{
                            id: 'logo-carrier', type: 'image', 
                            content: logoSrc, 
                            x: Math.round(width_px * 0.5 - width_px * 0.1), y: Math.round(height_px * 0.02), 
                            width: Math.round(width_px * 0.2), height: Math.round(height_px * 0.08), 
                            visible: true 
                        }] : []),
                        
                        // SHIP FROM (Row 1)
                        { 
                            id: 'text-from-header', type: 'text', 
                            content: 'SHIP FROM:', 
                            x: margin, y: Math.round(height_px * 0.12), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.025)), fontWeight: 'bold' } 
                        },
                        { 
                            id: 'text-from-addr', type: 'text', 
                            content: 'SENDER NAME, 123 ORIGIN WAY, CITY, ST 12345', 
                            x: margin, y: Math.round(height_px * 0.16), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.022)), lineHeight: 1.1, fontWeight: 'normal' } 
                        },

                        // SHIP TO (Row 2)
                        { 
                            id: 'text-to-header', type: 'text', 
                            content: 'SHIP TO:', 
                            x: margin, y: Math.round(height_px * 0.22), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.025)), fontWeight: 'bold' } 
                        },
                        { 
                            id: 'text-to-addr', type: 'text', 
                            content: 'RECIPIENT NAME\n456 DESTINATION DR\nCITY, ST 67890', 
                            x: margin, y: Math.round(height_px * 0.26), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(10, Math.round(height_px * 0.028)), lineHeight: 1.1, fontWeight: 'bold' } 
                        },

                        // Barcode (Row 3 - Large)
                        { 
                            id: 'barcode-tracking', type: 'barcode', 
                            content: '1Z9999999999999999', 
                            barcodeType: 'CODE128', 
                            x: Math.round(width_px * 0.1), 
                            y: Math.round(height_px * 0.40), 
                            width: Math.round(width_px * 0.8), 
                            height: Math.round(height_px * 0.2), 
                            visible: true,
                            displayValue: false 
                        },
                        // Tracking Number
                        { 
                            id: 'text-tracking-num', type: 'text', 
                            content: '1Z9999999999999999', 
                            x: Math.round(width_px * 0.5 - width_px * 0.15), y: Math.round(height_px * 0.62), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.025)), fontWeight: 'bold', letterSpacing: '0.5px' } 
                        },
                        
                        // Details (Row 4)
                        { 
                            id: 'text-service', type: 'text', 
                            content: template.marketplace?.toUpperCase() || 'GROUND', 
                            x: margin, y: Math.round(height_px * 0.70), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(12, Math.round(height_px * 0.035)), fontWeight: 'bold' } 
                        },
                        { 
                            id: 'text-ref', type: 'text', 
                            content: 'REF: 123456789012', 
                            x: margin, y: Math.round(height_px * 0.78), visible: true, 
                            style: { fontFamily: 'Arial', fontSize: Math.max(9, Math.round(height_px * 0.022)), fontWeight: 'bold' } 
                        },
                        
                        // Footer (Row 5)
                        { 
                             id: 'text-weight', type: 'text', 
                             content: 'Weight: 2.5 lbs', 
                             x: Math.round(width_px * 0.6), y: Math.round(height_px * 0.70), visible: true, 
                             style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.02)), fontWeight: 'normal' } 
                        },
                        { 
                             id: 'text-date', type: 'text', 
                             content: 'Date: ' + new Date().toLocaleDateString(), 
                             x: Math.round(width_px * 0.6), y: Math.round(height_px * 0.78), visible: true, 
                             style: { fontFamily: 'Arial', fontSize: Math.max(8, Math.round(height_px * 0.02)), fontWeight: 'normal' } 
                        }
                    )
                }

                // Add all elements
                // @ts-ignore
                elements.forEach(el => useEditorStore.getState().addElement(el))
                
                // Auto-fit zoom based on size
                setCanvasZoom(width_px > 600 ? 50 : 75)
                
            } else {
                // SAVED DESIGN LOGIC (Database)
                try {
                    const { data: savedDesign, error } = await supabase
                    .from('label_designs')
                    .select('*')
                    .eq('id', templateId)
                    .single()

                    if (savedDesign && !error) {
                        resetEditor()
                        
                        const dpi = savedDesign.dpi || 203 // Default to 203 if missing
                        
                        // Set Label Dimensions
                        setSelectedLabel({
                            id: savedDesign.id,
                            name: savedDesign.name,
                            width_mm: (savedDesign.width_px / dpi) * 25.4,
                            height_mm: (savedDesign.height_px / dpi) * 25.4,
                            width_px_203dpi: savedDesign.width_px, 
                            height_px_203dpi: savedDesign.height_px,
                            width_px_300dpi: Math.round(savedDesign.width_px * (300/203)), 
                            height_px_300dpi: Math.round(savedDesign.height_px * (300/203)),
                        })

                        // Load Elements
                        if (savedDesign.elements && Array.isArray(savedDesign.elements)) {
                            // @ts-ignore
                            savedDesign.elements.forEach((el: any) => {
                                 useEditorStore.getState().addElement(el)
                            })
                        }
                        
                        // Auto-fit zoom
                        setCanvasZoom(savedDesign.width_px > 600 ? 50 : 75)
                    } else {
                        console.error('Failed to load design:', error)
                    }
                } catch (err) {
                    console.error('Error fetching design:', err)
                }
            }
        }
        
        loadDesign()
    } else {
        setCanvasZoom(100)
    }

  }, [searchParams])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light selection:bg-primary/30 selection:text-primary is-editor-page text-black font-display">
      <style jsx global>{`
        /* Force font family override for this page */
        .is-editor-page {
          font-family: 'Manrope', sans-serif;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
      
      <div className="z-50 relative">
        <TopNavigation />
      </div>
      
      <div className="mt-20 relative z-40">
        <TopBar />
      </div>

      <div className="flex flex-1 h-full overflow-hidden pt-12">
        <SidebarLeft />
        <div className="flex-1 relative bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
             <EditorCanvas />
             <LayersPanel />
        </div>
        <SidebarRight />
      </div>
    </div>
  )
}
