'use client'


import { useEditorStore } from '@/lib/store/editorStore'

export function SidebarRight() {
  const { selectedElementId, elements, updateElement } = useEditorStore()
  
  const selectedElement = elements.find(el => el.id === selectedElementId)

  if (!selectedElement) {
    return (
      <aside className="hidden md:flex w-80 bg-sidebar-light border-l border-border-light flex-col items-center justify-center z-40 shadow-sm h-full pt-20 text-text-secondary">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">touch_app</span>
        <p className="text-sm">Select an element to edit</p>
      </aside>
    )
  }

  const handleUpdateStyle = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      style: { ...selectedElement.style, [key]: value }
    })
  }

  const handlePositionChange = (key: 'x' | 'y', value: string) => {
     updateElement(selectedElement.id, { [key]: Number(value) })
  }

  return (
    <aside className="hidden md:flex w-80 bg-sidebar-light border-l border-border-light flex-col overflow-y-auto z-40 shadow-sm h-full pt-20">
      <div className="flex border-b border-border-light">
        <button className="flex-1 py-3 text-sm font-bold text-black border-b-2 border-primary bg-gray-50/50">Design</button>
        <button className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-black transition-colors">Settings</button>
      </div>
      
      <div className="p-5 space-y-8">
        {/* Alignment */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Alignment</h3>
          </div>
          <div className="grid grid-cols-6 gap-1 bg-gray-50 p-1 rounded-lg border border-border-light">
             {['left', 'center', 'right', 'top', 'center', 'bottom'].map((align, i) => (
                <button key={i} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-black transition">
                  <span className="material-symbols-outlined text-[18px]">
                    {i < 3 ? `align_horizontal_${align}` : `align_vertical_${align}`}
                  </span>
                </button>
             ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">X</span>
              <input 
                className="w-full bg-white border border-border-light rounded-md py-1.5 pl-7 pr-2 text-sm text-right text-black focus:ring-1 focus:ring-primary focus:border-primary border-gray-200" 
                type="number" 
                value={Math.round(selectedElement.x || 0)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Y</span>
              <input 
                 className="w-full bg-white border border-border-light rounded-md py-1.5 pl-7 pr-2 text-sm text-right text-black focus:ring-1 focus:ring-primary focus:border-primary border-gray-200" 
                 type="number" 
                 value={Math.round(selectedElement.y || 0)}
                 onChange={(e) => handlePositionChange('y', e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">W</span>
              <input 
                className="w-full bg-white border border-border-light rounded-md py-1.5 pl-7 pr-2 text-sm text-right text-black focus:ring-1 focus:ring-primary focus:border-primary border-gray-200" 
                type="number" 
                value={Math.round(selectedElement.width || 0)}
                onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">H</span>
              <input 
                 className="w-full bg-white border border-border-light rounded-md py-1.5 pl-7 pr-2 text-sm text-right text-black focus:ring-1 focus:ring-primary focus:border-primary border-gray-200" 
                 type="number" 
                 value={Math.round(selectedElement.height || 0)}
                 onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <hr className="border-border-light"/>

        {/* Typography - Only show if text element */}
        {selectedElement.type === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Typography</h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <select 
                    className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm text-black focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                    value={selectedElement.style?.fontFamily}
                    onChange={(e) => handleUpdateStyle('fontFamily', e.target.value)}
                  >
                    <option value="Manrope">Manrope (Display)</option>
                    <option value="Playfair Display">Playfair Display (Serif)</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <input 
                      className="w-full bg-white border border-border-light rounded-lg py-2 pl-3 pr-8 text-sm text-black focus:ring-1 focus:ring-primary focus:border-primary shadow-sm border-gray-200" 
                      type="number" 
                      value={parseInt(selectedElement.style?.fontSize || '24')}
                      onChange={(e) => handleUpdateStyle('fontSize', parseInt(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">pt</span>
                  </div>
                </div>
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg border border-border-light justify-between">
                    <button className="p-2 rounded hover:bg-white transition" onClick={() => handleUpdateStyle('fontWeight', 'bold')}><b>B</b></button>
                    <button className="p-2 rounded hover:bg-white transition" onClick={() => handleUpdateStyle('fontStyle', 'italic')}><i>I</i></button>
                    <button className="p-2 rounded hover:bg-white transition" onClick={() => handleUpdateStyle('textDecoration', 'underline')}><u>U</u></button>
                </div>
                 <div className="flex items-center justify-between p-2 rounded-lg border border-border-light hover:border-gray-300 transition-colors cursor-pointer bg-white shadow-sm">
                  <span className="text-sm text-text-secondary">Fill Color</span>
                  <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={selectedElement.style?.color || '#000000'}
                        onChange={(e) => handleUpdateStyle('color', e.target.value)}
                        className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer p-0 overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Opacity</h3>
            <span className="text-xs text-gray-500 font-mono">{Math.round((selectedElement.style?.opacity || 1) * 100)}%</span>
          </div>
          <input 
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={selectedElement.style?.opacity || 1}
            onChange={(e) => handleUpdateStyle('opacity', parseFloat(e.target.value))}
          />
        </div>

      </div>
    </aside>
  )
}
