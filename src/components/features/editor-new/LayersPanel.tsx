'use client'

import React, { useState } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'

export function LayersPanel() {
  const { elements, selectedElementId, selectElement, updateElement, deleteElement } = useEditorStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Reverse elements for layer list (top layer first)
  const layerList = [...elements].sort((a, b) => b.z_index - a.z_index)

  const handleToggleVisibility = (e: React.MouseEvent, id: string, currentVisible: boolean) => {
    e.stopPropagation()
    updateElement(id, { visible: !currentVisible })
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    // No confirmation as requested
    deleteElement(id)
  }

  return (
    <>
      {/* Desktop Toggle Button (Hidden on Mobile) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex fixed bottom-6 left-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">layers</span>
      </button>

      {/* Layers Panel */}
      <div className={`absolute bottom-2 left-2 md:bottom-6 md:left-6 w-56 md:w-64 bg-white/95 backdrop-blur-md rounded-xl border border-border-light shadow-2xl overflow-hidden flex flex-col animate-fade-in-up z-50 transition-transform ${isCollapsed ? 'md:translate-x-0 -translate-x-full' : 'translate-x-0'}`}>
        <div className="px-4 py-3 border-b border-border-light flex justify-between items-center bg-gray-50/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Layers</h3>
          <button 
            onClick={() => setIsCollapsed(true)}
            className="md:hidden text-gray-400 hover:text-black"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="max-h-[250px] md:max-h-[400px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {layerList.map((layer) => {
             const isActive = layer.id === selectedElementId
             let icon = 'text_fields'
             if (layer.type === 'shape') icon = 'shapes'
             if (layer.type === 'image') icon = 'image'
             if (layer.type === 'barcode') icon = 'qr_code_2'

             return (
                <div 
                    key={layer.id} 
                    onClick={(e) => {
                        e.stopPropagation()
                        selectElement(layer.id)
                    }}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group ${isActive ? 'bg-primary/5 border border-primary/20' : 'hover:bg-gray-100 text-text-secondary hover:text-black'}`}
                >
                  <span className={`material-symbols-outlined text-sm ${isActive ? 'text-primary' : ''}`}>{icon}</span>
                  <span className={`text-sm font-medium flex-1 truncate ${isActive ? 'text-black' : ''}`}>
                    {layer.type.charAt(0).toUpperCase() + layer.type.slice(1)}
                  </span>
                  
                  {/* Visibility Toggle */}
                  <button 
                    onClick={(e) => handleToggleVisibility(e, layer.id, layer.visible)}
                    className={`text-gray-400 hover:text-black p-1 rounded hover:bg-gray-200 transition-colors ${!layer.visible ? 'text-gray-300' : ''}`}
                    title={layer.visible ? "Hide" : "Show"}
                  >
                    <span className="material-symbols-outlined text-xs">
                        {layer.visible ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleDelete(e, layer.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                  </button>
                </div>
             )
          })}
          
          {elements.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-400 italic">
                  No layers defined
              </div>
          )}
        </div>
      </div>
    </>
  )
}
