import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface PDFOptions {
  filename?: string
}

export interface WarningLabelOptions extends PDFOptions {
  type: string
  label: string
  color: string
  customMessage?: string
  size: 'warning_2x2' | 'warning_3x3' | 'warning_4x4' | 'warning_4x6'
}

export interface BarcodeLabelOptions extends PDFOptions {
  items: { value: string; name?: string; image?: string }[]
  size: string
}

/**
 * Generate a Warning Label PDF
 */
export async function generateWarningPDF(options: WarningLabelOptions) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const sizes: Record<string, number[]> = {
    warning_2x2: [144, 144],
    warning_3x3: [216, 216],
    warning_4x4: [288, 288],
    warning_4x6: [288, 432],
  }
  
  const [width, height] = sizes[options.size] || sizes.warning_3x3
  const page = pdfDoc.addPage([width, height])

  const hex = options.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const color = rgb(r, g, b)

  const borderWidth = Math.min(width, height) * 0.05
  page.drawRectangle({
    x: borderWidth / 2,
    y: borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderColor: color,
    borderWidth: borderWidth,
  })

  const mainText = options.type.replace('_', ' ')
  const mainFontSize = Math.min(width, height) * 0.15
  const mainTextWidth = font.widthOfTextAtSize(mainText, mainFontSize)
  
  page.drawText(mainText, {
    x: (width - mainTextWidth) / 2,
    y: height - borderWidth - mainFontSize - (height * 0.1),
    size: mainFontSize,
    font: font,
    color: color,
  })

  // Draw Icon based on type instead of Unicode character
  const iconSize = Math.min(width, height) * 0.3
  const centerX = width / 2
  const centerY = height / 2

  if (options.type === 'CAUTION' || options.type === 'WARNING' || options.type === 'FLAMMABLE' || options.type === 'HAZMAT') {
    // Draw Triangle for Warning using SVG Path
    const halfSize = iconSize / 2
    const path = `M ${centerX} ${centerY + halfSize} L ${centerX - halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY - halfSize} Z`
    page.drawSvgPath(path, {
      borderColor: color,
      borderWidth: 3,
    })
    
    // Draw "!" inside
    const exc = '!'
    const excSize = iconSize * 0.4
    const excWidth = font.widthOfTextAtSize(exc, excSize)
    page.drawText(exc, {
      x: centerX - (excWidth / 2),
      y: centerY - (halfSize * 0.4),
      size: excSize,
      font: font,
      color: color,
    })
  } else if (options.type === 'DANGER') {
    // Draw Octagon/Circle for Danger
    page.drawCircle({
      x: centerX,
      y: centerY,
      size: iconSize / 2,
      borderColor: color,
      borderWidth: 3,
    })
    // Draw "X" or "-"
    const dash = '-'
    const dashSize = iconSize * 0.6
    const dashWidth = font.widthOfTextAtSize(dash, dashSize)
    page.drawText(dash, {
      x: centerX - (dashWidth / 2),
      y: centerY - (dashSize / 4),
      size: dashSize,
      font: font,
      color: color,
    })
  } else if (options.type === 'THIS_SIDE_UP') {
    // Draw Arrow
    const arrowW = iconSize * 0.4
    const arrowH = iconSize * 0.6
    page.drawRectangle({
      x: centerX - (arrowW / 4),
      y: centerY - (arrowH / 2),
      width: arrowW / 2,
      height: arrowH * 0.6,
      color: color,
    })
    const arrowTipPath = `M ${centerX - (arrowW / 2)} ${centerY + (arrowH * 0.1)} L ${centerX + (arrowW / 2)} ${centerY + (arrowH * 0.1)} L ${centerX} ${centerY + (arrowH / 2)} Z`
    page.drawSvgPath(arrowTipPath, {
      color: color,
    })
  } else {
    // Default: Just draw a box with the first letter
    const firstLetter = options.type.charAt(0)
    const letterWidth = font.widthOfTextAtSize(firstLetter, iconSize)
    page.drawText(firstLetter, {
      x: centerX - (letterWidth / 2),
      y: centerY - (iconSize / 4),
      size: iconSize,
      font: font,
      color: color,
    })
  }

  if (options.customMessage) {
    const msgFontSize = Math.min(width, height) * 0.06
    const lines = wrapText(options.customMessage, width - (borderWidth * 4), msgFontSize, font)
    
    let currentY = (height * 0.25)
    lines.forEach(line => {
      const lineWidth = font.widthOfTextAtSize(line, msgFontSize)
      page.drawText(line, {
        x: (width - lineWidth) / 2,
        y: currentY,
        size: msgFontSize,
        font: font,
        color: rgb(0, 0, 0),
      })
      currentY -= msgFontSize * 1.2
    })
  }

  const pdfBytes = await pdfDoc.save()
  downloadPDF(pdfBytes, options.filename || 'warning-label.pdf')
}

/**
 * Generate a Barcode Label PDF (Supports multiple labels per page)
 */
