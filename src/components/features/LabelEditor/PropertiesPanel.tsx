'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EditorElement, TextElement, ImageElement, BarcodeElement, ShapeElement } from '@/types/editor'
import { cn } from '@/lib/utils/cn'

export interface PropertiesPanelProps {
  className?: string
}

/**
 * PropertiesPanel component - displays and edits properties of selected element
 */
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ className }) => {
  const { selectedElementId, elements, updateElement, deleteElement } = useEditorStore()

  const selectedElement = elements.find((el: any) => el.id === selectedElementId)

  if (!selectedElement) {
    return (
      <div className={`p-6 bg-white border-l border-[var(--color-border-primary)] ${className}`}>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Select an element to edit its properties
        </p>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<EditorElement>) => {
    if (selectedElementId) {
      updateElement(selectedElementId, updates)
    }
  }

  const handleDelete = () => {
    if (selectedElementId && confirm('Are you sure you want to delete this element?')) {
      deleteElement(selectedElementId)
    }
  }

  return (
    <div className={`p-6 bg-white border-l border-[var(--color-border-primary)] overflow-y-auto ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          Properties
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] capitalize">
          {selectedElement.type} Element
        </p>
      </div>

      {/* Position & Size */}
      <div className="mb-6 space-y-4">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Position & Size</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">X</label>
            <Input
              type="number"
              value={selectedElement.x}
              onChange={(e) => handleUpdate({ x: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Y</label>
            <Input
              type="number"
              value={selectedElement.y}
              onChange={(e) => handleUpdate({ y: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Width</label>
            <Input
              type="number"
              min="10"
              value={selectedElement.width}
              onChange={(e) => {
                const width = Math.max(10, parseFloat(e.target.value) || 0)
                handleUpdate({ width })
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Height</label>
            <Input
              type="number"
              min="10"
              value={selectedElement.height}
              onChange={(e) => {
                const height = Math.max(10, parseFloat(e.target.value) || 0)
                handleUpdate({ height })
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
            Rotation
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation}
            onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
            <span>0°</span>
            <span>{selectedElement.rotation}°</span>
            <span>360°</span>
          </div>
        </div>
      </div>

      {/* Z-Index Controls */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-2">Layer Order</label>
        <ZIndexControls selectedElement={selectedElement} onUpdate={handleUpdate} />
      </div>

      {/* Type-specific properties */}
      {selectedElement.type === 'text' && (
        <TextElementProperties
          element={selectedElement as TextElement}
          onUpdate={handleUpdate}
        />
      )}

      {selectedElement.type === 'image' && (
        <ImageElementProperties
          element={selectedElement as ImageElement}
          onUpdate={handleUpdate}
        />
      )}

      {selectedElement.type === 'barcode' && (
        <BarcodeElementProperties
          element={selectedElement as BarcodeElement}
          onUpdate={handleUpdate}
        />
      )}

      {selectedElement.type === 'shape' && (
        <ShapeElementProperties
          element={selectedElement as ShapeElement}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Button */}
      <div className="mt-8 pt-6 border-t border-[var(--color-border-primary)]">
        <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
          Delete Element
        </Button>
      </div>
    </div>
  )
}

function TextElementProperties({
  element,
  onUpdate,
}: {
  element: TextElement
  onUpdate: (updates: Partial<EditorElement>) => void
}) {
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null)

  const debouncedUpdate = (updates: Partial<EditorElement>) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      onUpdate(updates)
    }, 100)
    setDebounceTimer(timer)
  }

  const handleTextChange = (value: string) => {
    debouncedUpdate({
      properties: { ...element.properties, text: value },
    } as Partial<TextElement>)
  }

  React.useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

  const characterCount = element.properties.text.length
  const maxCharacters = 255

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Text Properties</h4>
      <div>
        <label className="text-sm font-medium mb-2 block">Text</label>
        <Input
          type="text"
          value={element.properties.text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {characterCount}/{maxCharacters} characters
        </p>
      </div>

      {/* Font Selection */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Font Family
        </label>
        <select
          value={element.properties.font}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, font: e.target.value },
            } as Partial<TextElement>)
          }
          className="w-full h-10 px-3 rounded-md border border-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Monospace">Monospace</option>
        </select>
      </div>

      {/* Font Size Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[var(--color-gray-700)]">Font Size</label>
          <span className="text-xs text-[var(--color-text-secondary)]">{element.properties.fontSize}pt</span>
        </div>
        <input
          type="range"
          min="8"
          max="72"
          step="2"
          value={element.properties.fontSize}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, fontSize: parseInt(e.target.value) },
            } as Partial<TextElement>)
          }
          className="w-full"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Font Weight
        </label>
        <select
          value={element.properties.fontWeight}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, fontWeight: parseInt(e.target.value) },
            } as Partial<TextElement>)
          }
          className="w-full h-10 px-3 rounded-md border border-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value={400}>Normal (400)</option>
          <option value={500}>Medium (500)</option>
          <option value={600}>Semibold (600)</option>
          <option value={700}>Bold (700)</option>
        </select>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-2">Text Alignment</label>
        <div className="flex gap-2">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button
              key={align}
              onClick={() =>
                onUpdate({
                  properties: { ...element.properties, align },
                } as Partial<TextElement>)
              }
              className={cn(
                'flex-1 h-10 rounded-md border transition-colors',
                element.properties.align === align
                  ? 'bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]'
                  : 'bg-white border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-50)]'
              )}
              title={align.charAt(0).toUpperCase() + align.slice(1)}
            >
              {align === 'left' && '⬅'}
              {align === 'center' && '⬌'}
              {align === 'right' && '➡'}
              {align === 'justify' && '⬌⬌'}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Text Color
        </label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={element.properties.color}
            onChange={(e) =>
              onUpdate({
                properties: { ...element.properties, color: e.target.value },
              } as Partial<TextElement>)
            }
            className="w-20"
          />
          <Input
            type="text"
            value={element.properties.color}
            onChange={(e) =>
              onUpdate({
                properties: { ...element.properties, color: e.target.value },
              } as Partial<TextElement>)
            }
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}

function ImageElementProperties({
  element,
  onUpdate,
}: {
  element: ImageElement
  onUpdate: (updates: Partial<EditorElement>) => void
}) {
  const [uploading, setUploading] = React.useState(false)

  const handleReplaceImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          alert('Please log in to upload images')
          return
        }

        const { uploadImage } = await import('@/lib/storage/imageUpload')
        const currentDesignId = useEditorStore.getState().currentDesignId
        const result = await uploadImage({
          file,
          userId: user.id,
          designId: currentDesignId || undefined,
        })

        if (result.success && result.url) {
          onUpdate({
            properties: { ...element.properties, image_url: result.url, alt_text: file.name },
          } as Partial<ImageElement>)
        } else {
          alert(result.error || 'Failed to upload image')
        }
      } catch (error) {
        console.error('Image replace error:', error)
        alert('Failed to upload image')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Image Properties</h4>
      
      {/* Image Preview */}
      <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
        {element.properties.image_url ? (
          <img
            src={element.properties.image_url}
            alt={element.properties.alt_text || 'Image'}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-xs text-gray-400">No image</span>
        )}
      </div>

      {/* Replace Image Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReplaceImage}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Replace Image'}
      </Button>

      {/* Opacity */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Opacity
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={element.properties.opacity}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, opacity: parseInt(e.target.value) },
            } as Partial<ImageElement>)
          }
          className="w-full"
        />
        <span className="text-xs text-[var(--color-text-secondary)]">{element.properties.opacity}%</span>
      </div>
    </div>
  )
}

function BarcodeElementProperties({
  element,
  onUpdate,
}: {
  element: BarcodeElement
  onUpdate: (updates: Partial<EditorElement>) => void
}) {
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const validateBarcodeValue = (type: string, value: string): boolean => {
    switch (type) {
      case 'EAN13':
        return /^\d{13}$/.test(value)
      case 'EAN8':
        return /^\d{8}$/.test(value)
      case 'UPC-A':
        return /^\d{12}$/.test(value)
      case 'UPC-E':
        return /^\d{6}$/.test(value)
      case 'CODE128':
      case 'CODE39':
      case 'QRCODE':
      case 'AZTEC':
        return value.length > 0
      default:
        return true
    }
  }

  const handleValueChange = (value: string) => {
    const isValid = validateBarcodeValue(element.properties.barcode_type, value)
    if (isValid) {
      setValidationError(null)
      onUpdate({
        properties: { ...element.properties, barcode_value: value },
      } as Partial<BarcodeElement>)
    } else {
      setValidationError(`Invalid value for ${element.properties.barcode_type}`)
    }
  }

  const handleTypeChange = (type: string) => {
    const isValid = validateBarcodeValue(type, element.properties.barcode_value)
    if (!isValid) {
      setValidationError(`Current value doesn't match ${type} format`)
    } else {
      setValidationError(null)
    }
    onUpdate({
      properties: { ...element.properties, barcode_type: type as any },
    } as Partial<BarcodeElement>)
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Barcode Properties</h4>
      <div>
        <label className="text-sm font-medium mb-2 block">Value</label>
        <Input
          type="text"
          value={element.properties.barcode_value}
          onChange={(e) => handleValueChange(e.target.value)}
        />
        {validationError && (
          <p className="mt-1 text-xs text-[var(--color-error-500)]">{validationError}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Type
        </label>
        <select
          value={element.properties.barcode_type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value="CODE128">CODE128 (Any value)</option>
          <option value="EAN13">EAN13 (13 digits)</option>
          <option value="EAN8">EAN8 (8 digits)</option>
          <option value="UPC-A">UPC-A (12 digits)</option>
          <option value="UPC-E">UPC-E (6 digits)</option>
          <option value="CODE39">CODE39</option>
          <option value="QRCODE">QRCODE</option>
          <option value="AZTEC">AZTEC</option>
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={element.properties.human_readable}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, human_readable: e.target.checked },
            } as Partial<BarcodeElement>)
          }
          className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
        />
        <span className="text-sm text-[var(--color-text-secondary)]">Show human-readable text</span>
      </label>
      {element.properties.human_readable && (
        <div>
          <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
            Human Readable Font Size
          </label>
          <input
            type="number"
            min="6"
            max="12"
            value={element.properties.human_readable_font_size || 12}
            onChange={(e) =>
              onUpdate({
                properties: {
                  ...element.properties,
                  human_readable_font_size: parseInt(e.target.value) || 12,
                },
              } as Partial<BarcodeElement>)
            }
            className="w-full h-10 px-3 rounded-md border border-[var(--color-border-primary)]"
          />
        </div>
      )}
    </div>
  )
}

