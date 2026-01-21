import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { EditorElement } from '@/types/editor'

export interface TemplateData {
  id: string
  name: string
  elements: EditorElement[]
  width_px: number
  height_px: number
  dpi: 203 | 300
}

interface GeneratePDFParams {
  template: TemplateData
  csvData: Record<string, any>[]
  columnMapping: Record<string, string>
}

/**
 * Generate PDF with labels from template and CSV data
 */
export async function generateBatchPDF({
  template,
  csvData,
  columnMapping,
}: GeneratePDFParams): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
  // Convert pixels to points (72 points per inch)
  const dpi = template.dpi || 203
  const pointsPerPixel = 72 / dpi
  const width = template.width_px * pointsPerPixel
  const height = template.height_px * pointsPerPixel

  // Generate one page per CSV row
  for (const rowData of csvData) {
    const page = pdfDoc.addPage([width, height])
    
    // Parse elements if string
    const elements = typeof template.elements === 'string' 
      ? JSON.parse(template.elements) 
      : template.elements

    // Render each element
    for (const element of elements) {
      if (element.type === 'text') {
        let text = (element as any).content || ''
        
        // If text doesn't have variables, use the first mapped CSV value
        if (!text.includes('{{')) {
          // Get the first CSV column value from mapping
          const firstMappedCol = Object.keys(columnMapping)[0]
          if (firstMappedCol && rowData[firstMappedCol]) {
            text = String(rowData[firstMappedCol])
          }
        } else {
          // Replace variables with CSV data
          Object.entries(columnMapping).forEach(([csvCol, field]) => {
            const value = rowData[csvCol]
            if (value) {
              text = text.replace(new RegExp(`\\{\\{${field}\\}\\}`, 'g'), String(value))
            }
          })
          
          // Also replace direct column names
          Object.keys(rowData).forEach(col => {
            const value = rowData[col]
            if (value) {
              text = text.replace(new RegExp(`\\{\\{${col}\\}\\}`, 'g'), String(value))
            }
          })
        }

        const x = element.x * pointsPerPixel
        const y = height - (element.y * pointsPerPixel) - ((element as any).fontSize || 12)
        
        page.drawText(text, {
          x,
          y,
          size: (element as any).fontSize || 12,
          font,
          color: rgb(0, 0, 0),
        })
      }
    }
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}