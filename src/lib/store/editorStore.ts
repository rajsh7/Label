'use client'

import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { EditorState, EditorActions, EditorElement } from '@/types/editor'

const MAX_HISTORY_DEPTH = 20

interface EditorStore extends EditorState, EditorActions {
  copiedElement: EditorElement | null
  copyElement: (id: string) => void
  pasteElement: () => void
  duplicateElement: (id: string) => void
}

const initialState: EditorState = {
  selectedLabel: null,
  elements: [],
  selectedElementId: null,
  canvas: {
    width_px: 812,
    height_px: 1218,
    dpi: 203,
    zoom_level: 100,
  },
  history: {
    undo_stack: [],
    redo_stack: [],
  },
  is_saved: false,
  draft_auto_saved_at: null,
  currentDesignId: null,
  last_saved_at: null,
  last_draft_at: null,
}

/**
 * Zustand store for label editor state management
 * Handles elements, canvas, undo/redo, and save/load
 */
export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  copiedElement: null,

  copyElement: (id: string) => {
    const state = get()
    const element = state.elements.find((el) => el.id === id)
    if (element) {
      set({ copiedElement: element })
    }
  },

  pasteElement: () => {
    const state = get()
    if (!state.copiedElement) return

    const newElement = {
      ...state.copiedElement,
      id: uuidv4(),
      x: state.copiedElement.x + 10,
      y: state.copiedElement.y + 10,
      z_index: Math.max(...state.elements.map((e) => e.z_index), 0) + 1,
    }

    set((prevState) => ({
      elements: [...prevState.elements, newElement].sort((a, b) => a.z_index - b.z_index),
      selectedElementId: newElement.id,
      is_saved: false,
      history: {
        undo_stack: [
          ...prevState.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1),
          prevState,
        ],
        redo_stack: [],
      },
    }))
  },

  duplicateElement: (id: string) => {
    const state = get()
    const element = state.elements.find((el) => el.id === id)
    if (!element) return

    const newElement = {
      ...element,
      id: uuidv4(),
      x: element.x + 10,
      y: element.y + 10,
      z_index: Math.max(...state.elements.map((e) => e.z_index), 0) + 1,
    }

    set((prevState) => ({
      elements: [...prevState.elements, newElement].sort((a, b) => a.z_index - b.z_index),
      selectedElementId: newElement.id,
      is_saved: false,
      history: {
        undo_stack: [
          ...prevState.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1),
          prevState,
        ],
        redo_stack: [],
      },
    }))
  },

  setSelectedLabel: (label) => {
    set((state) => {
      // Calculate canvas dimensions based on selected label and DPI
      const dpi = state.canvas.dpi
      const width_px = dpi === 203 ? label?.width_px_203dpi : label?.width_px_300dpi
      const height_px = dpi === 203 ? label?.height_px_203dpi : label?.height_px_300dpi

      return {
        selectedLabel: label,
        canvas: {
          ...state.canvas,
          width_px: width_px || state.canvas.width_px,
          height_px: height_px || state.canvas.height_px,
        },
        is_saved: false,
      }
    })
  },

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element].sort((a, b) => a.z_index - b.z_index)
      return {
        elements: newElements,
        is_saved: false,
        history: {
          undo_stack: [...state.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1), state],
          redo_stack: [],
        },
      }
    })
  },

  updateElement: (id, changes) => {
    set((state) => {
      const newElements = state.elements.map((element) =>
        element.id === id ? { ...element, ...changes } : element
      ) as EditorElement[]
      return {
        elements: newElements,
        is_saved: false,
        history: {
          undo_stack: [...state.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1), state],
          redo_stack: [],
        },
      }
    })
  },

  deleteElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((element) => element.id !== id)
      const newSelectedId = state.selectedElementId === id ? null : state.selectedElementId
      return {
        elements: newElements,
        selectedElementId: newSelectedId,
        is_saved: false,
        history: {
          undo_stack: [...state.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1), state],
          redo_stack: [],
        },
      }
    })
  },

  selectElement: (id) => {
    set({ selectedElementId: id })
  },

  deselectElement: () => {
    set({ selectedElementId: null })
  },

  setCanvasZoom: (level) => {
    const clampedLevel = Math.max(25, Math.min(400, level))
    set((state) => ({
      canvas: {
        ...state.canvas,
        zoom_level: clampedLevel,
      },
    }))
  },

  setCanvasDPI: (dpi) => {
    set((state) => {
      if (!state.selectedLabel) return state

      const width_px = dpi === 203 ? state.selectedLabel.width_px_203dpi : state.selectedLabel.width_px_300dpi
      const height_px = dpi === 203 ? state.selectedLabel.height_px_203dpi : state.selectedLabel.height_px_300dpi

      return {
        canvas: {
          ...state.canvas,
          dpi,
          width_px: width_px || state.canvas.width_px,
          height_px: height_px || state.canvas.height_px,
        },
        is_saved: false,
      }
    })
  },

  undo: () => {
    set((state) => {
      if (state.history.undo_stack.length === 0) return state

      const previousState = state.history.undo_stack[state.history.undo_stack.length - 1]
      const newUndoStack = state.history.undo_stack.slice(0, -1)

      return {
        ...previousState,
        history: {
          undo_stack: newUndoStack,
          redo_stack: [state, ...state.history.redo_stack.slice(0, MAX_HISTORY_DEPTH - 1)],
        },
      }
    })
  },

  redo: () => {
    set((state) => {
      if (state.history.redo_stack.length === 0) return state

      const nextState = state.history.redo_stack[0]
      const newRedoStack = state.history.redo_stack.slice(1)

      return {
        ...nextState,
        history: {
          undo_stack: [...state.history.undo_stack.slice(-MAX_HISTORY_DEPTH + 1), state],
          redo_stack: newRedoStack,
        },
      }
    })
  },

  saveDesign: async (_name: string, _description?: string, _labelBaseId?: string, _elements?: EditorElement[]) => {
    // This will be called from component with server action
    // Store method is kept for state updates
    set({
      is_saved: true,
      last_saved_at: Date.now(),
    })
  },

  saveDraft: async () => {
    // This will be called from component with server action
    // Store method is kept for state updates
    set({
      last_draft_at: Date.now(),
      draft_auto_saved_at: Date.now(),
    })
  },

  loadDesign: async (id: string) => {
    // This will be called from component with server action
    // Store method is kept for state updates
    set({
      currentDesignId: id,
      is_saved: true,
    })
  },

  resetEditor: () => {
    set(initialState)
  },
}))

