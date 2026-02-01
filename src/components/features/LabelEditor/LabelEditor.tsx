'use client'

import React, { useEffect } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { Canvas } from './Canvas'
import { ToolPanel } from './ToolPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { LayersPanel } from './LayersPanel'
import { BackgroundPanel } from './BackgroundPanel'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2, ZoomIn, ZoomOut, Save, Settings } from 'lucide-react'
import { saveDesign, saveDraft, updateDesign } from '@/server/actions/designs'
import { SaveDesignModal } from './SaveDesignModal'
import { DownloadButton } from './DownloadButton'

export interface LabelEditorProps {
  className?: string
}

/**
 * LabelEditor main component - brings together canvas, tools, and properties
 */
export const LabelEditor: React.FC<LabelEditorProps> = ({ className }) => {
  const {
    canvas,
    is_saved,
    selectedLabel,
    elements,
    currentDesignId,
    selectedElementId,
    setCanvasZoom,
    setCanvasDPI,
    undo,
    redo,
    history,
    saveDraft: updateDraftState,
  } = useEditorStore()

  const [saveModalOpen, setSaveModalOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = React.useState(false)
  const [showBackgroundPanel, setShowBackgroundPanel] = React.useState(false)

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!selectedLabel || elements.length === 0 || is_saved) return

      try {
        const result = await saveDraft(currentDesignId, {
          name: currentDesignId ? '' : `Draft ${new Date().toLocaleString()}`,
          labelBaseId: selectedLabel.id || 'custom',
          width: canvas.width_px,
          height: canvas.height_px,
          elements: elements as any,
          isTemplate: false,
        })

        if (result.success && result.data) {
          updateDraftState()
          if (result.data.id && !currentDesignId) {
            useEditorStore.setState({ currentDesignId: result.data.id })
          }
        }
      } catch (error) {
        console.error('Auto-save draft error:', error)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedLabel, elements, currentDesignId, is_saved])

  // Keyboard shortcuts
  useEffect(() => {
    const canUndo = history.undo_stack.length > 0
    const canRedo = history.redo_stack.length > 0
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        if (canRedo) redo()
      }
      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected element handled in canvas
      }
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        // TODO: Trigger save modal
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history, undo, redo])

  const handleZoomIn = () => {
    setCanvasZoom(Math.min(400, canvas.zoom_level + 25))
  }

  const handleZoomOut = () => {
    setCanvasZoom(Math.max(25, canvas.zoom_level - 25))
  }

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCanvasZoom(parseInt(e.target.value))
  }

  const handleDpiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCanvasDPI(parseInt(e.target.value) as 203 | 300)
  }

  const canUndo = history.undo_stack.length > 0
  const canRedo = history.redo_stack.length > 0

  return (
    <div className={`flex flex-col h-screen max-h-screen bg-[var(--color-bg-secondary)] ${className}`}>
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 bg-white border-b border-[var(--color-border-primary)] gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto overflow-x-auto">
          {/* DPI Selector */}
          <div className="flex items-center gap-1 sm:gap-2">
            <label className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] hidden sm:inline">DPI:</label>
            <select
              value={canvas.dpi}
              onChange={handleDpiChange}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              <option value={203}>203</option>
              <option value={300}>300</option>
            </select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={canvas.zoom_level <= 25} className="h-8 w-8 p-0">
              <ZoomOut size={16} />
            </Button>
            <select
              value={canvas.zoom_level}
              onChange={handleZoomChange}
              className="px-1 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] w-16 sm:w-auto"
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={150}>150%</option>
              <option value={200}>200%</option>
              <option value={300}>300%</option>
              <option value={400}>400%</option>
            </select>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={canvas.zoom_level >= 400} className="h-8 w-8 p-0">
              <ZoomIn size={16} />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 sm:gap-2 border-l border-[var(--color-border-primary)] pl-2 sm:pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="h-8 w-8 p-0"
            >
              <Undo2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className="h-8 w-8 p-0"
            >
              <Redo2 size={16} />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DownloadButton designId={currentDesignId} />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSaveModalOpen(true)}
            disabled={!selectedLabel}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Save size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">{is_saved && currentDesignId ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-gray-50/50">
        
        {/* Left Toolbar */}
        <ToolPanel onToggleBackground={() => setShowBackgroundPanel(!showBackgroundPanel)} />

        {/* Layers Panel (Optional - can be toggled) */}
        <LayersPanel className="w-64 hidden xl:block" />

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto min-h-0">
          <Canvas className="h-full w-full" />
        </div>

        {/* Background Panel - Toggleable */}
        {showBackgroundPanel && <BackgroundPanel />}

        {/* Properties Panel - Desktop */}
        <PropertiesPanel className="w-80 hidden lg:block" />
        
        {/* Properties Panel - Mobile (Bottom Sheet) */}
        {selectedElementId && (
          <div 
            className={`lg:hidden fixed inset-x-0 bottom-0 bg-white border-t-2 border-[var(--color-border-primary)] shadow-2xl transition-transform duration-300 z-50 max-h-[70vh] overflow-y-auto ${
              mobilePropertiesOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="sticky top-0 bg-white border-b border-[var(--color-border-primary)] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Element Properties</h3>
              <button 
                onClick={() => setMobilePropertiesOpen(false)}
                className="text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                ×
              </button>
            </div>
            <PropertiesPanel className="" />
          </div>
        )}
        
        {/* Mobile Properties Toggle Button */}
        {selectedElementId && (
          <button
            onClick={() => setMobilePropertiesOpen(!mobilePropertiesOpen)}
            className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-[var(--color-primary-500)] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-[var(--color-primary-600)] transition-colors"
          >
            <Settings size={24} />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-4 py-2 bg-white border-t border-[var(--color-border-primary)] text-xs text-[var(--color-text-secondary)] gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-medium text-[10px] sm:text-xs">W:</span>
            <input 
              type="number" 
              value={canvas.width_px} 
              onChange={(e) => useEditorStore.getState().setCanvasSize(Number(e.target.value), canvas.height_px)}
              className="w-12 sm:w-16 px-1 py-0.5 border rounded text-xs"
            />
            <span className="text-[10px] sm:text-xs">px</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-medium text-[10px] sm:text-xs">H:</span>
             <input 
              type="number" 
              value={canvas.height_px} 
              onChange={(e) => useEditorStore.getState().setCanvasSize(canvas.width_px, Number(e.target.value))}
              className="w-12 sm:w-16 px-1 py-0.5 border rounded text-xs"
            />
            <span className="text-[10px] sm:text-xs">px</span>
          </div>
          <div className="text-[10px] sm:text-xs hidden sm:block">@ {canvas.dpi} DPI</div>
        </div>
        <div className="text-[10px] sm:text-xs">Zoom: {canvas.zoom_level}%</div>
      </div>

      {/* Save Modal */}
      <SaveDesignModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={async (name, description, isTemplate) => {
          if (!selectedLabel) return

          setSaving(true)
          try {
            const result = currentDesignId
              ? await updateDesign(currentDesignId, {
                  name,
                  description,
                  elements: elements as any,
                  isTemplate,
                })
              : await saveDesign({
                  name,
                  description,
                  labelBaseId: selectedLabel.id || 'custom', // Fallback
                  width: canvas.width_px,
                  height: canvas.height_px,
                  elements: elements as any,
                  isTemplate,
                })

            if (result.success && result.data) {
              useEditorStore.setState({
                currentDesignId: result.data.id,
                is_saved: true,
                last_saved_at: Date.now(),
              })
            } else {
              throw new Error(result.error || 'Failed to save design')
            }
          } finally {
            setSaving(false)
          }
        }}
        isUpdate={!!currentDesignId}
        loading={saving}
      />
    </div>
  )
}

export default LabelEditor

