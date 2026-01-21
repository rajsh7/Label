'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { EditorElement } from '@/types/editor'
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

/**
 * Canvas component - renders the label design
 * Uses HTML5 Canvas for pixel-perfect rendering
 */
export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null)

  const {
    selectedLabel,
    elements,
    selectedElementId,
    canvas,
    selectElement,
    deselectElement,
    updateElement,
    deleteElement,
    addElement,
    copyElement,
    pasteElement,
    duplicateElement,
    copiedElement,
  } = useEditorStore()
  const [placementMode, setPlacementMode] = useState<'text' | 'image' | 'barcode' | 'shape' | null>(null)

  // Calculate canvas display size based on zoom
  const displayWidth = (canvas.width_px * canvas.zoom_level) / 100
  const displayHeight = (canvas.height_px * canvas.zoom_level) / 100

  // Handle image loaded event to trigger re-render
  useEffect(() => {
    const handleImageLoaded = () => {
      // Force canvas re-render when image loads
      const canvasEl = canvasRef.current
      if (canvasEl && selectedLabel) {
        const ctx = canvasEl.getContext('2d')
        if (ctx) {
          // Trigger re-render by dispatching a small state change
          // This will cause the useEffect to run again
        }
      }
    }

    window.addEventListener('canvas:image-loaded', handleImageLoaded)
    return () => window.removeEventListener('canvas:image-loaded', handleImageLoaded)
  }, [selectedLabel])

  // Render elements to canvas
  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl || !selectedLabel) return

    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvasEl.width = canvas.width_px
    canvasEl.height = canvas.height_px

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width_px, canvas.height_px)

    // Draw white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width_px, canvas.height_px)

    // Draw 8px grid (optional, can be toggled)
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

    // Render elements in z_index order
    const sortedElements = [...elements].sort((a, b) => a.z_index - b.z_index)

    sortedElements.forEach((element) => {
      if (!element.visible) return

      ctx.save()

      // Move to element center for rotation
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
      ctx.rotate((element.rotation * Math.PI) / 180)
      ctx.translate(-(element.x + element.width / 2), -(element.y + element.height / 2))

      // Render based on element type
      switch (element.type) {
        case 'text':
          renderTextElement(ctx, element)
          break
        case 'image':
          renderImageElement(ctx, element, () => {
            // Trigger canvas re-render when image loads
            window.dispatchEvent(new CustomEvent('canvas:image-loaded'))
          })
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
    const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
    if (selectedElement) {
      drawSelectionOutline(ctx, selectedElement)
    }
  }, [elements, selectedElementId, canvas, selectedLabel])

  const drawSelectionOutline = (ctx: CanvasRenderingContext2D, element: any) => {
    ctx.strokeStyle = '#2563EB'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
    ctx.setLineDash([])

    // Draw resize handles (only if element is selected and not resizing)
    if (!isResizing) {
      const handles = [
        { x: element.x, y: element.y }, // Top-left
        { x: element.x + element.width, y: element.y }, // Top-right
        { x: element.x, y: element.y + element.height }, // Bottom-left
        { x: element.x + element.width, y: element.y + element.height }, // Bottom-right
      ]

      ctx.fillStyle = '#2563EB'
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      handles.forEach((handle) => {
        ctx.beginPath()
        ctx.arc(handle.x, handle.y, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })
    }
  }

  const getClickCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return { x: 0, y: 0 }
    const rect = canvasEl.getBoundingClientRect()
    const scaleX = canvas.width_px / rect.width
    const scaleY = canvas.height_px / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const isPointInResizeHandle = (
    x: number,
    y: number,
    element: EditorElement,
    handleSize: number = 6
  ): string | null => {
    const handles = [
      { name: 'nw', x: element.x, y: element.y }, // Top-left
      { name: 'ne', x: element.x + element.width, y: element.y }, // Top-right
      { name: 'sw', x: element.x, y: element.y + element.height }, // Bottom-left
      { name: 'se', x: element.x + element.width, y: element.y + element.height }, // Bottom-right
    ]

    for (const handle of handles) {
      const distance = Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2))
      if (distance <= handleSize * 2) {
        return handle.name
      }
    }

    return null
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (contextMenu) {
      setContextMenu(null)
      return
    }

    const { x, y } = getClickCoordinates(e)

    // Handle placement mode
    if (placementMode) {
      handlePlacementClick(x, y)
      return
    }

    // Check if click is on a resize handle first
    if (selectedElementId) {
      const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
      if (selectedElement) {
        const handle = isPointInResizeHandle(x, y, selectedElement)
        if (handle) {
          // Don't deselect, allow resize to start
          return
        }
      }
    }

    // Check if click is on an element (reverse order for top element)
    const clickedElement = [...elements]
      .reverse()
      .find((element) => {
        if (!element.visible) return false
        return (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        )
      })

    if (clickedElement) {
      selectElement(clickedElement.id)
    } else {
      deselectElement()
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x, y } = getClickCoordinates(e)

    const clickedElement = [...elements]
      .reverse()
      .find((element) => {
        if (!element.visible) return false
        return (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        )
      })

    if (clickedElement) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        elementId: clickedElement.id,
      })
      selectElement(clickedElement.id)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedElementId) {
      const { x, y } = getClickCoordinates(e)
      const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
      
      if (selectedElement) {
        // Check if clicking on resize handle
        const handle = isPointInResizeHandle(x, y, selectedElement)
        if (handle) {
          setIsResizing(true)
          setResizeHandle(handle)
          setDragStart({ x, y })
          return
        }
      }

      // Start dragging
      setIsDragging(true)
      setDragStart({ x, y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: currentX, y: currentY } = getClickCoordinates(e)

    if (isResizing && selectedElementId && resizeHandle) {
      const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
      if (!selectedElement) return

      const deltaX = currentX - dragStart.x
      const deltaY = currentY - dragStart.y

      let newX = selectedElement.x
      let newY = selectedElement.y
      let newWidth = selectedElement.width
      let newHeight = selectedElement.height

      // Resize based on handle
      switch (resizeHandle) {
        case 'nw': // Top-left
          newX = selectedElement.x + deltaX
          newY = selectedElement.y + deltaY
          newWidth = selectedElement.width - deltaX
          newHeight = selectedElement.height - deltaY
          break
        case 'ne': // Top-right
          newY = selectedElement.y + deltaY
          newWidth = selectedElement.width + deltaX
          newHeight = selectedElement.height - deltaY
          break
        case 'sw': // Bottom-left
          newX = selectedElement.x + deltaX
          newWidth = selectedElement.width - deltaX
          newHeight = selectedElement.height + deltaY
          break
        case 'se': // Bottom-right
          newWidth = selectedElement.width + deltaX
          newHeight = selectedElement.height + deltaY
          break
      }

      // Enforce minimum size
      if (newWidth < 10) {
        newWidth = 10
        if (resizeHandle.includes('w')) newX = selectedElement.x + selectedElement.width - 10
      }
      if (newHeight < 10) {
        newHeight = 10
        if (resizeHandle.includes('n')) newY = selectedElement.y + selectedElement.height - 10
      }

      updateElement(selectedElementId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      })

      setDragStart({ x: currentX, y: currentY })
    } else if (isDragging && selectedElementId) {
      const deltaX = currentX - dragStart.x
      const deltaY = currentY - dragStart.y

      const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
      if (selectedElement) {
        updateElement(selectedElementId, {
          x: selectedElement.x + deltaX,
          y: selectedElement.y + deltaY,
        })
      }

      setDragStart({ x: currentX, y: currentY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  // Arrow key nudge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const selectedElement = elements.find((el: EditorElement) => el.id === selectedElementId)
        if (!selectedElement) return

        const nudgeAmount = e.shiftKey ? 10 : 1 // Shift = 10px, normal = 1px
        let newX = selectedElement.x
        let newY = selectedElement.y

        switch (e.key) {
          case 'ArrowUp':
            newY -= nudgeAmount
            break
          case 'ArrowDown':
            newY += nudgeAmount
            break
          case 'ArrowLeft':
            newX -= nudgeAmount
            break
          case 'ArrowRight':
            newX += nudgeAmount
            break
        }

        updateElement(selectedElementId, { x: newX, y: newY })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, elements, updateElement])

  // Listen for placement mode changes
  useEffect(() => {
    const handlePlacementMode = (e: CustomEvent) => {
      setPlacementMode(e.detail)
    }

    window.addEventListener('editor:placement-mode', handlePlacementMode as EventListener)
    return () => window.removeEventListener('editor:placement-mode', handlePlacementMode as EventListener)
  }, [])

  // Handle placement mode click
  const handlePlacementClick = (x: number, y: number) => {
    if (!placementMode) return

    switch (placementMode) {
      case 'text':
        addElement({
          id: uuidv4(),
          type: 'text',
          x: x - 50,
          y: y - 10,
          width: 200,
          height: 40,
          rotation: 0,
          z_index: Math.max(...elements.map((e: EditorElement) => e.z_index), 0) + 1,
          visible: true,
          properties: {
            text: 'Sample Text',
            font: 'Inter',
            fontSize: 14,
            fontWeight: 400,
            color: '#000000',
            align: 'left',
          },
        })
        break
      // Add other placement modes as needed
    }

    setPlacementMode(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel placement mode
      if (e.key === 'Escape' && placementMode) {
        setPlacementMode(null)
        return
      }

      if (selectedElementId && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        deleteElement(selectedElementId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, deleteElement, placementMode])

  if (!selectedLabel) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">
            No label selected
          </p>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Please select a label type to start designing
          </p>
        </div>
      </div>
    )
  }

  // Show placement mode indicator
  if (placementMode) {
    return (
      <div className={cn('flex items-center justify-center h-full relative', className)}>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-10">
          {placementMode === 'text' && 'Click on canvas to place text'}
        </div>
        <div className="flex items-center justify-center p-6 bg-[var(--color-bg-secondary)] overflow-auto">
          <div
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
            }}
            className="relative bg-white shadow-lg border border-[var(--color-border-primary)]"
          >
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onContextMenu={handleContextMenu}
              className="cursor-crosshair"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex items-center justify-center p-6 bg-[var(--color-bg-secondary)] overflow-auto', className)}
    >
      <div
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
        }}
        className="relative bg-white shadow-lg border border-[var(--color-border-primary)]"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
          className={isResizing ? 'cursor-nwse-resize' : isDragging ? 'cursor-move' : 'cursor-crosshair'}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed bg-white border border-[var(--color-border-primary)] rounded-md shadow-lg py-2 z-50 min-w-[150px]"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <button
              onClick={() => {
                if (contextMenu) {
                  deleteElement(contextMenu.elementId)
                  setContextMenu(null)
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-gray-50)]"
            >
              Delete
            </button>
            <button
              onClick={() => {
                if (contextMenu) {
                  copyElement(contextMenu.elementId)
                  setContextMenu(null)
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-gray-50)]"
            >
              Copy
            </button>
            {copiedElement && (
              <button
                onClick={() => {
                  pasteElement()
                  setContextMenu(null)
                }}
                className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-gray-50)]"
              >
                Paste
              </button>
            )}
            <button
              onClick={() => {
                if (contextMenu) {
                  duplicateElement(contextMenu.elementId)
                  setContextMenu(null)
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-gray-50)]"
            >
              Duplicate
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Canvas

