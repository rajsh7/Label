import { BackgroundConfig, DecorativeShape } from '@/types/editor'

/**
 * Render solid color background
 */
export function renderSolidBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

/**
 * Render gradient background
 */
export function renderGradientBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: NonNullable<BackgroundConfig['gradient']>
) {
  let gradient: CanvasGradient

  if (config.type === 'linear') {
    const angle = (config.angle || 0) * (Math.PI / 180)
    const x1 = width / 2 - (Math.cos(angle) * width) / 2
    const y1 = height / 2 - (Math.sin(angle) * height) / 2
    const x2 = width / 2 + (Math.cos(angle) * width) / 2
    const y2 = height / 2 + (Math.sin(angle) * height) / 2
    gradient = ctx.createLinearGradient(x1, y1, x2, y2)
  } else {
    // Radial gradient
    gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    )
  }

  // Add color stops
  config.colors.forEach((stop) => {
    gradient.addColorStop(stop.position, stop.color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

/**
 * Render pattern background
 */
export function renderPatternBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: NonNullable<BackgroundConfig['pattern']>
) {
  ctx.globalAlpha = config.opacity
  ctx.fillStyle = config.color

  const scale = config.scale || 1
  const spacing = 20 * scale

  switch (config.type) {
    case 'dots':
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, 2 * scale, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      break

    case 'stripes':
      for (let x = 0; x < width; x += spacing) {
        ctx.fillRect(x, 0, spacing / 2, height)
      }
      break

    case 'grid':
      ctx.lineWidth = 1 * scale
      ctx.strokeStyle = config.color
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      break

    case 'diagonal':
      for (let i = -height; i < width + height; i += spacing) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + height, height)
        ctx.lineWidth = spacing / 4
        ctx.strokeStyle = config.color
        ctx.stroke()
      }
      break
  }

  ctx.globalAlpha = 1
}

/**
 * Render decorative shape
 */
export function renderDecorativeShape(
  ctx: CanvasRenderingContext2D,
  shape: DecorativeShape
) {
  ctx.save()
  ctx.globalAlpha = shape.opacity
  ctx.fillStyle = shape.color

  // Apply rotation
  ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2)
  ctx.rotate((shape.rotation * Math.PI) / 180)
  ctx.translate(-(shape.x + shape.width / 2), -(shape.y + shape.height / 2))

  switch (shape.type) {
    case 'circle':
      ctx.beginPath()
      ctx.arc(
        shape.x + shape.width / 2,
        shape.y + shape.height / 2,
        Math.min(shape.width, shape.height) / 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
      break

    case 'rectangle':
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
      break

    case 'triangle':
      ctx.beginPath()
      ctx.moveTo(shape.x + shape.width / 2, shape.y)
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
      ctx.lineTo(shape.x, shape.y + shape.height)
      ctx.closePath()
      ctx.fill()
      break

    case 'wave':
      ctx.beginPath()
      ctx.moveTo(shape.x, shape.y + shape.height / 2)
      for (let x = 0; x <= shape.width; x += 10) {
        const y =
          shape.y +
          shape.height / 2 +
          Math.sin((x / shape.width) * Math.PI * 4) * (shape.height / 4)
        ctx.lineTo(shape.x + x, y)
      }
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
      ctx.lineTo(shape.x, shape.y + shape.height)
      ctx.closePath()
      ctx.fill()
      break

    case 'blob':
      // Organic blob shape using bezier curves
      ctx.beginPath()
      const centerX = shape.x + shape.width / 2
      const centerY = shape.y + shape.height / 2
      const radiusX = shape.width / 2
      const radiusY = shape.height / 2
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const nextAngle = ((i + 1) / 8) * Math.PI * 2
        const randomness = 0.8 + Math.random() * 0.4
        
        const x1 = centerX + Math.cos(angle) * radiusX * randomness
        const y1 = centerY + Math.sin(angle) * radiusY * randomness
        const x2 = centerX + Math.cos(nextAngle) * radiusX * randomness
        const y2 = centerY + Math.sin(nextAngle) * radiusY * randomness
        
        if (i === 0) {
          ctx.moveTo(x1, y1)
        }
        
        const cpAngle = (angle + nextAngle) / 2
        const cpX = centerX + Math.cos(cpAngle) * radiusX * 1.2
        const cpY = centerY + Math.sin(cpAngle) * radiusY * 1.2
        
        ctx.quadraticCurveTo(cpX, cpY, x2, y2)
      }
      ctx.closePath()
      ctx.fill()
      break
  }

  ctx.restore()
}

/**
 * Main function to render background
 */
export function renderBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  background: BackgroundConfig
) {
  // Clear canvas first
  ctx.clearRect(0, 0, width, height)

  // Render based on type
  switch (background.type) {
    case 'solid':
      if (background.color) {
        renderSolidBackground(ctx, width, height, background.color)
      }
      break

    case 'gradient':
      if (background.gradient) {
        renderGradientBackground(ctx, width, height, background.gradient)
      }
      break

    case 'pattern':
      if (background.pattern) {
        // First fill with white or transparent
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        renderPatternBackground(ctx, width, height, background.pattern)
      }
      break

    case 'none':
    default:
      // White background by default
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      break
  }

  // Render decorative shapes
  if (background.decorativeShapes && background.decorativeShapes.length > 0) {
    background.decorativeShapes.forEach((shape) => {
      renderDecorativeShape(ctx, shape)
    })
  }
}
