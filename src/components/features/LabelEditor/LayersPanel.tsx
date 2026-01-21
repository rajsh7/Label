'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { EditorElement } from '@/types/editor'
import { Type, Image, Barcode, Square, Eye, EyeOff, X, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface LayersPanelProps {
  className?: string
}

/**
 * LayersPanel component - displays all elements in a list
 * Allows selection, visibility toggling, deletion, and z-index reordering
 */
export const LayersPanel: React.FC<LayersPanelProps> = ({ className }) => {
  const {
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    deleteElement,
  } = useEditorStore()

  // Sort elements by z_index (top to bottom in list = highest to lowest z_index)
  const sortedElements = [...elements].sort((a, b) => b.z_index - a.z_index)

  const getElementIcon = (element: EditorElement) => {
    switch (element.type) {
      case 'text':
        return <Type size={16} className="text-blue-600" />
      case 'image':
        return <Image size={16} className="text-green-600" />
      case 'barcode':
        return <Barcode size={16} className="text-purple-600" />
      case 'shape':
        return <Square size={16} className="text-orange-600" />
      default:
        return <Square size={16} />
    }
  }

  const getElementName = (element: EditorElement): string => {
    switch (element.type) {
      case 'text':
        return (element.properties as any).text || 'Text Element'
      case 'image':
        return (element.properties as any).alt_text || 'Image'
      case 'barcode':
        return `Barcode: ${(element.properties as any).barcode_value || 'N/A'}`
      case 'shape':
        return `${(element.properties as any).shape_type || 'Shape'}`
      default:
        return 'Element'
    }
  }

  const handleToggleVisibility = (elementId: string, currentVisible: boolean) => {
    updateElement(elementId, { visible: !currentVisible })
  }

  const handleDelete = (elementId: string, elementName: string) => {
    if (confirm(`Delete "${elementName}"?`)) {
      deleteElement(elementId)
    }
  }

  if (elements.length === 0) {
    return (
      <div className={cn('p-4 bg-white border-r border-[var(--color-border-primary)]', className)}>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Layers</h3>
        <p className="text-xs text-[var(--color-text-secondary)]">
          No elements yet. Add elements to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('p-4 bg-white border-r border-[var(--color-border-primary)] overflow-y-auto', className)}>
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Layers</h3>
      <div className="space-y-1">
        {sortedElements.map((element) => {
          const isSelected = element.id === selectedElementId
          const displayName = getElementName(element)
          const truncatedName = displayName.length > 20 ? `${displayName.substring(0, 20)}...` : displayName

          return (
            <div
              key={element.id}
              className={cn(
                'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group',
                isSelected
                  ? 'bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]'
                  : 'hover:bg-[var(--color-gray-50)]',
                !element.visible && 'opacity-50'
              )}
              onClick={() => selectElement(element.id)}
            >
              {/* Drag Handle */}
              <GripVertical size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />

              {/* Icon */}
              <div className="flex-shrink-0">{getElementIcon(element)}</div>

              {/* Element Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {truncatedName}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] capitalize">{element.type}</p>
              </div>

              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleVisibility(element.id, element.visible)
                }}
                className={cn(
                  'p-1 rounded hover:bg-[var(--color-gray-100)] transition-colors flex-shrink-0',
                  !element.visible && 'opacity-50'
                )}
                title={element.visible ? 'Hide element' : 'Show element'}
              >
                {element.visible ? (
                  <Eye size={16} className="text-[var(--color-text-secondary)]" />
                ) : (
                  <EyeOff size={16} className="text-[var(--color-text-secondary)]" />
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(element.id, displayName)
                }}
                className="p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                title="Delete element"
              >
                <X size={16} className="text-red-600" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LayersPanel

