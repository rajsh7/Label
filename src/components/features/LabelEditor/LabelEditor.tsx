'use client'

import React, { useEffect } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { Canvas } from './Canvas'
import { ToolPanel } from './ToolPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { LayersPanel } from './LayersPanel'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2, ZoomIn, ZoomOut, Save } from 'lucide-react'
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
    setCanvasZoom,
    setCanvasDPI,
    undo,
    redo,
    history,
    saveDraft: updateDraftState,
  } = useEditorStore()

  const [saveModalOpen, setSaveModalOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!selectedLabel || elements.length === 0) return

      try {
        const result = await saveDraft(currentDesignId, {
          name: `Draft ${new Date().toLocaleString()}`,
          labelBaseId: selectedLabel.id,
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
  }, [selectedLabel, elements, currentDesignId])

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
    <div className={`flex flex-col h-screen bg-[var(--color-bg-secondary)] ${className}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-[var(--color-border-primary)]">
        <div className="flex items-center gap-4">
          {/* DPI Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">DPI:</label>
            <select
              value={canvas.dpi}
              onChange={handleDpiChange}
              className="px-3 py-1.5 text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              <option value={203}>203 DPI (Thermal)</option>
              <option value={300}>300 DPI (Professional)</option>
            </select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={canvas.zoom_level <= 25}>
              <ZoomOut size={18} />
            </Button>
            <select
              value={canvas.zoom_level}
              onChange={handleZoomChange}
              className="px-3 py-1.5 text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
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
            <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={canvas.zoom_level >= 400}>
              <ZoomIn size={18} />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-2 border-l border-[var(--color-border-primary)] pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={18} />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <DownloadButton designId={currentDesignId} />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSaveModalOpen(true)}
            disabled={!selectedLabel}
          >
            <Save size={18} className="mr-2" />
            {is_saved && currentDesignId ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Tool Panel */}
      <ToolPanel />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layers Panel (Optional - can be toggled) */}
        <LayersPanel className="w-64 hidden xl:block" />

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel className="w-80 hidden lg:block" />
      </div>

      {/* Bottom Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-[var(--color-border-primary)] text-xs text-[var(--color-text-secondary)]">
        <div>
          Canvas: {canvas.width_px} × {canvas.height_px} px @ {canvas.dpi} DPI
        </div>
        <div>Zoom: {canvas.zoom_level}%</div>
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
                  labelBaseId: selectedLabel.id,
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

