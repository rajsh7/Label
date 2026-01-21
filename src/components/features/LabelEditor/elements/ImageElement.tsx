import { ImageElement as ImageElementType } from '@/types/editor'

/**
 * Render image element to canvas context
 * Note: Images load asynchronously, so we handle both sync and async cases
 */
export function renderImageElement(
  ctx: CanvasRenderingContext2D,
  element: ImageElementType,
  onImageLoaded?: () => void
): void {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = element.properties.image_url

  // Use a promise to handle async image loading
  img.onload = () => {
    ctx.save()
    ctx.globalAlpha = (element.properties.opacity || 100) / 100
    ctx.drawImage(img, element.x, element.y, element.width, element.height)
    ctx.restore()
    
    // Notify that image has loaded (triggers re-render)
    if (onImageLoaded) {
      onImageLoaded()
    }
  }

  img.onerror = () => {
    // Fallback placeholder if image fails to load
    ctx.globalAlpha = (element.properties.opacity || 100) / 100
    ctx.fillStyle = '#E5E7EB'
    ctx.fillRect(element.x, element.y, element.width, element.height)
    ctx.strokeStyle = '#9CA3AF'
    ctx.lineWidth = 2
    ctx.strokeRect(element.x, element.y, element.width, element.height)
    ctx.fillStyle = '#6B7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Image Error', element.x + element.width / 2, element.y + element.height / 2)
    ctx.globalAlpha = 1
  }

  // Draw immediately if already loaded, otherwise placeholder
  if (img.complete && img.naturalWidth > 0) {
    ctx.save()
    ctx.globalAlpha = (element.properties.opacity || 100) / 100
    ctx.drawImage(img, element.x, element.y, element.width, element.height)
    ctx.restore()
  } else {
    // Draw placeholder while loading
    ctx.globalAlpha = (element.properties.opacity || 100) / 100
    ctx.fillStyle = '#F3F4F6'
    ctx.fillRect(element.x, element.y, element.width, element.height)
    ctx.strokeStyle = '#D1D5DB'
    ctx.lineWidth = 1
    ctx.strokeRect(element.x, element.y, element.width, element.height)
    ctx.globalAlpha = 1
  }
}
