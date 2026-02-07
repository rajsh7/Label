'use client'


import { useEditorStore } from '@/lib/store/editorStore'
import { v4 as uuidv4 } from 'uuid'

export function SidebarLeft() {
  const { addElement } = useEditorStore()

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        text: 'New Text',
        font: 'Manrope',
        fontSize: 24,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.2
      },
      style: {}
    } as any)
  }

  const handleAddShape = () => {
    addElement({
      id: uuidv4(),
      type: 'shape',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#E2E8F0',
        fill_opacity: 1,
        border_color: '#000000',
        border_width: 1
      },
      style: {}
    } as any)
  }

  const handleAddBarcode = () => {
    addElement({
      id: uuidv4(),
      type: 'barcode',
      x: 100,
      y: 150,
      width: 300,
      height: 80,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '123456789012',
        human_readable: true,
        human_readable_font_size: 10
      },
      style: {}
    } as any)
  }

  const handleAddImage = () => {
    addElement({
      id: uuidv4(),
      type: 'image',
      x: 150,
      y: 150,
      width: 150,
      height: 150,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        image_url: '/amazon-logo.png',
        alt_text: 'Brand Logo',
        opacity: 1,
        aspectRatioLocked: true
      },
      style: {}
    } as any)
  }

  return (
    <aside className="hidden md:flex w-16 bg-sidebar-light border-r border-border-light flex-col items-center py-6 gap-6 z-40 shadow-sm h-full pt-24">
      <div className="mb-4 hidden" />
      <nav className="flex flex-col gap-4 w-full px-2">
        <ToolButton icon="text_fields" label="Add Text" onClick={handleAddText} active />
        <ToolButton icon="qr_code_2" label="Barcodes" onClick={handleAddBarcode} />
        <ToolButton icon="shapes" label="Shapes" onClick={handleAddShape} />
        <ToolButton icon="image" label="Images" onClick={handleAddImage} />
        <div className="h-px w-8 bg-border-light mx-auto my-1"></div>
        <ToolButton icon="layers" label="Smart Layers" />
      </nav>
      <div className="mt-auto flex flex-col gap-4 mb-2">
        <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-text-secondary hover:text-black flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 ring-2 ring-gray-200 cursor-pointer overflow-hidden">
           <span className="material-symbols-outlined text-gray-400 w-full h-full flex items-center justify-center">person</span>
        </div>
      </div>
    </aside>
  )
}

function ToolButton({ icon, label, onClick, active, separator }: any) {
  return (
    <>
      {separator && <div className="h-px w-8 bg-border-light mx-auto my-1"></div>}
      <button 
        onClick={onClick}
        className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all group relative ${active ? 'bg-primary text-white shadow-glow' : 'text-text-secondary hover:text-black hover:bg-gray-100'}`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {label}
        </span>
      </button>
    </>
  )
}
