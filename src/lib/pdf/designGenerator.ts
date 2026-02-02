/**
 * PDF generator for individual label designs
 * Generates PDF/PNG from editor designs using jsPDF
 */

import jsPDF from 'jspdf'
import { EditorElement } from '@/types/editor'

export interface DesignPDFOptions {
  elements: EditorElement[]
  width_px: number
  height_px: number
  dpi: number
  format?: 'pdf' | 'png'
}

/**
 * Generate PDF from label design
 */
export async function generateDesignPDF(options: DesignPDFOptions): Promise<Buffer> {
  const { elements, width_px, height_px, dpi } = options

  // Convert pixels to mm
  const pxToMm = 25.4 / dpi
  const width_mm = width_px * pxToMm
  const height_mm = height_px * pxToMm

  // Create PDF document
  const doc = new jsPDF({
    orientation: width_mm > height_mm ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [width_mm, height_mm],
    compress: true
  })

  // Set white background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, width_mm, height_mm, 'F')

  // Calculate scaling factor to fit content
  if (elements.length === 0) {
    // No elements, just return empty PDF
    const pdfOutput = doc.output('arraybuffer')
    return Buffer.from(pdfOutput)
  }
  
  const maxElementX = Math.max(...elements.map(e => e.x + (e.width || 0)))
  const maxElementY = Math.max(...elements.map(e => e.y + (e.height || 0)))
  
  const contentWidth = maxElementX * pxToMm
  const contentHeight = maxElementY * pxToMm
  
  const scaleX = contentWidth > 0 ? Math.min(1, (width_mm - 4) / contentWidth) : 1
  const scaleY = contentHeight > 0 ? Math.min(1, (height_mm - 4) / contentHeight) : 1
  const scale = Math.min(scaleX, scaleY)
  
  // Calculate centering offset with content centered at 60mm from left
  const centerX = 60 // Center content at 60mm from left edge
  const offsetX = centerX - (contentWidth * scale) / 2
  const offsetY = (height_mm - (contentHeight * scale)) / 2

  // Render each element with scaling and centering
  elements.forEach((element) => {
    renderElement(doc, element, pxToMm * scale, offsetX, offsetY)
  })

  const pdfOutput = doc.output('arraybuffer')
  return Buffer.from(pdfOutput)
}

/**
 * Render a single element on the PDF
 */
function renderElement(
  doc: jsPDF,
  element: EditorElement,
  scaledPxToMm: number,
  offsetX: number,
  offsetY: number
) {
  const x = element.x * scaledPxToMm + offsetX
  const y = element.y * scaledPxToMm + offsetY

  switch (element.type) {
    case 'text':
      renderTextElement(doc, element, x, y, scaledPxToMm)
      break
    case 'shape':
      renderShapeElement(doc, element, x, y, scaledPxToMm)
      break
  }
}

/**
 * Render text element
 */
function renderTextElement(
  doc: jsPDF,
  element: EditorElement,
  x: number,
  y: number,
  scaledPxToMm: number
) {
  if (element.type !== 'text' || !element.properties.text) return

  const fontSize = Math.max(6, (element.properties.fontSize || 16) * scaledPxToMm * 0.3)
  
  const fontWeight = element.properties.fontWeight || 400
  const fontStyle = fontWeight >= 600 ? 'bold' : 'normal'
  doc.setFont('helvetica', fontStyle)
  doc.setFontSize(fontSize)

  if (element.properties.color) {
    const color = hexToRgb(element.properties.color)
    if (color) {
      doc.setTextColor(color.r, color.g, color.b)
    }
  } else {
    doc.setTextColor(0, 0, 0)
  }

  const maxWidth = (element.width || 200) * scaledPxToMm
  const align = element.properties.align || 'left'
  
  doc.text(element.properties.text, x, y + fontSize * 0.7, {
    maxWidth: maxWidth,
    align: align as 'left' | 'center' | 'right'
  })
}

/**
 * Render shape element
 */
function renderShapeElement(
  doc: jsPDF,
  element: EditorElement,
  x: number,
  y: number,
  scaledPxToMm: number
) {
  if (element.type !== 'shape') return

  const width = (element.width || 100) * scaledPxToMm
  const height = (element.height || 100) * scaledPxToMm

  const fillColor = element.properties?.fill_color ? hexToRgb(element.properties.fill_color) : null
  const strokeColor = element.properties?.border_color ? hexToRgb(element.properties.border_color) : null

  if (fillColor) {
    doc.setFillColor(fillColor.r, fillColor.g, fillColor.b)
  }
  if (strokeColor) {
    doc.setDrawColor(strokeColor.r, strokeColor.g, strokeColor.b)
  }

  const style = fillColor && strokeColor ? 'FD' : fillColor ? 'F' : 'S'

  switch (element.properties?.shape_type) {
    case 'rectangle':
      doc.rect(x, y, width, height, style)
      break
    case 'circle':
      const radius = Math.min(width, height) / 2
      doc.circle(x + width/2, y + height/2, radius, style)
      break
    case 'line':
      if (strokeColor) {
        doc.line(x, y, x + width, y + height)
      }
      break
  }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

