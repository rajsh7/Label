'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useEditorStore } from '@/lib/store/editorStore'
import Barcode from 'react-barcode'

export function EditorCanvas() {
  const { elements, selectedElementId, selectElement, updateElement, deselectElement, canvas } = useEditorStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicked on canvas background, deselect
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-area')) {
        deselectElement()
    }
  }

  return (
    <main 
        className="flex-1 relative bg-[#F9FAFB] flex items-center justify-center overflow-hidden canvas-area"
        onClick={handleCanvasClick}
    >
        {/* Dot Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}></div>

        <div className="relative transition-transform duration-200 bg-white rounded-xl overflow-hidden" 
             id="label-editor-canvas"
             style={{
                 width: `${canvas.width_px}px`, 
                 height: `${canvas.height_px}px`,
                 transform: `scale(${canvas.zoom_level / 100})`,
                 transformOrigin: 'center center' 
             }}>
            
            {/* Elements */}
            <div ref={canvasRef} className="absolute inset-0 w-full h-full">
                {elements.map((el) => (
                    <DraggableElement 
                        key={el.id} 
                        element={el} 
                        isSelected={el.id === selectedElementId}
                        onSelect={() => selectElement(el.id)}
                        onUpdate={(changes) => updateElement(el.id, changes)}
                    />
                ))}
            </div>
        </div>
    </main>
  )
}

function DraggableElement({ element, isSelected, onSelect, onUpdate }: { element: any, isSelected: boolean, onSelect: () => void, onUpdate: (changes: any) => void }) {
    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
                onUpdate({
                    x: element.x + info.offset.x,
                    y: element.y + info.offset.y
                })
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
            initial={{ x: element.x, y: element.y }}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: element.width || 'auto',
                height: element.height || 'auto',
                zIndex: element.z_index,
                cursor: isSelected ? 'move' : 'pointer',
                ...element.style
            }}
            className="group"
        >
            {/* Render Content based on type */}
            {element.type === 'text' && (
                <div 
                    contentEditable={isSelected}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate({ content: e.currentTarget.textContent })}
                    className="w-full h-full outline-none"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {element.content}
                </div>
            )}
            
            {element.type === 'shape' && (
               <div className="w-full h-full bg-gray-200 border border-gray-400" style={element.style}></div>
            )}

            {element.type === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={element.content} 
                    alt="element" 
                    className="w-full h-full object-contain pointer-events-none"
                    style={element.style}
                />
            )}

            {element.type === 'barcode' && (
                <div className="w-full h-full flex items-center justify-center bg-white pointer-events-none" style={element.style}>
                     <Barcode 
                        value={element.content}
                        width={element.width ? Math.max(1, element.width / (element.content.length * 10)) : 2} // Adaptive width
                        height={element.height || 50}
                        displayValue={element.displayValue !== undefined ? element.displayValue : false}
                        margin={0}
                        background="transparent"
                     />
                </div>
            )}

            {/* Selection Ring */}
            {isSelected && (
                <div className="absolute -inset-2 border-2 border-[#3b82f6] pointer-events-none">
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -top-1.5 -left-1.5"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -top-1.5 left-1/2 -translate-x-1/2"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -top-1.5 -right-1.5"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] top-1/2 -translate-y-1/2 -right-1.5"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -bottom-1.5 -right-1.5"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -bottom-1.5 left-1/2 -translate-x-1/2"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] -bottom-1.5 -left-1.5"></span>
                      <span className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] top-1/2 -translate-y-1/2 -left-1.5"></span>
                </div>
            )}
        </motion.div>
    )
}
