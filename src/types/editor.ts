/**
 * Editor types and interfaces
 * Defines all element types and editor state structures
 */

export type ElementType = 'text' | 'image' | 'barcode' | 'shape'

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  z_index: number
  visible: boolean
  style?: Record<string, any>
}

export interface TextProperties {
  text: string
  font: string
  fontSize: number
  fontWeight: number
  color: string
  align: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number
  [key: string]: any
}

export interface TextElement extends BaseElement {
  type: 'text'
  properties: TextProperties
}

export interface ImageProperties {
  image_url: string
  alt_text?: string
  opacity: number
  aspectRatioLocked: boolean
  [key: string]: any
}

export interface ImageElement extends BaseElement {
  type: 'image'
  properties: ImageProperties
}

export interface BarcodeProperties {
  barcode_type: string
  barcode_value: string
  human_readable: boolean
  human_readable_font_size: number
  [key: string]: any
}

export interface BarcodeElement extends BaseElement {
  type: 'barcode'
  properties: BarcodeProperties
}

export interface ShapeProperties {
  shape_type: 'rectangle' | 'circle' | 'line'
  fill_color: string
  fill_opacity: number
  border_color: string
  border_width: number
  [key: string]: any
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  properties: ShapeProperties
}

export interface DecorativeShape {
  id: string
  type: 'circle' | 'wave' | 'triangle' | 'rectangle' | 'blob'
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
  rotation: number
}

export interface BackgroundConfig {
  type: 'none' | 'solid' | 'gradient' | 'pattern'
  color?: string
  gradient?: {
    type: 'linear' | 'radial'
    colors: Array<{ color: string; position: number }>
    angle?: number
  }
  pattern?: {
    type: 'dots' | 'stripes' | 'grid' | 'diagonal'
    color: string
    opacity: number
    scale: number
  }
  decorativeShapes?: DecorativeShape[]
}

export type EditorElement = TextElement | ImageElement | BarcodeElement | ShapeElement

export interface EditorState {
  selectedLabel: {
    id: string
    name: string
    width_mm: number
    height_mm: number
    width_px_203dpi?: number
    height_px_203dpi?: number
    width_px_300dpi?: number
    height_px_300dpi?: number
  } | null
  elements: EditorElement[]
  selectedElementId: string | null
  canvas: {
    width_px: number
    height_px: number
    dpi: 203 | 300
    zoom_level: number
    background: BackgroundConfig
  }
  history: {
    undo_stack: EditorState[]
    redo_stack: EditorState[]
  }
  is_saved: boolean
  draft_auto_saved_at: number | null
  currentDesignId: string | null
  last_saved_at: number | null
  last_draft_at: number | null
}

export interface EditorActions {
  setSelectedLabel: (label: EditorState['selectedLabel']) => void
  addElement: (element: EditorElement) => void
  updateElement: (id: string, changes: Partial<EditorElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  deselectElement: () => void
  setCanvasZoom: (level: number) => void
  setCanvasDPI: (dpi: 203 | 300) => void
  undo: () => void
  redo: () => void
  saveDesign: (name: string, description?: string) => Promise<void>
  saveDraft: () => Promise<void>
  loadDesign: (id: string) => Promise<void>
  resetEditor: () => void
}
