'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Type, Image, Barcode, Square, Circle, Minus, Paintbrush } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export interface ToolPanelProps {
  className?: string
  onToggleBackground?: () => void
}

/**
 * ToolPanel component - toolbar for adding elements to the canvas
 */
export const ToolPanel: React.FC<ToolPanelProps> = ({ className, onToggleBackground }) => {
  const { addElement, canvas } = useEditorStore()
  const [showShapeMenu, setShowShapeMenu] = React.useState(false)

  const handleAddText = () => {
    // Create text element immediately at center of canvas
    const newTextElement = {
      id: uuidv4(),
      type: 'text' as const,
      x: canvas.width_px / 2 - 50,
      y: canvas.height_px / 2 - 10,
      width: 100,
      height: 20,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'New Text',
        font: 'Inter',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        align: 'left' as 'left' | 'center' | 'right' | 'justify',
        lineHeight: 1.2,
      },
    }
    addElement(newTextElement)
  }

  const handleAddImage = async () => {
    // Trigger file picker
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      // Get current user ID (you'll need to get this from auth context)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to upload images')
        return
      }

      // Get current design ID from store
      const currentDesignId = useEditorStore.getState().currentDesignId

      // Upload to Supabase storage
      const { uploadImage } = await import('@/lib/storage/imageUpload')
      const result = await uploadImage({
        file,
        userId: user.id,
        designId: currentDesignId || undefined,
      })

      if (!result.success || !result.url) {
        alert(result.error || 'Failed to upload image')
        return
      }

      // Create image element with uploaded URL
      const newImageElement = {
        id: uuidv4(),
        type: 'image' as const,
        x: canvas.width_px / 2 - 100,
        y: canvas.height_px / 2 - 100,
        width: 200,
        height: 200,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          image_url: result.url,
          alt_text: file.name,
          opacity: 100,
          aspectRatioLocked: true,
        },
      }
      addElement(newImageElement)
    }
    input.click()
  }

  const handleAddBarcode = () => {
    const newBarcodeElement = {
      id: uuidv4(),
      type: 'barcode' as const,
      x: canvas.width_px / 2 - 100,
      y: canvas.height_px / 2 - 25,
      width: 200,
      height: 50,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        barcode_type: 'CODE128' as const,
        barcode_value: '123456789',
        human_readable: true,
        human_readable_font_size: 12,
      },
    }
    addElement(newBarcodeElement)
  }

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'line') => {
    const baseProps = {
      id: uuidv4(),
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        fill_color: '#000000',
        fill_opacity: 0,
        border_color: '#000000',
        border_width: 2,
      },
    }

    if (shapeType === 'line') {
      addElement({
        ...baseProps,
        type: 'shape' as const,
        x: canvas.width_px / 4,
        y: canvas.height_px / 2,
        width: 200,
        height: 0,
        properties: {
          ...baseProps.properties,
          shape_type: 'line',
        },
      })
    } else {
      addElement({
        ...baseProps,
        type: 'shape' as const,
        x: canvas.width_px / 2 - 50,
        y: canvas.height_px / 2 - 50,
        width: 100,
        height: 100,
        properties: {
          ...baseProps.properties,
          shape_type: shapeType,
        },
      })
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 py-6 bg-white border-r border-gray-200 h-full w-16 shadow-sm z-20 ${className}`}>
      
      {/* Tool Groups */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddText}
                className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Type size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-800 text-white border-gray-800" sideOffset={5}>
              <p>Add Text</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddImage}
                className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Image size={20} />
              </Button>
            </TooltipTrigger>
             <TooltipContent side="right" className="bg-gray-800 text-white border-gray-800" sideOffset={5}>
              <p>Add Image</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddBarcode}
                className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Barcode size={20} />
              </Button>
            </TooltipTrigger>
             <TooltipContent side="right" className="bg-gray-800 text-white border-gray-800" sideOffset={5}>
              <p>Add Barcode</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative group">
             <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShapeMenu(!showShapeMenu)}
                  className={`h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all ${showShapeMenu ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <Square size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-800" sideOffset={5}>
                <p>Shapes</p>
              </TooltipContent>
            </Tooltip>
            
            {showShapeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowShapeMenu(false)}
                />
                <div className="absolute left-12 top-0 ml-2 bg-white border border-gray-200 rounded-lg shadow-xl p-1.5 z-50 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-xs font-semibold text-gray-400 px-2 py-1 mb-1 uppercase tracking-wider">Add Shape</div>
                  <button
                    onClick={() => {
                      handleAddShape('rectangle')
                      setShowShapeMenu(false)
                    }}
                    className="w-full px-2 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center transition-colors"
                  >
                    <Square size={16} className="mr-2" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => {
                      handleAddShape('circle')
                      setShowShapeMenu(false)
                    }}
                    className="w-full px-2 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center transition-colors"
                  >
                    <Circle size={16} className="mr-2" />
                    Circle
                  </button>
                  <button
                    onClick={() => {
                      handleAddShape('line')
                      setShowShapeMenu(false)
                    }}
                    className="w-full px-2 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center transition-colors"
                  >
                    <Minus size={16} className="mr-2" />
                    Line
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="w-8 h-px bg-gray-200 my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleBackground}
                className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Paintbrush size={20} />
              </Button>
            </TooltipTrigger>
             <TooltipContent side="right" className="bg-gray-800 text-white border-gray-800" sideOffset={5}>
              <p>Background</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </div>
    </div>
  )
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"

export default ToolPanel

