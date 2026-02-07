'use client'

import html2canvas from 'html2canvas'
import { toast } from 'sonner'
import { useEditorStore } from '@/lib/store/editorStore'

export function TopBar() {
  const { undo, redo, history, canvas, setCanvasZoom, elements, selectedLabel } = useEditorStore()
  
  const canUndo = history.undo_stack.length > 0
  const canRedo = history.redo_stack.length > 0

  const handleZoomIn = () => setCanvasZoom(canvas.zoom_level + 10)
  const handleZoomOut = () => setCanvasZoom(canvas.zoom_level - 10)

  const handleSave = async () => {
    try {
      const loadingToast = toast.loading("Saving label...")
      
      // Prepare label data for API
      const labelData = {
        name: selectedLabel?.name || `Label ${new Date().toLocaleDateString()}`,
        label_base_id: selectedLabel?.id || 'custom',
        elements: elements,
        width_px: canvas.width_px,
        height_px: canvas.height_px,
        dpi: canvas.dpi,
        label_format: selectedLabel?.name || 'Custom Label'
      }

      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labelData)
      })

      const result = await response.json()
      
      toast.dismiss(loadingToast)
      
      if (response.ok && result.success) {
        toast.success("Label saved to My Labels!")
      } else {
        toast.error(result.error || "Failed to save label")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save label")
    }
  }

  const handleDownload = async () => {
    const element = document.getElementById('label-editor-canvas')
    if (!element) {
        toast.error("Could not find label canvas")
        return
    }

    try {
        const loadingToast = toast.loading("Generating high-quality PDF...")
        
        // Capture at very high scale for crisp output
        const capturedCanvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0,
            removeContainer: true,
            width: canvas.width_px,
            height: canvas.height_px,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById('label-editor-canvas')
                if (clonedElement) {
                    clonedElement.style.transform = 'none'
                    clonedElement.style.transformOrigin = 'top left'
                    clonedElement.style.borderRadius = '0'
                    clonedElement.style.boxShadow = 'none'
                    clonedElement.style.margin = '0'
                    clonedElement.style.position = 'absolute'
                    clonedElement.style.top = '0'
                    clonedElement.style.left = '0'
                }
            }
        })

        const imgData = capturedCanvas.toDataURL('image/png', 1.0)
        
        // Trigger PNG Download
        const link = document.createElement('a')
        link.href = imgData
        link.download = `${selectedLabel?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'label'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.dismiss(loadingToast)
        toast.success("High-quality PNG downloaded!")

    } catch (error) {
        console.error("PDF Generation Error:", error)
        toast.error("Failed to generate PDF")
    }
  }

  return (
    <div className="fixed top-28 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl border border-border-light rounded-full px-2 py-2 shadow-floating-bar flex items-center gap-6 pointer-events-auto animate-fade-in-down">
        <div className="flex items-center gap-2 pl-4 border-r border-border-light pr-6">
          <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Templates</span>
          <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
          <span className="text-text-main text-sm font-bold truncate max-w-[200px]">{selectedLabel?.name || 'Untitled Label'}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button 
              onClick={undo}
              disabled={!canUndo}
              className="p-2 text-text-secondary hover:text-black hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
              title="Undo"
            >
              <span className="material-symbols-outlined text-[20px]">undo</span>
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              className="p-2 text-text-secondary hover:text-black hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
              title="Redo"
            >
              <span className="material-symbols-outlined text-[20px]">redo</span>
            </button>
          </div>
          <div className="h-4 w-px bg-border-light"></div>
          <div className="flex items-center gap-2">
            <button onClick={handleZoomOut} className="p-1.5 text-text-secondary hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="text-sm font-mono text-text-secondary w-12 text-center">{Math.round(canvas.zoom_level)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 text-text-secondary hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-6 border-l border-border-light">
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-text-main text-sm font-bold transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save
          </button>
          <button 
            onClick={handleDownload}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
