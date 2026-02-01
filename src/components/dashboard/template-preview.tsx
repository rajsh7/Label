'use client'



interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'barcode' | 'qrcode' | 'shape'
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

interface TemplatePreviewProps {
  elements: TemplateElement[]
  width: number
  height: number
  className?: string
}

export function TemplatePreview({ elements, width, height, className = '' }: TemplatePreviewProps) {

  
  return (
    <div 
      className={`relative bg-white ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {elements?.map((element) => {
          if (element.type === 'text') {
            return (
              <text
                key={element.id}
                x={element.x}
                y={element.y + (element.fontSize || 12)}
                fontSize={element.fontSize || 12}
                fontFamily={element.fontFamily || 'Arial'}
                fill={element.color || '#000000'}
              >
                {element.content || 'Text'}
              </text>
            )
          }
          
          if (element.type === 'shape') {
            return (
              <rect
                key={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.backgroundColor || '#e5e7eb'}
                stroke={element.borderColor || '#9ca3af'}
                strokeWidth={element.borderWidth || 1}
              />
            )
          }
          
          if (element.type === 'barcode' || element.type === 'qrcode') {
            return (
              <rect
                key={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill="#000000"
                opacity={0.8}
              />
            )
          }
          
          return null
        })}
      </svg>
    </div>
  )
}
