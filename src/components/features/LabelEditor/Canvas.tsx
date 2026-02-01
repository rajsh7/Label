'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { cn } from '@/lib/utils/cn'
import {
  renderTextElement,
  renderImageElement,
  renderBarcodeElement,
  renderShapeElement,
} from './elements'
import { renderBackground } from './elements/renderBackground'

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

    // Render background first
    renderBackground(ctx, canvas.width_px, canvas.height_px, canvas.background)

    // Render elements
    elements.forEach((element) => {
      if (!element.visible) return
      ctx.save()
      
      // Apply rotation if present
      if (element.rotation) {
        const cx = element.x + element.width / 2
        const cy = element.y + element.height / 2
        ctx.translate(cx, cy)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.translate(-cx, -cy)
      }

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
  }, [selectedLabel, selectedElementId, elements, canvas])

  // Global mouse events for dragging outside canvas
  useEffect(() => {
    if (!dragState.isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId || !canvasRef.current) return
      
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = canvasRef.current.width / rect.width
      const scaleY = canvasRef.current.height / rect.height
      
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      
      const deltaX = x - dragState.startX
      const deltaY = y - dragState.startY
      
      const element = elements.find(el => el.id === dragState.elementId)
      if (!element) return
      
      const newX = Math.max(0, Math.min(canvas.width_px - element.width, dragState.elementStartX + deltaX))
      const newY = Math.max(0, Math.min(canvas.height_px - element.height, dragState.elementStartY + deltaY))
      
      updateElement(dragState.elementId, { x: newX, y: newY })
    }

    const handleGlobalMouseUp = () => {
      setDragState({
        isDragging: false,
        elementId: null,
        startX: 0,
        startY: 0,
        elementStartX: 0,
        elementStartY: 0
      })
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [dragState.isDragging, dragState.elementId, dragState.startX, dragState.startY, dragState.elementStartX, dragState.elementStartY, elements, canvas.width_px, canvas.height_px, updateElement])

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
    
    e.preventDefault()
    const { x, y } = getMousePos(e)
    const deltaX = x - dragState.startX
    const deltaY = y - dragState.startY
    
    const element = elements.find(el => el.id === dragState.elementId)
    if (!element) return
    
    const newX = Math.max(0, Math.min(canvas.width_px - element.width, dragState.elementStartX + deltaX))
    const newY = Math.max(0, Math.min(canvas.height_px - element.height, dragState.elementStartY + deltaY))
    
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

  // Touch event handlers for mobile
  const getTouchPos = (e: React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const touch = e.touches[0] || e.changedTouches[0]
    
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent scrolling while touching canvas
    const { x, y } = getTouchPos(e)
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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return
    
    e.preventDefault()
    const { x, y } = getTouchPos(e)
    const deltaX = x - dragState.startX
    const deltaY = y - dragState.startY
    
    const element = elements.find(el => el.id === dragState.elementId)
    if (!element) return
    
    const newX = Math.max(0, Math.min(canvas.width_px - element.width, dragState.elementStartX + deltaX))
    const newY = Math.max(0, Math.min(canvas.height_px - element.height, dragState.elementStartY + deltaY))
    
    updateElement(dragState.elementId, { x: newX, y: newY })
  }

  const handleTouchEnd = () => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      elementStartX: 0,
      elementStartY: 0
    })
  }

  if (!selectedLabel) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p>Select a label to start designing</p>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center p-2 sm:p-4 md:p-6 bg-gray-100 w-full h-full min-h-[400px]', className)}>
      <div
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        className="bg-white shadow-lg border"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onDragStart={(e) => e.preventDefault()}
          className={dragState.isDragging ? 'cursor-move' : 'cursor-default'}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            userSelect: 'none',
            touchAction: 'none', // Prevent default touch behaviors
          }}
        />
      </div>
    </div>
  )
}