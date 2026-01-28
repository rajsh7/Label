'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Label = {
  id: string
  name: string
  category: string
  marketplace?: string
  width_mm: number
  height_mm: number
  width_inch?: number
  height_inch?: number
  width_px_203dpi?: number
  height_px_203dpi?: number
  print_method: string
}

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
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [name, setName] = useState('New Label')
  const [selected, setSelected] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<{name: string, count: number, icon: string}[]>([])

  useEffect(() => {
    async function fetchLabels() {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name')
      
      if (data && !error) {
        setLabels(data)
        setSelectedLabel(data[0])
        
        // Group by category
        const categoryGroups = data.reduce((acc: any, label) => {
          if (!acc[label.category]) {
            acc[label.category] = []
          }
          acc[label.category].push(label)
          return acc
        }, {})
        
        const categoryList = Object.keys(categoryGroups).map(cat => ({
          name: cat,
          count: categoryGroups[cat].length,
          icon: getCategoryIcon(cat)
        }))
        
        setCategories(categoryList)
      }
    }
    fetchLabels()
  }, [])

  const saveLabel = async () => {
    setSaving(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      console.log('Auth check:', { user: user?.email, authError })
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        alert('Please login to save labels')
        setSaving(false)
        return
      }

      console.log('Attempting to save label for user:', user.id)
      
      const { error } = await supabase.from('label_designs').insert({
        user_id: user.id,
        name: name,
        label_base_id: selectedLabel?.id || null,
        elements: JSON.stringify(elements),
        width_px: selectedLabel?.width_px_203dpi || 400,
        height_px: selectedLabel?.height_px_203dpi || 600
      })

      if (error) {
        console.error('Supabase error:', error)
        alert(`Failed to save: ${error.message}`)
        setSaving(false)
        return
      }

      alert('Label saved successfully!')
      router.push('/dashboard/templates')
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
      shopify_custom: '🛍️',
      etsy: '🎨',
      usps: '📮',
      fedex: '📦',
      ups: '📦',
      dhl: '✈️',
      dymo_desktop: '🖨️',
      barcode_sticker: '🏷️',
      other_carriers: '🚚',
      shipping: '📦',
      generic: '🏷️'
    }
    return icons[category] || '🏷️'
  }

  const filteredLabels = selectedCategory 
    ? labels.filter(label => 
        label.category === selectedCategory && 
        (searchQuery === '' || 
         label.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         label.marketplace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         label.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : labels.filter(label => 
        searchQuery === '' || 
        label.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.marketplace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.category.toLowerCase().includes(searchQuery.toLowerCase())
      )

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

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    const el = elements.find(el => el.id === id)
    if (!el) return
    setSelected(id)
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    setDragOffset({ x: clientX - el.x, y: clientY - el.y })
    setElements(elements.map(el => el.id === id ? {...el, isDragging: true} : el))
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const dragging = elements.find(el => el.isDragging)
    if (!dragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    setElements(elements.map(el => 
      el.id === dragging.id 
        ? {...el, x: clientX - dragOffset.x, y: clientY - dragOffset.y} 
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Select Label Type</h1>
            <p className="text-sm text-muted-foreground">Choose from {labels.length}+ label formats</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full flex justify-center mb-8">
          <div className="relative w-full max-w-md mx-auto">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        {!selectedCategory ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {categories.map(category => (
                <div 
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className="p-6 border rounded-lg cursor-pointer hover:bg-accent hover:border-primary transition-all text-center"
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold capitalize">{category.name.replace('_', ' ')}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} labels</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6">
              <Button variant="outline" onClick={() => setSelectedCategory(null)} className="w-full sm:w-auto">
                ← Back to Categories
              </Button>
              <h2 className="text-lg font-semibold capitalize">
                {selectedCategory.replace('_', ' ')} Labels ({filteredLabels.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLabels.map(label => (
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
                  <p className="text-xs text-muted-foreground">{label.marketplace}</p>
                  <p className="text-xs text-muted-foreground capitalize">{label.print_method}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden flex flex-col h-screen bg-background">
        {/* Mobile Header */}
        <div className="border-b p-3 bg-background">
          <div className="flex items-center gap-2 mb-3">
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="flex-1 text-sm"
              placeholder="Label name"
            />
            <Button onClick={saveLabel} disabled={saving} size="sm" className="px-3">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowLabelSelect(true)} size="sm" className="text-xs">
              Change Label
            </Button>
            <div className="text-xs text-muted-foreground">
              {selectedLabel?.name}
            </div>
          </div>
        </div>

        {/* Mobile Tools */}
        <div className="border-b p-3 bg-muted/30">
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => addElement('text')} size="sm" variant="outline" className="text-xs px-2">
              📝 Text
            </Button>
            <Button onClick={() => addElement('barcode')} size="sm" variant="outline" className="text-xs px-2">
              🔲 Code
            </Button>
            <Button onClick={() => addElement('qrcode')} size="sm" variant="outline" className="text-xs px-2">
              📱 QR
            </Button>
            <Button onClick={() => addElement('image')} size="sm" variant="outline" className="text-xs px-2">
              🖼️ Image
            </Button>
            <Button onClick={() => addElement('shape')} size="sm" variant="outline" className="text-xs px-2">
              ⬜ Shape
            </Button>
            <Button onClick={() => addElement('line')} size="sm" variant="outline" className="text-xs px-2">
              ➖ Line
            </Button>
          </div>
        </div>

        {/* Mobile Canvas */}
        <div className="flex-1 overflow-auto">
          <div 
            className="min-h-full flex items-center justify-center bg-gray-50 p-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <div 
              className="bg-white relative border-2 shadow-lg"
              style={{
                width: selectedLabel?.width_px_203dpi ? `${Math.min(selectedLabel.width_px_203dpi * 0.8, window.innerWidth - 40)}px` : `${Math.min(400, window.innerWidth - 40)}px`,
                height: selectedLabel?.height_px_203dpi ? `${selectedLabel.height_px_203dpi * 0.8}px` : '500px',
                minHeight: '300px'
              }}
            >
              {elements.map(el => (
                <div 
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  onTouchStart={(e) => handleMouseDown(e, el.id)}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    border: selected === el.id ? '2px solid #3b82f6' : '1px solid transparent',
                    padding: '2px',
                    cursor: 'move',
                    userSelect: 'none',
                    fontSize: (el.fontSize || 16) * 0.8,
                    fontFamily: el.fontFamily || 'Arial',
                    color: el.color || '#000000',
                    WebkitTextStroke: el.strokeWidth ? `${el.strokeWidth}px ${el.strokeColor}` : 'none',
                    width: el.width ? el.width * 0.8 : 'auto',
                    height: el.height ? el.height * 0.8 : 'auto',
                    transform: `rotate(${el.rotation || 0}deg)`,
                    opacity: el.opacity || 1,
                    fontWeight: el.bold ? 'bold' : 'normal',
                    fontStyle: el.italic ? 'italic' : 'normal',
                    textDecoration: el.underline ? 'underline' : 'none',
                    touchAction: 'none'
                  }}
                >
                  {el.type === 'barcode' ? (
                    <div className="bg-black text-white px-1 py-0.5 font-mono text-xs">
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
                    <span className="text-sm">{el.content}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Properties Panel */}
        {selectedEl && (
          <div className="border-t p-3 bg-background max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Edit Element</h3>
              <Button onClick={deleteElement} size="sm" variant="destructive" className="text-xs px-2">
                Delete
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Content</label>
                <Input 
                  value={selectedEl.content}
                  onChange={e => {
                    setElements(elements.map(el => 
                      el.id === selected ? {...el, content: e.target.value} : el
                    ))
                  }}
                  className="text-sm"
                />
              </div>
              {selectedEl.type === 'text' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium block mb-1">Size</label>
                    <Input 
                      type="number"
                      value={selectedEl.fontSize || 16}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, fontSize: parseInt(e.target.value) || 16} : el
                        ))
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Color</label>
                    <Input 
                      type="color"
                      value={selectedEl.color || '#000000'}
                      onChange={e => {
                        setElements(elements.map(el => 
                          el.id === selected ? {...el, color: e.target.value} : el
                        ))
                      }}
                      className="h-8"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
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
                  onTouchStart={(e) => handleMouseDown(e, el.id)}
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
