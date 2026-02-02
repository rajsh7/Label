import jsPDF from 'jspdf'

interface AddressEntry {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
}

interface GenerateAddressPDFOptions {
  addresses: Array<Partial<AddressEntry>>
  returnAddress?: Partial<AddressEntry>
  size: string
  filename: string
}

export async function generateAddressPDF(options: GenerateAddressPDFOptions) {
  const { addresses, size, filename } = options

  // Create PDF document (8.5 x 11 inches)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter'
  })

  // Template configurations (in inches)
  const templates = {
    avery_5160: { width: 2.625, height: 1, cols: 3, rows: 10, marginX: 0.1875, marginY: 0.5 },
    avery_5161: { width: 4, height: 1.33, cols: 2, rows: 7, marginX: 0.25, marginY: 0.5 },
    avery_5163: { width: 4, height: 2, cols: 2, rows: 5, marginX: 0.25, marginY: 0.5 }
  }

  const template = templates[size as keyof typeof templates] || templates.avery_5160

  let currentRow = 0
  let currentCol = 0

  addresses.forEach((address) => {
    // Check if we need a new page
    if (currentRow >= template.rows) {
      doc.addPage()
      currentRow = 0
      currentCol = 0
    }

    // Calculate position
    const x = template.marginX + (currentCol * template.width)
    const y = template.marginY + (currentRow * template.height)

    // Set font
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    // Draw address
    let lineY = y + 0.15
    const lineHeight = 0.12

    if (address.name) {
      doc.text(address.name, x + 0.1, lineY)
      lineY += lineHeight
    }
    
    if (address.addressLine1) {
      doc.text(address.addressLine1, x + 0.1, lineY)
      lineY += lineHeight
    }
    
    if (address.addressLine2) {
      doc.text(address.addressLine2, x + 0.1, lineY)
      lineY += lineHeight
    }
    
    const cityStateZip = `${address.city}, ${address.state} ${address.zip}`
    doc.text(cityStateZip, x + 0.1, lineY)

    // Move to next position
    currentCol++
    if (currentCol >= template.cols) {
      currentCol = 0
      currentRow++
    }
  })

  // Download the PDF
  doc.save(filename)
}

interface GenerateBarcodePDFOptions {
  items: { value: string; image?: string }[]
  size: string
  filename: string
}

export async function generateBarcodePDF(options: GenerateBarcodePDFOptions) {
  const { items, size, filename } = options

  const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' })

  const templates = {
    avery_5163: { width: 4, height: 2, cols: 2, rows: 5, marginX: 0.25, marginY: 0.5 },
    avery_5160: { width: 2.625, height: 1, cols: 3, rows: 10, marginX: 0.1875, marginY: 0.5 },
    product_1x2: { width: 2, height: 1, cols: 3, rows: 10, marginX: 0.1875, marginY: 0.5 },
    product_2x3: { width: 3, height: 2, cols: 3, rows: 5, marginX: 0.25, marginY: 0.5 }
  }

  const template = templates[size as keyof typeof templates] || templates.avery_5163

  let currentRow = 0
  let currentCol = 0

  items.forEach((item) => {
    if (currentRow >= template.rows) {
      doc.addPage()
      currentRow = 0
      currentCol = 0
    }

    const x = template.marginX + (currentCol * template.width)
    const y = template.marginY + (currentRow * template.height)

    const padding = 0.1
    const imgWidth = Math.max(0.1, template.width - padding * 2)
    const imgHeight = Math.max(0.1, template.height - padding * 3)

    if (item.image) {
      try {
        doc.addImage(item.image, 'PNG', x + padding, y + padding, imgWidth, imgHeight)
      } catch (e) {
        // If image is invalid, render value as text instead
        doc.setFontSize(10)
        doc.text(item.value, x + padding, y + padding + 0.2)
      }
    } else {
      doc.setFontSize(10)
      doc.text(item.value, x + padding, y + padding + 0.2)
    }

    // Optional label under barcode
    doc.setFontSize(8)
    const textY = y + template.height - 0.12
    doc.text(item.value, x + padding, textY)

    currentCol++
    if (currentCol >= template.cols) {
      currentCol = 0
      currentRow++
    }
  })

  doc.save(filename)
}

interface GenerateWarningPDFOptions {
  type: string
  label: string
  color: string
  customMessage?: string
  size: string
  filename: string
}

export async function generateWarningPDF(options: GenerateWarningPDFOptions) {
  const { label, color, customMessage, size, filename } = options

  const sizes: Record<string, { width: number; height: number }> = {
    warning_2x2: { width: 2, height: 2 },
    warning_3x3: { width: 3, height: 3 },
    warning_4x4: { width: 4, height: 4 },
    warning_4x6: { width: 4, height: 6 }
  }

  const selected = sizes[size] || sizes.warning_3x3

  const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: [selected.width, selected.height] })

  // Draw border
  doc.setDrawColor(color)
  doc.setLineWidth(0.08)
  doc.rect(0.05, 0.05, selected.width - 0.1, selected.height - 0.1)

  // Title
  doc.setFontSize(Math.min(selected.width, selected.height) * 8)
  doc.setTextColor(color)
  doc.setFont('helvetica', 'bold')
  doc.text(label, selected.width / 2, selected.height / 3, { align: 'center' })

  // Custom message
  if (customMessage) {
    doc.setFontSize(10)
    doc.setTextColor('#000000')
    doc.setFont('helvetica', 'normal')
    doc.text(customMessage, selected.width / 2, (selected.height / 3) * 1.8, { align: 'center', maxWidth: selected.width - 0.2 })
  }

  doc.save(filename)
}