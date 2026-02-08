'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useEditorStore } from '@/lib/store/editorStore'
import { EditorCanvas } from './Canvas'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function MobileEditor() {
  const { selectedLabel, undo, redo, history, elements, selectedElementId, updateElement, deleteElement, canvas } = useEditorStore()
  const [activeTab, setActiveTab] = useState('text')
  const [isSheetOpen, setIsSheetOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  
  const selectedElement = elements.find(el => el.id === selectedElementId)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSave = () => {
    const saveBtn = document.querySelector('button[title="Save"]') as HTMLButtonElement
    if (saveBtn) saveBtn.click()
    else toast.info("Saving design...")
  }

  const handleDownload = () => {
    const downloadBtn = document.querySelector('button[title="Download"]') as HTMLButtonElement
    if (downloadBtn) downloadBtn.click()
    else toast.info("Preparing download...")
  }

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId)
      setActiveTab('layers')
      toast.success("Element deleted")
    }
  }

  const canUndo = history.undo_stack.length > 0
  const canRedo = history.redo_stack.length > 0

  return (
    <>
      {/* Dropdown Menu Overlay - Rendered at root level */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-16 right-4 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-[400px] overflow-y-auto">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">dashboard</span>
              <span className="text-sm font-medium text-gray-700">Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/templates" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">description</span>
              <span className="text-sm font-medium text-gray-700">Templates</span>
            </Link>
            <Link 
              href="/dashboard/labels" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">folder_open</span>
              <span className="text-sm font-medium text-gray-700">My Labels</span>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">settings</span>
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </Link>
            <Link 
              href="/dashboard/editor" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">edit</span>
              <span className="text-sm font-medium text-gray-700">Editor</span>
            </Link>
            <Link 
              href="/dashboard/batch" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">layers</span>
              <span className="text-sm font-medium text-gray-700">Batch</span>
            </Link>
            <Link 
              href="/dashboard/printers" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">print</span>
              <span className="text-sm font-medium text-gray-700">Printers</span>
            </Link>
            <div className="border-t border-gray-200 my-2" />
            <button 
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-red-600">logout</span>
              <span className="text-sm font-medium text-red-600">Logout</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col h-screen bg-background-light overflow-hidden max-w-[400px] mx-auto border-x border-border-light shadow-2xl relative">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-5 z-[60] flex-shrink-0 relative">
          <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center text-text-main">
            <span className="material-symbols-outlined font-bold">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <span className="text-xs font-black text-text-main tracking-tight truncate max-w-[120px]">
              {selectedLabel?.name || 'Untitled Project'}
            </span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none mt-0.5">
              Editor Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              console.log('Menu clicked, current state:', menuOpen)
              setMenuOpen(!menuOpen)
            }}
            className="w-10 h-10 flex items-center justify-center text-primary bg-primary/5 rounded-full border border-primary/10"
          >
            <span className="material-symbols-outlined text-[22px]">{menuOpen ? 'close' : 'more_vert'}</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Area - Now fills more space with dynamic scaling */}
      <main className="flex-1 relative bg-[#F9FAFB] overflow-hidden pt-4 pb-4">
        {/* Dynamic Scale Wrapper: fits canvas to mobile screen */}
        {(() => {
          const viewportWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 390) : 358 // Account for padding
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight - 300 : 500 // Account for header + bottom nav
          
          const scaleX = viewportWidth / canvas.width_px
          const scaleY = viewportHeight / canvas.height_px
          const fittedScale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
          
          return (
            <div className="flex items-center justify-center h-full px-4">
              <div 
                className="origin-center transition-transform duration-300"
                style={{ transform: `scale(${fittedScale})` }}
              >
                <EditorCanvas />
              </div>
            </div>
          )
        })()}
      </main>

      {/* Expandable Properties Sheet - Refactored to Absolute Overlay */}
      <div className={`absolute left-0 right-0 bottom-20 bg-white rounded-t-3xl shadow-sheet border-t border-border-light z-40 transition-transform duration-500 ease-in-out ${isSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-12px)]'}`}>
        <div 
          className="h-12 w-full flex items-center justify-center cursor-pointer group"
          onClick={() => setIsSheetOpen(!isSheetOpen)}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="h-1.5 w-12 bg-gray-200 rounded-full group-hover:bg-primary/30 transition-colors"></div>
            {!isSheetOpen && <span className="text-[10px] font-black text-primary uppercase tracking-tighter animate-pulse">Design Panel</span>}
          </div>
        </div>

        <div className="px-6 pb-10 overflow-y-auto max-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-text-main flex items-center gap-2">
                {selectedElement ? 'Properties' : 'Design Tools'}
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {selectedElement ? 'Edit' : 'Add'}
                </span>
            </h3>
            <div className="flex gap-1">
              <button 
                onClick={undo}
                disabled={!canUndo}
                className="p-2 text-text-secondary hover:text-primary disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-[22px]">undo</span>
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo}
                className="p-2 text-text-secondary hover:text-primary disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-[22px]">redo</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'properties' && (
              <div className="py-4">
                 {selectedElement ? (
                   <ElementProperties element={selectedElement} updateElement={updateElement} />
                 ) : (
                   <div className="text-center py-10 text-text-secondary">
                      <p className="text-sm">Select an element to edit properties</p>
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'elements' && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <ToolButton icon="text_fields" label="Text" type="text" />
                <ToolButton icon="qr_code_2" label="Barcode" type="barcode" />
                <ToolButton icon="shapes" label="Shape" type="shape" />
                <ToolButton icon="image" label="Image" type="image" />
              </div>
            )}

            {activeTab === 'layers' && (
               <div className="py-2 space-y-2">
                 {[...elements].sort((a, b) => b.z_index - a.z_index).map(el => {
                    const properties = (el as any).properties || {}
                    const title = el.type === 'text' ? (properties.text || 'Text') : el.type === 'barcode' ? (properties.barcode_value || 'Barcode') : el.type === 'shape' ? (properties.shape_type || 'Shape') : 'Image'
                    
                    return (
                      <div 
                        key={el.id} 
                        onClick={() => useEditorStore.getState().selectElement(el.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${el.id === selectedElementId ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                      >
                        <span className="material-symbols-outlined text-text-secondary">
                          {el.type === 'text' ? 'text_fields' : el.type === 'barcode' ? 'qr_code_2' : el.type === 'shape' ? 'shapes' : 'image'}
                        </span>
                        <span className="flex-1 text-sm font-bold truncate">
                          {el.type.charAt(0).toUpperCase() + el.type.slice(1)}: {title.substring(0, 15)}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            useEditorStore.getState().updateElement(el.id, { visible: !el.visible })
                          }}
                          className={`text-gray-400 p-1 ${!el.visible ? 'opacity-30' : ''}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {el.visible ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      </div>
                    )
                 })}
                 {elements.length === 0 && (
                   <div className="text-center py-10 text-text-secondary italic text-sm">
                      No layers found
                   </div>
                 )}
               </div>
            )}

            {activeTab === 'menu' && (
               <div className="py-4 flex flex-col gap-4">
                  <MenuButton icon="save" label="Save Design" color="bg-gray-100" onClick={handleSave} />
                  <MenuButton icon="download" label="Download PNG" color="bg-primary text-white" onClick={handleDownload} />
                  <MenuButton icon="delete" label="Delete Selection" color="bg-red-50 text-red-600" onClick={handleDelete} />
               </div>
            )}

            {(activeTab === 'text' && !selectedElement) && (
               <div className="py-4">
                  <p className="text-sm text-text-secondary mb-4 italic">Quickly add a text element to your label</p>
                  <ToolButton icon="text_fields" label="Add New Text" type="text" className="w-full" />
               </div>
            )}
            
            {(activeTab === 'text' && selectedElement?.type === 'text') && (
               <div className="py-2">
                 <ElementProperties element={selectedElement} updateElement={updateElement} />
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white border-t border-border-light flex items-center justify-around px-2 z-50 shadow-bottom-nav flex-shrink-0">
        <NavButton 
          icon="layers" 
          label="Layers" 
          active={activeTab === 'layers'} 
          onClick={() => setActiveTab('layers')} 
        />
        <NavButton 
          icon="shapes" 
          label="Elements" 
          active={activeTab === 'elements'} 
          onClick={() => setActiveTab('elements')} 
        />
        <NavButton 
          icon="text_fields" 
          label="Text" 
          active={activeTab === 'text'} 
          onClick={() => setActiveTab('text')} 
          isMain
        />
        <NavButton 
          icon="tune" 
          label="Properties" 
          active={activeTab === 'properties'} 
          onClick={() => {
            setActiveTab('properties')
            setIsSheetOpen(true)
          }} 
        />
        <NavButton 
          icon="menu" 
          label="Menu" 
          active={activeTab === 'menu'} 
          onClick={() => setActiveTab('menu')} 
        />
      </nav>
      </div>
    </>
  )
}

function NavButton({ icon, label, active, onClick, isMain }: { icon: string, label: string, active?: boolean, onClick: () => void, isMain?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 flex-1 transition-colors ${active ? 'text-primary' : 'text-text-secondary'}`}
    >
      <div className="relative">
        <span className={`material-symbols-outlined text-[26px] ${active ? 'font-fill-1' : ''}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
          {icon}
        </span>
        {isMain && active && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></div>
        )}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  )
}

function ToolButton({ icon, label, type, className = "" }: { icon: string, label: string, type: string, className?: string }) {
  const { addElement } = useEditorStore()
  
  const handleAdd = () => {
    const { canvas } = useEditorStore.getState()
    
    // Calculate center relative to canvas dimensions
    const initialWidth = type === 'barcode' ? 300 : type === 'text' ? 200 : 100
    const initialHeight = type === 'barcode' ? 80 : type === 'text' ? 50 : 100
    
    const centerX = (canvas.width_px - initialWidth) / 2
    const centerY = (canvas.height_px - initialHeight) / 2

    const newElement: any = {
      id: '', // Will be set after promise
      type,
      x: Math.max(0, centerX),
      y: Math.max(0, centerY),
      width: initialWidth,
      height: initialHeight,
      rotation: 0,
      z_index: 50, // Default high z-index
      visible: true,
      properties: {},
      style: {}
    }

    if (type === 'text') {
      newElement.properties = { text: 'New Text', font: 'Manrope', fontSize: 24, fontWeight: 400, color: '#000000', align: 'left', lineHeight: 1.2 }
    } else if (type === 'barcode') {
       newElement.properties = { barcode_type: 'CODE128', barcode_value: '123456789012', human_readable: true, human_readable_font_size: 10 }
    } else if (type === 'shape') {
       newElement.properties = { shape_type: 'rectangle', fill_color: '#E2E8F0', fill_opacity: 1, border_color: '#000000', border_width: 1 }
    } else if (type === 'image') {
       newElement.properties = { image_url: '/amazon-logo.png', alt_text: 'Brand Logo', opacity: 1, aspectRatioLocked: true }
    }

    import('uuid').then(u => {
      newElement.id = u.v4()
      addElement(newElement)
    })
  }

  return (
    <button 
      onClick={handleAdd}
      className={`flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 border border-border-light rounded-2xl hover:border-primary hover:bg-white transition-all ${className}`}
    >
      <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}

function MenuButton({ icon, label, color, onClick }: { icon: string, label: string, color: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${color}`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function ElementProperties({ element, updateElement }: { element: any, updateElement: any }) {
  const handleUpdateProperty = (key: string, value: any) => {
    updateElement(element.id, {
      properties: { ...element.properties, [key]: value }
    })
  }

  return (
    <div className="space-y-7 pb-4">
      {element.type === 'text' && (
        <>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Font Family</label>
            <div className="relative">
              <select 
                className="w-full bg-gray-50 border border-border-light rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-white hover:border-primary transition-colors shadow-sm appearance-none outline-none font-bold text-sm"
                value={element.properties?.font || 'Manrope'}
                onChange={(e) => handleUpdateProperty('font', e.target.value)}
              >
                <option value="Manrope">Manrope</option>
                <option value="Poppins">Poppins</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Font Size</label>
              <div className="flex items-center bg-gray-50 border border-border-light rounded-2xl p-1.5 shadow-sm">
                <button 
                  onClick={() => handleUpdateProperty('fontSize', Math.max(8, (element.properties?.fontSize || 24) - 2))}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined font-bold">remove</span>
                </button>
                <span className="flex-1 text-center font-bold text-base">{element.properties?.fontSize || 24}pt</span>
                <button 
                  onClick={() => handleUpdateProperty('fontSize', (element.properties?.fontSize || 24) + 2)}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined font-bold">add</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Color</label>
              <div className="h-[54px] bg-gray-50 border border-border-light rounded-2xl px-4 flex items-center gap-3 shadow-sm relative overflow-hidden">
                <input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={element.properties?.color || '#000000'}
                  onChange={(e) => handleUpdateProperty('color', e.target.value)}
                />
                <div className="w-7 h-7 rounded-lg shadow-inner pointer-events-none" style={{ backgroundColor: element.properties?.color || '#000000' }}></div>
                <span className="text-xs font-mono font-black text-slate-700 pointer-events-none uppercase">{element.properties?.color || '#000000'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Alignment</label>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-border-light shadow-sm">
              <button 
                onClick={() => handleUpdateProperty('align', 'left')}
                className={`flex-1 h-11 flex items-center justify-center rounded-xl transition-all ${element.properties?.align === 'left' ? 'bg-white shadow-md text-primary ring-1 ring-black/5' : 'text-text-secondary'}`}
              >
                <span className="material-symbols-outlined text-[22px]">format_align_left</span>
              </button>
              <button 
                onClick={() => handleUpdateProperty('align', 'center')}
                className={`flex-1 h-11 flex items-center justify-center rounded-xl transition-all ${(element.properties?.align === 'center' || !element.properties?.align) ? 'bg-white shadow-md text-primary ring-1 ring-black/5' : 'text-text-secondary'}`}
              >
                <span className="material-symbols-outlined text-[22px]">align_horizontal_center</span>
              </button>
              <button 
                onClick={() => handleUpdateProperty('align', 'right')}
                className={`flex-1 h-11 flex items-center justify-center rounded-xl transition-all ${element.properties?.align === 'right' ? 'bg-white shadow-md text-primary ring-1 ring-black/5' : 'text-text-secondary'}`}
              >
                <span className="material-symbols-outlined text-[22px]">format_align_right</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Position controls for all element types */}
      <div className="grid grid-cols-2 gap-5 pt-2">
        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Width</label>
           <div className="flex items-center bg-gray-50 border border-border-light rounded-2xl p-1.5 shadow-sm">
                <input 
                  type="number"
                  className="w-full bg-transparent border-none text-center font-bold text-sm focus:ring-0"
                  value={Math.round(element.width || 0)}
                  onChange={(e) => updateElement(element.id, { width: parseInt(e.target.value) || 0 })}
                />
           </div>
        </div>
        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.1em]">Height</label>
           <div className="flex items-center bg-gray-50 border border-border-light rounded-2xl p-1.5 shadow-sm">
                <input 
                  type="number"
                  className="w-full bg-transparent border-none text-center font-bold text-sm focus:ring-0"
                  value={Math.round(element.height || 0)}
                  onChange={(e) => updateElement(element.id, { height: parseInt(e.target.value) || 0 })}
                />
           </div>
        </div>
      </div>
    </div>
  )
}
