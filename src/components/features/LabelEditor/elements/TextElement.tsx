import { TextElement as TextElementType } from '@/types/editor'

/**
 * Render text element to canvas context
 */
export function renderTextElement(
  ctx: CanvasRenderingContext2D,
  element: TextElementType
): void {
  const props = element.properties
  ctx.font = `${props.fontWeight || 400} ${props.fontSize || 16}px ${props.font || 'Inter'}`
  ctx.fillStyle = props.color || '#000000'
  ctx.textAlign = (props.align || 'left') as CanvasTextAlign
  ctx.textBaseline = 'top'

  const lines = props.text.split('\n')
  const lineHeight = props.fontSize * (props.lineHeight || 1.2)
  
  lines.forEach((line: string, index: number) => {
    ctx.fillText(line, element.x, element.y + index * lineHeight)
  })
}
