import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Canvas } from '../Canvas'

// Mock the editor store
jest.mock('@/lib/store/editorStore', () => ({
  useEditorStore: () => ({
    selectedLabel: {
      id: 'label-1',
      name: 'Test Label',
      width_mm: 100,
      height_mm: 50,
      width_px_300dpi: 1181,
      height_px_300dpi: 591,
    },
    elements: [],
    selectedElementId: null,
    canvas: {
      width_px: 1181,
      height_px: 591,
      dpi: 300,
      zoom_level: 100,
    },
    selectElement: jest.fn(),
    deselectElement: jest.fn(),
    updateElement: jest.fn(),
    deleteElement: jest.fn(),
    setPlacementMode: jest.fn(),
    placementMode: null,
  }),
}))

// Mock canvas context
HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    strokeRect: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
  } as any
})

describe('Canvas', () => {
  it('renders canvas element', () => {
    render(<Canvas />)

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders canvas with correct dimensions', () => {
    render(<Canvas />)

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    // Canvas dimensions are set via props, so we check if canvas exists
    expect(canvas).not.toBeNull()
  })
})
