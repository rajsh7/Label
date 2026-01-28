'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Label = {
  id: string
  name: string
  category: string
  marketplace?: string
  width_mm: number
  height_mm: number
  width_px_203dpi?: number
  height_px_203dpi?: number
  print_method: string
}

type Element = {
  id: number
  type: 'text' | 'barcode' | 'image'
  content: string
  x: number
  y: number
}

export default function EditorPage() {
  const [elements, setElements] = useState<Element[]>([])
  const [name, setName] = useState('Shipping Label 4x6')
  const [selected, setSelected] = useState<number | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)
  const [showLabelSelector, setShowLabelSelector] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLabels() {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name')
      
      if (data && !error) {
        setLabels(data)
        setSelectedLabel(data[0])
      }
      setLoading(false)
    }
    fetchLabels()
  }, [])

  const addElement = (type: 'text' | 'barcode' | 'image') => {
    const newEl: Element = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'New Text' : type === 'barcode' ? '123456789' : 'image.png',
      x: 50,
      y: 50 + elements.length * 40
    }
    setElements([...elements, newEl])
    setSelected(newEl.id)
  }

  const deleteElement = () => {
    if (selected) {
      setElements(elements.filter(el => el.id !== selected))
      setSelected(null)
    }
  }

  const selectedEl = elements.find(el => el.id === selected)

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading labels...</div>
      </div>
    )
  }

  if (showLabelSelector) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Label</h1>
        <div className="max-w-md">
          <label className="block text-sm font-medium mb-2">Select Label Type ({labels.length} available)</label>
          <Select value={selectedLabel?.id} onValueChange={(value) => {
            const label = labels.find(l => l.id === value)
            if (label) setSelectedLabel(label)
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {labels.map(label => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name} ({label.width_mm}x{label.height_mm}mm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLabel && (
            <div className="mt-4 p-4 bg-muted rounded">
              <h3 className="font-medium">{selectedLabel.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedLabel.width_mm}x{selectedLabel.height_mm}mm • {selectedLabel.marketplace} • {selectedLabel.print_method}
              </p>
            </div>
          )}
          <Button onClick={() => setShowLabelSelector(false)} className="mt-4" disabled={!selectedLabel}>
            Start Designing
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-4">
        <Button variant="outline" onClick={() => setShowLabelSelector(true)}>
          ← Change Label
        </Button>
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="max-w-xs"
          placeholder="Label name"
        />
        <div className="text-sm text-muted-foreground">
          {selectedLabel?.name} ({selectedLabel?.width_mm}x{selectedLabel?.height_mm}mm)
        </div>
        <Button className="ml-auto">Save Label</Button>
      </div>

      <div className="flex flex-1">
        {/* Left Panel - Tools */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          <h2 className="font-bold mb-4">Elements</h2>
          <div className="space-y-2">
            <Button onClick={() => addElement('text')} className="w-full justify-start" variant="outline">
              📝 Text
            </Button>
            <Button onClick={() => addElement('barcode')} className="w-full justify-start" variant="outline">
              🔲 Barcode
            </Button>
            <Button onClick={() => addElement('image')} className="w-full justify-start" variant="outline">
              🖼️ Image
            </Button>
          </div>

          <h3 className="font-bold mt-6 mb-2">Layers</h3>
          <div className="space-y-1">
            {elements.map(el => (
              <div 
                key={el.id}
                onClick={() => setSelected(el.id)}
                className={`p-2 rounded cursor-pointer text-sm ${
                  selected === el.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {el.type === 'text' ? '📝' : el.type === 'barcode' ? '🔲' : '🖼️'} {el.content.substring(0, 20)}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          <div 
            className="bg-white relative border-2 shadow-xl"
            style={{
              width: `${selectedLabel?.width_px_203dpi || 400}px`,
              height: `${selectedLabel?.height_px_203dpi || 600}px`,
              maxWidth: '600px',
              maxHeight: '800px',
              transform: 'scale(0.8)'
            }}
          >
            {elements.map(el => (
              <div 
                key={el.id}
                onClick={() => setSelected(el.id)}
                style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  border: selected === el.id ? '2px solid blue' : '1px solid transparent',
                  padding: '4px',
                  cursor: 'pointer'
                }}
              >
                {el.type === 'barcode' ? (
                  <div className="bg-black text-white px-2 py-1 font-mono text-xs">
                    |||||| {el.content}
                  </div>
                ) : (
                  <span className="text-sm">{el.content}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 border-l p-4 overflow-y-auto">
          <h2 className="font-bold mb-4">Properties</h2>
          {selectedEl ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Content</label>
                <Input 
                  value={selectedEl.content}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, content: e.target.value} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">X Position</label>
                <Input 
                  type="number"
                  value={selectedEl.x}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, x: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Y Position</label>
                <Input 
                  type="number"
                  value={selectedEl.y}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, y: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <Button onClick={deleteElement} variant="destructive" className="w-full">
                Delete Element
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select an element to edit properties</p>
          )}
        </div>
      </div>
    </div>
  )
}