export async function generateBarcodePDF(options: BarcodeLabelOptions) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const labelConfigs: Record<string, any> = {
    'avery_5163': { width: 288, height: 144, cols: 2, rows: 5, padding: 12 },
    'avery_5160': { width: 189, height: 72, cols: 3, rows: 10, padding: 8 },
    'amazon_fba_001': { width: 288, height: 432, cols: 1, rows: 1, padding: 20 },
    'amazon_fba_006': { width: 144, height: 72, cols: 1, rows: 1, padding: 10 },
    'product_1x2': { width: 144, height: 72, cols: 1, rows: 1, padding: 10 },
    'product_2x3': { width: 216, height: 144, cols: 1, rows: 1, padding: 12 },
  }

  const config = labelConfigs[options.size] || labelConfigs.avery_5163
  const itemsPerPage = config.cols * config.rows
  const totalPages = Math.ceil(options.items.length / itemsPerPage)

  for (let p = 0; p < totalPages; p++) {
    const pageWidth = config.cols > 1 ? 612 : config.width
    const pageHeight = config.rows > 1 ? 792 : config.height
    
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    const startIdx = p * itemsPerPage
    const pageItems = options.items.slice(startIdx, startIdx + itemsPerPage)

    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i]
      const col = i % config.cols
      const row = Math.floor(i / config.cols)
      
      const x = config.cols > 1 ? (pageWidth - (config.width * config.cols)) / 2 + (col * config.width) : 0
      const y = config.rows > 1 ? pageHeight - ((row + 1) * config.height) - 36 : 0

      if (item.image) {
        try {
          const barcodeImg = await pdfDoc.embedPng(item.image)
          const imgDims = barcodeImg.scaleToFit(config.width - 20, config.height - 40)
          page.drawImage(barcodeImg, {
            x: x + (config.width - imgDims.width) / 2,
            y: y + (config.height - imgDims.height) / 2 + 10,
            width: imgDims.width,
            height: imgDims.height,
          })
        } catch (e) {
          console.error('Error embedding barcode:', e)
        }
      }

      const text = item.name || item.value
      const fontSize = 8
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      page.drawText(text, {
        x: x + (config.width - textWidth) / 2,
        y: y + 15,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  }

  const pdfBytes = await pdfDoc.save()
  downloadPDF(pdfBytes, options.filename || 'barcodes.pdf')
}

export interface AddressEntry {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
}

export interface AddressLabelOptions extends PDFOptions {
  addresses: AddressEntry[]
  returnAddress?: AddressEntry
  size: string
}

/**
 * Generate an Address Label PDF
 */
export async function generateAddressPDF(options: AddressLabelOptions) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const labelConfigs: Record<string, any> = {
    'avery_5160': { width: 189, height: 72, cols: 3, rows: 10, leftMargin: 13.5, topMargin: 36 },
    'avery_5161': { width: 288, height: 96, cols: 2, rows: 10, leftMargin: 18, topMargin: 36 },
    'avery_5163': { width: 288, height: 144, cols: 2, rows: 5, leftMargin: 18, topMargin: 36 },
  }

  const config = labelConfigs[options.size] || labelConfigs.avery_5160
  const itemsPerPage = config.cols * config.rows
  const totalPages = Math.ceil(options.addresses.length / itemsPerPage)

  for (let p = 0; p < totalPages; p++) {
    const page = pdfDoc.addPage([612, 792]) // US Letter
    const startIdx = p * itemsPerPage
    const pageItems = options.addresses.slice(startIdx, startIdx + itemsPerPage)

    for (let i = 0; i < pageItems.length; i++) {
        const addr = pageItems[i]
        const col = i % config.cols
        const row = Math.floor(i / config.cols)
        
        const x = config.leftMargin + (col * config.width)
        const y = 792 - config.topMargin - ((row + 1) * config.height)

        // Draw Return Address (if provided, usually very small in corner)
        // For simplicity, we just draw the recipient address
        
        let currentY = y + config.height - 15
        const fontSize = 9

        // Name
        page.drawText(addr.name, { x: x + 10, y: currentY, size: fontSize, font: fontBold })
        currentY -= 11

        // Address 1
        page.drawText(addr.addressLine1, { x: x + 10, y: currentY, size: fontSize, font: font })
        currentY -= 11

        // Address 2
        if (addr.addressLine2) {
            page.drawText(addr.addressLine2, { x: x + 10, y: currentY, size: fontSize, font: font })
            currentY -= 11
        }

        // City, ST Zip
        page.drawText(`${addr.city}, ${addr.state} ${addr.zip}`, { x: x + 10, y: currentY, size: fontSize, font: font })
    }
  }

  const pdfBytes = await pdfDoc.save()
  downloadPDF(pdfBytes, options.filename || 'address-labels.pdf')
}

function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    if (!word) continue
    const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize)
    if (width < maxWidth) {
      currentLine += " " + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

function downloadPDF(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as any], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
