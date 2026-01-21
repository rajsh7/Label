import { BarcodeElement as BarcodeElementType } from '@/types/editor'

/**
 * Render barcode element to canvas context
 */
export function renderBarcodeElement(
  ctx: CanvasRenderingContext2D,
  element: BarcodeElementType
): void {
  try {
    // Create a temporary canvas for barcode generation
    const barcodeCanvas = document.createElement('canvas')
    barcodeCanvas.width = element.width
    barcodeCanvas.height = element.height
    const barcodeCtx = barcodeCanvas.getContext('2d')

    if (!barcodeCtx) {
      // Fallback placeholder
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(element.x, element.y, element.width, element.height)
      ctx.fillStyle = '#000000'
      ctx.font = '12px monospace'
      ctx.fillText(
        element.properties.barcode_value || 'INVALID',
        element.x,
        element.y + element.height + 15
      )
      return
    }

    // Use jsBarcode to generate barcode
    // Note: jsBarcode requires DOM, so we generate on a temp canvas
    // Dynamic import to avoid SSR issues
    if (typeof window !== 'undefined') {
      const JsBarcode = require('jsbarcode')
      JsBarcode(barcodeCanvas, element.properties.barcode_value || '123456789', {
        format: element.properties.barcode_type || 'CODE128',
        width: 2,
        height: element.height - (element.properties.human_readable ? 20 : 0),
        displayValue: element.properties.human_readable !== false,
        fontSize: element.properties.human_readable_font_size || 12,
      })

      // Draw the generated barcode on main canvas
      ctx.drawImage(barcodeCanvas, element.x, element.y)
    } else {
      // SSR fallback - just draw placeholder
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(element.x, element.y, element.width, element.height)
      ctx.fillStyle = '#000000'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('BARCODE', element.x + element.width / 2, element.y + element.height / 2)
    }
  } catch (error) {
    console.error('Barcode rendering error:', error)
    // Fallback placeholder
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(element.x, element.y, element.width, element.height)
    ctx.fillStyle = '#000000'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('BARCODE ERROR', element.x + element.width / 2, element.y + element.height / 2)
  }
}
