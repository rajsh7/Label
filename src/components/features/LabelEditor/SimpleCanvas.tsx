'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { cn } from '@/lib/utils/cn'
import { v4 as uuidv4 } from 'uuid'
import {
  renderTextElement,
  renderImageElement,
  renderBarcodeElement,
  renderShapeElement,
} from './elements'

export interface CanvasProps {
  className?: string
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    elementId: string | null
    startX: number
    startY: number
    elementStartX: number
    elementStartY: number
  }>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0
  })

  const {
    selectedLabel,
    elements,
    selectedElementId,
    canvas,
    selectElement,
    deselectElement,
    updateElement,
    addElement,
  } = useEditorStore()

  const displayWidth = (canvas.width_px * canvas.zoom_level) / 100
  const displayHeight = (canvas.height_px * canvas.zoom_level) / 100

  // Render canvas
  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl || !selectedLabel) return

    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    canvasEl.width = canvas.width_px
    canvasEl.height = canvas.height_px

    // Clear and draw background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width_px, canvas.height_px)

    // Draw grid
    ctx.strokeStyle = '#F3F4F6'
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width_px; x += 8) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height_px)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height_px; y += 8) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width_px, y)
      ctx.stroke()
    }

    // Render elements
    elements.forEach((element) => {
      if (!element.visible) return
      ctx.save()
      switch (element.type) {
        case 'text':
          renderTextElement(ctx, element)
          break
        case 'image':
          renderImageElement(ctx, element, () => {})
          break
        case 'barcode':
          renderBarcodeElement(ctx, element)
          break
        case 'shape':
          renderShapeElement(ctx, element)
          break
      }
      ctx.restore()
    })

    // Draw selection outline
    if (selectedElementId) {
      const selectedElement = elements.find(el => el.id === selectedElementId)
      if (selectedElement) {
        ctx.strokeStyle = '#2563EB'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(selectedElement.x - 2, selectedElement.y - 2, selectedElement.width + 4, selectedElement.height + 4)
        ctx.setLineDash([])
      }
    }
  }, [elements, selectedElementId, canvas, selectedLabel])

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const findElementAt = (x: number, y: number) => {
    return [...elements].reverse().find(element => 
      element.visible &&
      x >= element.x && 
      x <= element.x + element.width &&
      y >= element.y && 
      y <= element.y + element.height
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e)
    const element = findElementAt(x, y)
    
    if (element) {
      selectElement(element.id)
      setDragState({
        isDragging: true,
        elementId: element.id,
        startX: x,
        startY: y,
        elementStartX: element.x,
        elementStartY: element.y
      })
    } else {
      deselectElement()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return
    
    const { x, y } = getMousePos(e)
    const deltaX = x - dragState.startX
    const deltaY = y - dragState.startY
    
    const newX = Math.max(0, Math.min(canvas.width_px - 50, dragState.elementStartX + deltaX))
    const newY = Math.max(0, Math.min(canvas.height_px - 50, dragState.elementStartY + deltaY))
    
    updateElement(dragState.elementId, { x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      elementStartX: 0,
      elementStartY: 0
    })
  }

  // Handle text placement
  const handleAddText = (e: React.MouseEvent) => {
    if (dragState.isDragging) return
    
    const { x, y } = getMousePos(e)
    const element = findElementAt(x, y)
    
    if (!element) {
      addElement({
        id: uuidv4(),
        type: 'text',
        x: x - 50,
        y: y - 10,
        width: 100,
        height: 20,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'Text',
          font: 'Arial',
          fontSize: 14,
          fontWeight: 400,
          color: '#000000',
          align: 'left',
        },
      })
    }
  }

  if (!selectedLabel) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p>Select a label to start designing</p>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center p-6 bg-gray-100', className)}>
      <div
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
        }}
        className="bg-white shadow-lg border"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleAddText}
          className={dragState.isDragging ? 'cursor-move' : 'cursor-default'}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export default Canvas