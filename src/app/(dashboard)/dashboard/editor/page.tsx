'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ALL_LABELS } from '@/lib/constants/labels'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Element = {
  id: number
  type: 'text' | 'barcode' | 'image' | 'shape' | 'line' | 'qrcode'
  content: string
  x: number
  y: number
  isDragging?: boolean
  fontSize?: number
  fontFamily?: string
  color?: string
  strokeWidth?: number
  strokeColor?: string
  width?: number
  height?: number
  rotation?: number
  opacity?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export default function EditorPage() {
  const [showLabelSelect, setShowLabelSelect] = useState(true)
  const [selectedLabel, setSelectedLabel] = useState<any>(null)
  const [elements, setElements] = useState<Element[]>([])
  const [name, setName] = useState('New Label')
  const [selected, setSelected] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const saveLabel = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please login to save labels')
        setSaving(false)
        return
      }

      const { error } = await supabase.from('label_designs').insert({
        user_id: user.id,
        name: name,
        elements: JSON.stringify(elements)
      })

      if (error) {
        console.error('Supabase error:', error)
        if (error.message.includes('permission denied')) {
          alert('Database permissions not configured. Please enable RLS policies in Supabase for label_designs table.')
        } else {
          alert(`Failed to save: ${error.message}`)
        }
        setSaving(false)
        return
      }

      alert('Label saved successfully!')
      router.push('/dashboard/labels')
    } catch (error: any) {
      console.error('Error saving label:', error)
      alert(`Failed to save label: ${error?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      amazon_fba: '📦',
      walmart_fwa: '🏪',
      ebay: '🛒',
      shopify: '🛍️',
      etsy: '🎨',
      usps: '📮',
      fedex: '📦',
      ups: '📦',
      dhl: '✈️',
      generic: '🏷️'
    }
    return icons[category] || '🏷️'
  }

  const selectLabel = (label: any) => {
    setSelectedLabel(label)
    setName(label.name)
    setShowLabelSelect(false)
  }

  const addElement = (type: 'text' | 'barcode' | 'image' | 'shape' | 'line' | 'qrcode') => {
    if (type === 'image') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const newEl: Element = {
              id: Date.now(),
              type: 'image',
              content: event.target?.result as string,
              x: 50,
              y: 50 + elements.length * 40,
              fontSize: 16,
              fontFamily: 'Arial',
              color: '#000000',
              strokeWidth: 0,
              strokeColor: '#000000',
              width: 100,
              height: 100,
              rotation: 0,
              opacity: 1,
              bold: false,
              italic: false,
              underline: false
            }
            setElements([...elements, newEl])
            setSelected(newEl.id)
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
      return
    }

    const newEl: Element = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'New Text' : type === 'barcode' ? '123456789' : type === 'qrcode' ? 'QR Code' : type === 'shape' ? 'rectangle' : type === 'line' ? 'line' : 'image.png',
      x: 50,
      y: 50 + elements.length * 40,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      strokeWidth: 0,
      strokeColor: '#000000',
      width: type === 'shape' ? 100 : type === 'line' ? 150 : 80,
      height: type === 'shape' ? 100 : type === 'line' ? 2 : 80,
      rotation: 0,
      opacity: 1,
      bold: false,
      italic: false,
      underline: false
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

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const el = elements.find(el => el.id === id)
    if (!el) return
    setSelected(id)
    setDragOffset({ x: e.clientX - el.x, y: e.clientY - el.y })
    setElements(elements.map(el => el.id === id ? {...el, isDragging: true} : el))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const dragging = elements.find(el => el.isDragging)
    if (!dragging) return
    setElements(elements.map(el => 
      el.id === dragging.id 
        ? {...el, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y} 
        : el
    ))
  }

  const handleMouseUp = () => {
    setElements(elements.map(el => ({...el, isDragging: false})))
  }

  const selectedEl = elements.find(el => el.id === selected)

  if (showLabelSelect) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Select Label Type</h1>
            <p className="text-sm text-muted-foreground">Choose from 255+ label formats</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_LABELS.slice(0, 50).map(label => (
            <div 
              key={label.id}
              onClick={() => selectLabel(label)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-accent hover:border-primary transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(label.category)}</span>
                <h3 className="font-semibold text-sm flex-1">{label.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{label.width_inch}" x {label.height_inch}"</p>
              <p className="text-xs text-muted-foreground capitalize">{label.category.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Mobile: 2 cards per row layout */}
      <div className="lg:hidden flex-1">
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Tools Card */}
          <div className="border rounded-lg p-4">
            <h2 className="font-bold mb-4 text-sm">Elements</h2>
            <div className="space-y-2">
              <Button onClick={() => addElement('text')} className="w-full justify-start text-xs" variant="outline" size="sm">
                📝 Text
              </Button>
              <Button onClick={() => addElement('barcode')} className="w-full justify-start text-xs" variant="outline" size="sm">
                🔲 Barcode
              </Button>
              <Button onClick={() => addElement('image')} className="w-full justify-start text-xs" variant="outline" size="sm">
                🖼️ Image
              </Button>
            </div>
          </div>

          {/* Properties Card */}
          <div className="border rounded-lg p-4">
            <h2 className="font-bold mb-4 text-sm">Properties</h2>
            {selectedEl ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium">Content</label>
                  <Input 
                    value={selectedEl.content}
                    onChange={e => {
                      setElements(elements.map(el => 
                        el.id === selected ? {...el, content: e.target.value} : el
                      ))
                    }}
                    className="text-xs"
                  />
                </div>
                <Button onClick={deleteElement} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs" size="sm">
                  Delete
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Select element</p>
            )}
          </div>
        </div>

        {/* Mobile Canvas */}
        <div className="p-4">
          <div className="border-b pb-4 mb-4">
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button onClick={saveLabel} disabled={saving} size="sm">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setShowLabelSelect(true)} size="sm">Change</Button>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-center bg-gray-100 p-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div 
              className="bg-white relative border-2 shadow-xl"
              style={{
                width: selectedLabel?.width_px_203dpi ? `${Math.min(selectedLabel.width_px_203dpi / 3, 300)}px` : '300px',
                height: selectedLabel?.height_px_203dpi ? `${Math.min(selectedLabel.height_px_203dpi / 3, 400)}px` : '400px'
              }}
            >
              {elements.map(el => (
                <div 
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    border: selected === el.id ? '2px solid blue' : '1px solid transparent',
                    padding: '4px',
                    cursor: 'move',
                    userSelect: 'none',
                    fontSize: (el.fontSize || 16) * 0.8,
                    fontFamily: el.fontFamily || 'Arial',
                    color: el.color || '#000000'
                  }}
                >
                  {el.type === 'barcode' ? (
                    <div className="bg-black text-white px-2 py-1 font-mono text-xs">
                      |||||| {el.content}
                    </div>
                  ) : el.type === 'image' ? (
                    <img src={el.content} alt="" style={{width: '60px', height: '60px', objectFit: 'contain'}} />
                  ) : (
                    <span className="text-sm">{el.content}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Original 3-column layout */}
      <div className="hidden lg:flex lg:flex-1">
        <div className="w-64 border-r p-4 overflow-y-auto flex-shrink-0">
          <h2 className="font-bold mb-4">Elements</h2>
          <div className="space-y-2">
            <Button onClick={() => addElement('text')} className="w-full justify-start" variant="outline">
              📝 Text
            </Button>
            <Button onClick={() => addElement('barcode')} className="w-full justify-start" variant="outline">
              🔲 Barcode
            </Button>
            <Button onClick={() => addElement('qrcode')} className="w-full justify-start" variant="outline">
              📱 QR Code
            </Button>
            <Button onClick={() => addElement('image')} className="w-full justify-start" variant="outline">
              🖼️ Image
            </Button>
            <Button onClick={() => addElement('shape')} className="w-full justify-start" variant="outline">
              ⬜ Shape
            </Button>
            <Button onClick={() => addElement('line')} className="w-full justify-start" variant="outline">
              ➖ Line
            </Button>
          </div>

          <h3 className="font-bold mt-6 mb-2">Layers</h3>
          <div className="space-y-1">
            {elements.map(el => (
              <div 
                key={el.id}
                onClick={() => setSelected(el.id)}
                className={`p-2 rounded cursor-pointer ${selected === el.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                {el.type === 'text' ? '📝' : el.type === 'barcode' ? '🔲' : '🖼️'} {el.content}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b p-4 flex items-center gap-4">
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={saveLabel} disabled={saving}>
              {saving ? 'Saving...' : 'Save Label'}
            </Button>
            <Button variant="outline" onClick={() => setShowLabelSelect(true)}>Change Label</Button>
          </div>
          
          <div 
            className="flex-1 flex items-center justify-center bg-gray-100 p-8"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div 
              className="bg-white relative border-2 shadow-xl"
              style={{
                width: selectedLabel?.width_px_203dpi ? `${selectedLabel.width_px_203dpi / 2}px` : '400px',
                height: selectedLabel?.height_px_203dpi ? `${selectedLabel.height_px_203dpi / 2}px` : '600px'
              }}
            >
              {elements.map(el => (
                <div 
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    border: selected === el.id ? '2px solid blue' : '1px solid transparent',
                    padding: '4px',
                    cursor: 'move',
                    userSelect: 'none',
                    fontSize: el.fontSize || 16,
                    fontFamily: el.fontFamily || 'Arial',
                    color: el.color || '#000000',
                    WebkitTextStroke: el.strokeWidth ? `${el.strokeWidth}px ${el.strokeColor}` : 'none',
                    width: el.width,
                    height: el.height,
                    transform: `rotate(${el.rotation || 0}deg)`,
                    opacity: el.opacity || 1,
                    fontWeight: el.bold ? 'bold' : 'normal',
                    fontStyle: el.italic ? 'italic' : 'normal',
                    textDecoration: el.underline ? 'underline' : 'none'
                  }}
                >
                  {el.type === 'barcode' ? (
                    <div className="bg-black text-white px-2 py-1 font-mono text-xs">
                      |||||| {el.content}
                    </div>
                  ) : el.type === 'qrcode' ? (
                    <div className="border-2 border-black p-1 text-xs text-center">
                      QR<br/>{el.content}
                    </div>
                  ) : el.type === 'image' ? (
                    <img src={el.content} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                  ) : el.type === 'shape' ? (
                    <div style={{width: '100%', height: '100%', backgroundColor: el.color, border: `${el.strokeWidth}px solid ${el.strokeColor}`}} />
                  ) : el.type === 'line' ? (
                    <div style={{width: '100%', height: el.strokeWidth || 2, backgroundColor: el.color}} />
                  ) : (
                    <span>{el.content}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 border-l p-4 overflow-y-auto">
          <h2 className="font-bold mb-4">Properties</h2>
          {selectedEl ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content</label>
                <Input 
                  value={selectedEl.content}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, content: e.target.value} : el
                    ))
                  }}
                />
              </div>
              {selectedEl.type === 'text' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Input 
                      type="number"
                      value={selectedEl.fontSize || 16}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, fontSize: parseInt(e.target.value) || 16} : el
                        ))
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Font Family</label>
                    <select 
                      value={selectedEl.fontFamily || 'Arial'}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, fontFamily: e.target.value} : el
                        ))
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option>Arial</option>
                      <option>Times New Roman</option>
                      <option>Courier New</option>
                      <option>Georgia</option>
                      <option>Verdana</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedEl.bold ? 'default' : 'outline'}
                      onClick={() => setElements(elements.map(el => el.id === selected ? {...el, bold: !el.bold} : el))}
                    >
                      B
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedEl.italic ? 'default' : 'outline'}
                      onClick={() => setElements(elements.map(el => el.id === selected ? {...el, italic: !el.italic} : el))}
                    >
                      I
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedEl.underline ? 'default' : 'outline'}
                      onClick={() => setElements(elements.map(el => el.id === selected ? {...el, underline: !el.underline} : el))}
                    >
                      U
                    </Button>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium">Color</label>
                <Input 
                  type="color"
                  value={selectedEl.color || '#000000'}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, color: e.target.value} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Stroke Width</label>
                <Input 
                  type="number"
                  value={selectedEl.strokeWidth || 0}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, strokeWidth: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Stroke Color</label>
                <Input 
                  type="color"
                  value={selectedEl.strokeColor || '#000000'}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, strokeColor: e.target.value} : el
                    ))
                  }}
                />
              </div>
              {(selectedEl.type === 'shape' || selectedEl.type === 'line' || selectedEl.type === 'image') && (
                <>
                  <div>
                    <label className="text-sm font-medium">Width</label>
                    <Input 
                      type="number"
                      value={selectedEl.width || 100}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, width: parseInt(e.target.value) || 100} : el
                        ))
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Height</label>
                    <Input 
                      type="number"
                      value={selectedEl.height || 100}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, height: parseInt(e.target.value) || 100} : el
                        ))
                      }}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium">Rotation (deg)</label>
                <Input 
                  type="number"
                  value={selectedEl.rotation || 0}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, rotation: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Opacity</label>
                <Input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={selectedEl.opacity || 1}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, opacity: parseFloat(e.target.value) || 1} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">X Position</label>
                <Input 
                  type="number"
                  value={Math.round(selectedEl.x)}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, x: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Y Position</label>
                <Input 
                  type="number"
                  value={Math.round(selectedEl.y)}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, y: parseInt(e.target.value) || 0} : el
                    ))
                  }}
                />
              </div>
              <Button onClick={deleteElement} className="w-full bg-red-600 hover:bg-red-700 text-white">
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
