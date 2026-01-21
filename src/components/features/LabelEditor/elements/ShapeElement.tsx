import { ShapeElement as ShapeElementType } from '@/types/editor'

/**
 * Render shape element to canvas context
 */
export function renderShapeElement(
  ctx: CanvasRenderingContext2D,
  element: ShapeElementType
): void {
  const props = element.properties
  ctx.strokeStyle = props.border_color || '#000000'
  ctx.lineWidth = props.border_width || 1
  ctx.fillStyle = props.fill_color || '#000000'
  ctx.globalAlpha = (props.fill_opacity || 100) / 100

  switch (props.shape_type) {
    case 'rectangle':
      if ((props.fill_opacity || 0) > 0) {
        ctx.fillRect(element.x, element.y, element.width, element.height)
      }
      ctx.strokeRect(element.x, element.y, element.width, element.height)
      break

    case 'circle':
      ctx.beginPath()
      const radius = Math.min(element.width, element.height) / 2
      ctx.arc(
        element.x + element.width / 2,
        element.y + element.height / 2,
        radius,
        0,
        Math.PI * 2
      )
      if ((props.fill_opacity || 0) > 0) {
        ctx.fill()
      }
      ctx.stroke()
      break

    case 'line':
      ctx.beginPath()
      ctx.moveTo(element.x, element.y)
      ctx.lineTo(element.x + element.width, element.y + element.height)
      ctx.stroke()
      break

    default:
      // Default to rectangle
      ctx.fillRect(element.x, element.y, element.width, element.height)
      ctx.strokeRect(element.x, element.y, element.width, element.height)
  }

  ctx.globalAlpha = 1
}
