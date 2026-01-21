'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Type, Image, Barcode, Square, Circle, Minus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export interface ToolPanelProps {
  className?: string
}

/**
 * ToolPanel component - toolbar for adding elements to the canvas
 */
export const ToolPanel: React.FC<ToolPanelProps> = ({ className }) => {
  const { addElement, canvas } = useEditorStore()
  const [placementMode, setPlacementMode] = React.useState<'text' | 'image' | 'barcode' | 'shape' | null>(null)

  // Pass placement mode to Canvas component via a custom event or store
  React.useEffect(() => {
    // Store placement mode in a way Canvas can access it
    if (placementMode) {
      window.dispatchEvent(new CustomEvent('editor:placement-mode', { detail: placementMode }))
    }
  }, [placementMode])

  const handleAddText = () => {
    // Set placement mode - Canvas will handle click-to-place
    setPlacementMode('text')
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
    <div className={`flex items-center gap-2 p-4 bg-white border-b border-[var(--color-border-primary)] ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--color-text-secondary)] mr-2">Tools:</span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddText}
          title="Add Text"
        >
          <Type size={18} className="mr-2" />
          Text
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddImage}
          title="Add Image"
        >
          <Image size={18} className="mr-2" />
          Image
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddBarcode}
          title="Add Barcode"
        >
          <Barcode size={18} className="mr-2" />
          Barcode
        </Button>

        <div className="flex items-center gap-1 border-l border-[var(--color-border-primary)] pl-2 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddShape('rectangle')}
            title="Add Rectangle"
          >
            <Square size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddShape('circle')}
            title="Add Circle"
          >
            <Circle size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddShape('line')}
            title="Add Line"
          >
            <Minus size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ToolPanel

