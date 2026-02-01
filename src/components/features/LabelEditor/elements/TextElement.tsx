import { TextElement as TextElementType } from '@/types/editor'

/**
 * Render text element to canvas context
 */
export function renderTextElement(
  ctx: CanvasRenderingContext2D,
  element: TextElementType
): void {
  const props = element.properties
  const fontSize = props.fontSize || 16
  const fontFamily = props.font || 'Inter'
  const fontWeight = props.fontWeight || 400
  const lineHeight = props.lineHeight || 1.2
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = props.color || '#000000'
  ctx.textAlign = (props.align || 'left') as CanvasTextAlign
  ctx.textBaseline = 'top'

  // Handle text wrapping with explicit newlines
  const paragraphs = props.text.split('\n')
  let y = element.y
  const maxWidth = element.width

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(' ')
    let line = ''
    
    // Adjust x based on alignment relative to element box
    let x = element.x
    if (props.align === 'center') {
      x = element.x + element.width / 2
    } else if (props.align === 'right') {
      x = element.x + element.width
    }

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      
      if (testWidth > maxWidth && line !== '') {
        // Line is full, draw it and start new line with current word
        ctx.fillText(line, x, y)
        line = words[n] + ' '
        y += fontSize * lineHeight
      } else if (ctx.measureText(words[n]).width > maxWidth) {
        // Single word stays on this line but might be too long. 
        // If we already have content, push to next line first
        if (line !== '') {
          ctx.fillText(line, x, y)
          line = ''
          y += fontSize * lineHeight
        }
        
        // Handle massive word by splitting characters
        // Simply let it flow for now or split? 
        // Best approach: check if word itself > maxWidth. If so, split by char.
        const chars = words[n].split('')
        let charLine = ''
        for (let c = 0; c < chars.length; c++) {
          if (ctx.measureText(charLine + chars[c]).width > maxWidth) {
             ctx.fillText(charLine, x, y)
             charLine = chars[c]
             y += fontSize * lineHeight
          } else {
            charLine += chars[c]
          }
        }
        line = charLine + ' '
      } else {
        line = testLine
      }
    }
    // Draw last line of paragraph
    ctx.fillText(line, x, y)
    // Move y down for next paragraph
    y += fontSize * lineHeight
  })
}