function ShapeElementProperties({
  element,
  onUpdate,
}: {
  element: ShapeElement
  onUpdate: (updates: Partial<EditorElement>) => void
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Shape Properties</h4>
      <div className="space-y-2">
        <label className="text-sm font-medium">Fill Color</label>
        <Input
          type="color"
          value={element.properties.fill_color}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, fill_color: e.target.value },
            } as Partial<ShapeElement>)
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Border Color</label>
        <Input
          type="color"
          value={element.properties.border_color}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, border_color: e.target.value },
            } as Partial<ShapeElement>)
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Border Width</label>
        <Input
          type="number"
          min="1"
          max="10"
          value={element.properties.border_width}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, border_width: parseInt(e.target.value) || 1 },
            } as Partial<ShapeElement>)
          }
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--color-gray-700)] mb-1.5">
          Fill Opacity
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={element.properties.fill_opacity}
          onChange={(e) =>
            onUpdate({
              properties: { ...element.properties, fill_opacity: parseInt(e.target.value) },
            } as Partial<ShapeElement>)
          }
          className="w-full"
        />
        <span className="text-xs text-[var(--color-text-secondary)]">{element.properties.fill_opacity}%</span>
      </div>
    </div>
  )
}

function ZIndexControls({
  selectedElement,
}: {
  selectedElement: EditorElement
  onUpdate: (updates: Partial<EditorElement>) => void
}) {
  const { elements, updateElement } = useEditorStore()

  const handleMoveUp = () => {
    const currentIndex = selectedElement.z_index
    const maxZIndex = Math.max(...elements.map((e: any) => e.z_index), 0)
    if (currentIndex < maxZIndex) {
      updateElement(selectedElement.id, { z_index: currentIndex + 1 })
    }
  }

  const handleMoveDown = () => {
    const currentIndex = selectedElement.z_index
    if (currentIndex > 1) {
      updateElement(selectedElement.id, { z_index: currentIndex - 1 })
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleMoveUp} className="flex-1">
        ↑ Move Up
      </Button>
      <Button variant="outline" size="sm" onClick={handleMoveDown} className="flex-1">
        ↓ Move Down
      </Button>
    </div>
  )
}

export default PropertiesPanel

