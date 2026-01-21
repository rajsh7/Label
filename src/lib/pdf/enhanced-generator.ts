import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface EnhancedPDFOptions {
  width: number
  height: number
  dpi: number
  elements: any[]
}

export async function generateEnhancedPDF(options: EnhancedPDFOptions): Promise<Buffer> {
  const { width, height, dpi, elements } = options
  
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Convert to points
  const pointsPerPixel = 72 / dpi
  const pageWidth = width * pointsPerPixel
  const pageHeight = height * pointsPerPixel
  
  const page = pdfDoc.addPage([pageWidth, pageHeight])
  
  for (const element of elements) {
    const x = element.x * pointsPerPixel
    const y = pageHeight - (element.y * pointsPerPixel) - (element.height * pointsPerPixel)
    const w = element.width * pointsPerPixel
    const h = element.height * pointsPerPixel
    
    switch (element.type) {
      case 'text':
        page.drawText(element.text || '', {
          x,
          y: y + h,
          size: element.fontSize || 12,
          font: element.fontWeight === 'bold' ? boldFont : font,
          color: rgb(0, 0, 0),
        })
        break
        
      case 'barcode':
        try {
          const barcodeImage = await generateBarcodeImage(element.value, element.format || 'CODE128')
          if (barcodeImage) {
            const image = await pdfDoc.embedPng(barcodeImage)
            page.drawImage(image, { x, y, width: w, height: h })
          }
        } catch (error) {
          // Fallback to text
          page.drawText(`[${element.value}]`, { x, y: y + h, size: 10, font })
        }
        break
        
      case 'rectangle':
        page.drawRectangle({
          x, y, width: w, height: h,
          borderColor: rgb(0, 0, 0),
          borderWidth: element.strokeWidth || 1,
          color: element.fill ? rgb(0.9, 0.9, 0.9) : undefined,
        })
        break
        
      case 'line':
        page.drawLine({
          start: { x, y },
          end: { x: x + w, y: y + h },
          thickness: element.strokeWidth || 1,
          color: rgb(0, 0, 0),
        })
        break
    }
  }
  
  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

async function generateBarcodeImage(_value: string, _format: string): Promise<Buffer | null> {
  // Browser-based barcode generation would be handled client-side
  console.warn('Server-side barcode generation requires canvas package')
  return null
}

export async function generateSingleLabelPDF(design: any, labelFormat: any): Promise<Buffer> {
  return generateEnhancedPDF({
    width: labelFormat.width,
    height: labelFormat.height,
    dpi: labelFormat.dpi || 203,
    elements: design.elements || []
  })
}