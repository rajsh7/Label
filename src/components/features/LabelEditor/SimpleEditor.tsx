'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Layers, Type, Maximize2, Save } from 'lucide-react'

interface Element {
  id: string
  type: 'text' | 'image' | 'barcode'
  x: number
  y: number
  width: number
  height: number
  content: string
  fontSize?: number
  color?: string
}

export function SimpleEditor() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [labelName, setLabelName] = useState('New Label')

  const addText = () => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      content: 'Text',
      fontSize: 16,
      color: '#000000'
    }
    setElements([...elements, newElement])
    setSelectedId(newElement.id)
  }

  const addBarcode = () => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'barcode',
      x: 50,
      y: 150,
      width: 200,
      height: 80,
      content: '123456789'
    }
    setElements([...elements, newElement])
    setSelectedId(newElement.id)
  }

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }

  const deleteElement = () => {
    if (selectedId) {
      setElements(elements.filter(el => el.id !== selectedId))
      setSelectedId(null)
    }
  }

  const selected = elements.find(el => el.id === selectedId)

  const saveLabel = async () => {
    const design = {
      name: labelName,
      label_base_id: 'amazon_fba_001',
      elements: elements
    }
    
    try {
      const res = await fetch('/api/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      })
      
      if (res.ok) {
        alert('Label saved successfully!')
      }
    } catch (error) {
      alert('Failed to save label')
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-card p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Elements
          </h3>
          <div className="space-y-2">
            <Button onClick={addText} variant="outline" className="w-full justify-start" size="sm">
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
            <Button onClick={addBarcode} variant="outline" className="w-full justify-start" size="sm">
              <Maximize2 className="w-4 h-4 mr-2" />
              Add Barcode
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Layers</h3>
          <div className="space-y-1">
            {elements.map(el => (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`p-2 rounded cursor-pointer text-sm ${
                  selectedId === el.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {el.type === 'text' ? '📝' : '📊'} {el.content.substring(0, 20)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between bg-card">
          <Input
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={saveLabel}>
            <Save className="w-4 h-4 mr-2" />
            Save Label
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
          <div className="relative bg-white shadow-2xl" style={{ width: 400, height: 600 }}>
            {elements.map(el => (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`absolute cursor-move ${
                  selectedId === el.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height
                }}
              >
                {el.type === 'text' && (
                  <div
                    style={{
                      fontSize: el.fontSize,
                      color: el.color,
                      padding: '4px'
                    }}
                  >
                    {el.content}
                  </div>
                )}
                {el.type === 'barcode' && (
                  <div className="border-2 border-dashed border-gray-400 h-full flex items-center justify-center text-xs">
                    Barcode: {el.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {selected && (
        <div className="w-80 border-l bg-card p-4 space-y-4">
          <h3 className="font-semibold">Properties</h3>
          
          <div className="space-y-3">
            <div>
              <Label>Content</Label>
              <Input
                value={selected.content}
                onChange={(e) => updateElement(selected.id, { content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>X</Label>
                <Input
                  type="number"
                  value={selected.x}
                  onChange={(e) => updateElement(selected.id, { x: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Y</Label>
                <Input
                  type="number"
                  value={selected.y}
                  onChange={(e) => updateElement(selected.id, { y: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Width</Label>
                <Input
                  type="number"
                  value={selected.width}
                  onChange={(e) => updateElement(selected.id, { width: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Height</Label>
                <Input
                  type="number"
                  value={selected.height}
                  onChange={(e) => updateElement(selected.id, { height: Number(e.target.value) })}
                />
              </div>
            </div>

            {selected.type === 'text' && (
              <>
                <div>
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    value={selected.fontSize}
                    onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selected.color}
                    onChange={(e) => updateElement(selected.id, { color: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button onClick={deleteElement} variant="destructive" className="w-full">
              Delete Element
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
