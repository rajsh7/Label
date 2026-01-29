'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

type Label = {
  id: string
  name: string
  category: string
  marketplace?: string
  width_mm: number
  height_mm: number
  width_inch?: number
  height_inch?: number
  print_method: string
  notes?: string
  product_reference?: string
}

type Element = {
  id: number
  type: 'text' | 'image' | 'barcode' | 'qrcode' | 'shape'
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  textAlign?: string
  color: string
  backgroundColor?: string
  zIndex: number
  locked?: boolean
  aspectRatio?: number
}

type LabelSettings = {
  width: number
  height: number
  unit: 'mm' | 'inch' | 'px'
  zoom: number
  showGrid: boolean
  snapToGrid: boolean
}

export default function LabelEditor() {
  const [showLabelSelect, setShowLabelSelect] = useState(true)
  const [showBrandSelect, setShowBrandSelect] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [editing, setEditing] = useState<number | null>(null)
  const [dragData, setDragData] = useState<any>(null)
  const [resizeData, setResizeData] = useState<any>(null)
  const [showShapeMenu, setShowShapeMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null)
  const [labelSettings, setLabelSettings] = useState<LabelSettings>({
    width: 400,
    height: 300,
    unit: 'px',
    zoom: 100,
    showGrid: true,
    snapToGrid: true
  })
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  useEffect(() => {
    const initializeEditor = async () => {
      await fetchLabels()
    }
    
    initializeEditor()
  }, [])

  useEffect(() => {
    // Check if template ID is provided in URL after labels are loaded
    const templateId = searchParams.get('template')
    if (templateId && labels.length > 0) {
      loadTemplate(templateId)
    }
  }, [labels, searchParams])

  const fetchLabels = async () => {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('name')
    
    if (data && !error) {
      setLabels(data)
    }
  }

  const loadTemplate = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (error || !data) {
        console.error('Error loading template:', error)
        return
      }

      // Find the label by ID
      const label = labels.find(l => l.id === data.label_base_id)
      if (label) {
        setSelectedLabel(label)
        const pixelWidth = (label.width_mm * 3.78)
        const pixelHeight = (label.height_mm * 3.78)
        setLabelSettings({
          ...labelSettings,
          width: pixelWidth,
          height: pixelHeight,
          unit: 'mm'
        })
        setSelectedBrand(label.marketplace || label.category)
      }

      // Load template elements
      setElements(data.elements || [])
      setCurrentTemplateId(templateId)
      setShowLabelSelect(false)
      setShowBrandSelect(false)
    } catch (error) {
      console.error('Error loading template:', error)
    }
  }

  const selectBrand = (brand: string) => {
    setSelectedBrand(brand)
    setShowBrandSelect(false)
  }

  const selectLabel = (label: Label) => {
    setSelectedLabel(label)
    const pixelWidth = (label.width_mm * 3.78)
    const pixelHeight = (label.height_mm * 3.78)
    setLabelSettings({
      ...labelSettings,
      width: pixelWidth,
      height: pixelHeight,
      unit: 'mm'
    })
    setShowLabelSelect(false)
  }

  const addElement = (type: Element['type'], shapeType?: string) => {
    const newElement: Element = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'Sample Text' : type === 'barcode' ? '123456789' : type === 'qrcode' ? 'QR Data' : type === 'shape' ? (shapeType || 'rectangle') : '',
      x: 20,
      y: 20 + elements.length * 30,
      width: type === 'text' ? 120 : shapeType === 'triangle' ? 100 : 80,
      height: type === 'text' ? 24 : type === 'barcode' ? 40 : shapeType === 'triangle' ? 80 : 80,
      rotation: 0,
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#000000',
      backgroundColor: type === 'shape' ? 'transparent' : 'transparent',
      zIndex: elements.length,
      aspectRatio: type === 'image' ? 1 : undefined
    }
    setElements([...elements, newElement])
    setSelected(newElement.id)
    setShowShapeMenu(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const newElement: Element = {
          id: Date.now(),
          type: 'image',
          content: event.target?.result as string,
          x: 20,
          y: 20,
          width: 100,
          height: 100 / aspectRatio,
          rotation: 0,
          color: '#000000',
          zIndex: elements.length,
          aspectRatio
        }
        setElements([...elements, newElement])
        setSelected(newElement.id)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent, id: number, handle?: string) => {
    e.stopPropagation()
    const element = elements.find(el => el.id === id)!
    setSelected(id)
    setEditing(null)

    if (handle) {
      setResizeData({ id, handle, startX: e.clientX, startY: e.clientY, startWidth: element.width, startHeight: element.height })
    } else {
      setDragData({ id, startX: e.clientX, startY: e.clientY, startElementX: element.x, startElementY: element.y })
    }
  }

  const handleDoubleClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const element = elements.find(el => el.id === id)!
    if (element.type === 'text' || element.type === 'barcode' || element.type === 'qrcode') {
      setEditing(id)
      setSelected(id)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragData) {
      const deltaX = e.clientX - dragData.startX
      const deltaY = e.clientY - dragData.startY
      const newX = dragData.startElementX + deltaX / (labelSettings.zoom / 100)
      const newY = dragData.startElementY + deltaY / (labelSettings.zoom / 100)
      
      setElements(elements.map(el => 
        el.id === dragData.id ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) } : el
      ))
    }
    
    if (resizeData) {
      const deltaX = e.clientX - resizeData.startX
      const deltaY = e.clientY - resizeData.startY
      const element = elements.find(el => el.id === resizeData.id)!
      
      let newWidth = resizeData.startWidth
      let newHeight = resizeData.startHeight
      
      if (resizeData.handle.includes('e')) newWidth += deltaX / (labelSettings.zoom / 100)
      if (resizeData.handle.includes('w')) newWidth -= deltaX / (labelSettings.zoom / 100)
      if (resizeData.handle.includes('s')) newHeight += deltaY / (labelSettings.zoom / 100)
      if (resizeData.handle.includes('n')) newHeight -= deltaY / (labelSettings.zoom / 100)
      
      newWidth = Math.max(10, newWidth)
      newHeight = Math.max(10, newHeight)
      
      if (element.aspectRatio && (resizeData.handle === 'se' || resizeData.handle === 'nw')) {
        newHeight = newWidth / element.aspectRatio
      }
      
      setElements(elements.map(el => 
        el.id === resizeData.id ? { ...el, width: newWidth, height: newHeight } : el
      ))
    }
  }

  const handleMouseUp = () => {
    setDragData(null)
    setResizeData(null)
  }

  const updateElement = (id: number, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }

  const deleteElement = (id: number) => {
    setElements(elements.filter(el => el.id !== id))
    setSelected(null)
  }

  const moveLayer = (id: number, direction: 'up' | 'down') => {
    const element = elements.find(el => el.id === id)!
    const newZIndex = direction === 'up' ? element.zIndex + 1 : element.zIndex - 1
    setElements(elements.map(el => el.id === id ? { ...el, zIndex: newZIndex } : el))
  }

  const saveDesign = async () => {
    if (!selectedLabel || elements.length === 0) {
      showToast('Please add some elements to save the design', 'warning')
      return
    }

    // Check user's subscription limit
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let userTier = 'free'
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()
      
      userTier = profile?.subscription_tier || 'free'
    } catch (error) {
      console.log('Profile query failed, using free tier as default')
    }

    const tierLimits = { free: 50, pro: 1000, enterprise: 999999 }
    const limit = tierLimits[userTier as keyof typeof tierLimits]

    // Count current month's templates
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const { count: templatesThisMonth } = await supabase
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())

    if (!currentTemplateId && (templatesThisMonth || 0) >= limit) {
      showToast(`You've reached your ${limit} label limit for this month. Please upgrade to continue.`, 'warning')
      return
    }

    setIsSaving(true)
    try {
      if (currentTemplateId) {
        // Update existing template
        const response = await fetch(`/api/templates/${currentTemplateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            elements: elements
          })
        })

        const result = await response.json()
        
        if (result.success) {
          showToast('Template updated successfully!', 'success')
        } else {
          showToast('Failed to update template: ' + result.error, 'error')
        }
      } else {
        // Create new template
        const brand = selectedLabel.marketplace || selectedLabel.category
        const templateName = `${brand} - ${selectedLabel.name} Template`
        
        const response = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName,
            label_base_id: selectedLabel.id,
            elements: elements,
            category: selectedLabel.category,
            is_public: false
          })
        })

        const result = await response.json()
        
        if (result.success) {
          showToast('Design saved successfully!', 'success')
          router.push('/templates')
        } else {
          showToast('Failed to save design: ' + result.error, 'error')
        }
      }
    } catch (error) {
      showToast('Failed to save design', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedElement = elements.find(el => el.id === selected)
  const canvasStyle = {
    width: `${labelSettings.width}px`,
    height: `${labelSettings.height}px`,
    transform: `scale(${labelSettings.zoom / 100})`,
    transformOrigin: 'center'
  }

  const brands = Array.from(new Set(labels.map(l => l.marketplace || l.category).filter(Boolean)))
  const filteredLabels = selectedBrand ? labels.filter(l => (l.marketplace || l.category) === selectedBrand) : labels

  if (showBrandSelect) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Brand</h1>
            <p className="text-gray-600">Choose your preferred label brand</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map(brand => {
              const brandCount = labels.filter(l => (l.marketplace || l.category) === brand).length
              return (
                <div
                  key={brand}
                  onClick={() => selectBrand(brand)}
                  className="p-6 border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-white text-center"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{brand}</h3>
                  <p className="text-sm text-gray-600">{brandCount} labels available</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (showLabelSelect) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Label Type</h1>
            <p className="text-gray-600">Choose from our collection of professional label formats</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto">
            {filteredLabels.map(label => (
              <div
                key={label.id}
                onClick={() => selectLabel(label)}
                className="p-6 border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-white"
              >
                <h3 className="font-semibold text-base mb-3 text-gray-900">{label.name}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{label.width_inch}" × {label.height_inch}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metric:</span>
                    <span className="font-medium">{label.width_mm}mm × {label.height_mm}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-medium capitalize">{label.print_method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowBrandSelect(true)}
            >
              ← Back to Brands
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                setSelectedLabel({ id: 'custom', name: 'Custom Label', category: 'custom', width_mm: 100, height_mm: 50, print_method: 'custom' })
                setShowLabelSelect(false)
              }}
              className="px-8 py-3"
            >
              Create Custom Size Label
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-2 lg:p-3 flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button variant="outline" size="sm" onClick={() => {
              setShowLabelSelect(true)
              setShowBrandSelect(true)
              setSelectedBrand(null)
            }}>
              Change Label
            </Button>
            <div className="text-xs lg:text-sm text-gray-600 truncate">
              {selectedLabel?.name} ({selectedLabel?.width_inch}" × {selectedLabel?.height_inch}")
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
            <span className="text-xs lg:text-sm">Zoom:</span>
            <input
              type="range"
              min="25"
              max="200"
              step="25"
              value={labelSettings.zoom}
              onChange={(e) => setLabelSettings({ ...labelSettings, zoom: Number(e.target.value) })}
              className="w-16 lg:w-24"
            />
            <span className="text-xs lg:text-sm w-8 lg:w-12">{labelSettings.zoom}%</span>
            
            <div className="border-l h-4 lg:h-6 mx-1 lg:mx-2" />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveDesign}
              disabled={isSaving}
              className="text-xs lg:text-sm"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2 lg:p-8 bg-white flex flex-col lg:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {/* Mobile Layers Panel - Collapsible */}
          <div className="lg:hidden mb-4">
            <details className="bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl shadow-lg">
              <summary className="p-3 cursor-pointer font-bold text-gray-800">Layers ({elements.length})</summary>
              <div className="p-3 pt-0 space-y-2 max-h-48 overflow-y-auto">
                {elements.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-xs">No layers yet</div>
                  </div>
                ) : (
                  elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map(el => (
                      <div
                        key={el.id}
                        onClick={() => setSelected(el.id)}
                        className={`p-2 rounded-lg cursor-pointer text-xs transition-all duration-200 ${
                          selected === el.id 
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                            : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'barcode' ? '🔲' : el.type === 'qrcode' ? '📱' : '⬜'}
                            </span>
                            <div>
                              <div className="font-medium capitalize">{el.type}</div>
                              <div className="text-xs text-gray-500">{el.content.substring(0, 8)}...</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'up'); }}
                              className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs transition-colors"
                            >
                              ↑
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'down'); }}
                              className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs transition-colors"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </details>
          </div>
          
          {/* Desktop Layers Panel */}
          <div className="hidden lg:block w-52 mr-4">
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-4 shadow-lg h-fit mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Layers</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {elements.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm">No layers yet</div>
                  </div>
                ) : (
                  elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map(el => (
                      <div
                        key={el.id}
                        onClick={() => setSelected(el.id)}
                        className={`p-3 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                          selected === el.id 
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                            : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'barcode' ? '🔲' : el.type === 'qrcode' ? '📱' : '⬜'}
                            </span>
                            <div>
                              <div className="font-medium capitalize">{el.type}</div>
                              <div className="text-xs text-gray-500">{el.content.substring(0, 12)}...</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'up'); }}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs transition-colors"
                            >
                              ↑
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'down'); }}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs transition-colors"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-700 mb-3">Add Elements</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addElement('text')} 
                    className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <div className="text-xl mb-1">📝</div>
                    <div className="text-xs font-medium text-gray-700">Text</div>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <div className="text-xl mb-1">🖼️</div>
                    <div className="text-xs font-medium text-gray-700">Image</div>
                  </button>
                  <button 
                    onClick={() => addElement('barcode')} 
                    className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <div className="text-xl mb-1">🔲</div>
                    <div className="text-xs font-medium text-gray-700">Barcode</div>
                  </button>
                  <button 
                    onClick={() => addElement('qrcode')} 
                    className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <div className="text-xl mb-1">📱</div>
                    <div className="text-xs font-medium text-gray-700">QR Code</div>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowShapeMenu(!showShapeMenu)} 
                      className="bg-white border-2 border-pink-200 hover:border-pink-400 rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md w-full"
                    >
                      <div className="text-xl mb-1">⬜</div>
                      <div className="text-xs font-medium text-gray-700">Shape</div>
                    </button>
                    {showShapeMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'rectangle'); }} className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs rounded-t-lg">Rectangle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'circle'); }} className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs">Circle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'triangle'); }} className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs">Triangle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'ellipse'); }} className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs rounded-b-lg">Ellipse</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Elements Toolbar */}
          <div className="lg:hidden mb-4">
            <details className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
              <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-700">Add Elements</summary>
              <div className="p-3 pt-0">
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => addElement('text')} 
                    className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-2 transition-all duration-200"
                  >
                    <div className="text-lg mb-1">📝</div>
                    <div className="text-xs font-medium text-gray-700">Text</div>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-2 transition-all duration-200"
                  >
                    <div className="text-lg mb-1">🖼️</div>
                    <div className="text-xs font-medium text-gray-700">Image</div>
                  </button>
                  <button 
                    onClick={() => addElement('barcode')} 
                    className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-xl p-2 transition-all duration-200"
                  >
                    <div className="text-lg mb-1">🔲</div>
                    <div className="text-xs font-medium text-gray-700">Barcode</div>
                  </button>
                  <button 
                    onClick={() => addElement('qrcode')} 
                    className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl p-2 transition-all duration-200"
                  >
                    <div className="text-lg mb-1">📱</div>
                    <div className="text-xs font-medium text-gray-700">QR Code</div>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowShapeMenu(!showShapeMenu)} 
                      className="bg-white border-2 border-pink-200 hover:border-pink-400 rounded-xl p-2 transition-all duration-200 w-full"
                    >
                      <div className="text-lg mb-1">⬜</div>
                      <div className="text-xs font-medium text-gray-700">Shape</div>
                    </button>
                    {showShapeMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'rectangle'); }} className="w-full px-2 py-1 text-left hover:bg-gray-50 text-xs rounded-t-lg">Rectangle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'circle'); }} className="w-full px-2 py-1 text-left hover:bg-gray-50 text-xs">Circle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'triangle'); }} className="w-full px-2 py-1 text-left hover:bg-gray-50 text-xs">Triangle</button>
                        <button onClick={(e) => { e.stopPropagation(); addElement('shape', 'ellipse'); }} className="w-full px-2 py-1 text-left hover:bg-gray-50 text-xs rounded-b-lg">Ellipse</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </details>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <div className="inline-block">
                <div
                  ref={canvasRef}
                  className="bg-white border-2 border-gray-300 relative shadow-lg"
                  style={canvasStyle}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={() => setEditing(null)}
                >
                  {labelSettings.showGrid && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgb(204, 204, 204) 1px, transparent 1px), linear-gradient(rgb(204, 204, 204) 1px, transparent 1px)`,
                        backgroundSize: '10px 10px'
                      }}
                    />
                  )}

                  {elements
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(el => (
                      <div key={el.id} className="absolute">
                        <div
                          onMouseDown={(e) => handleMouseDown(e, el.id)}
                          onDoubleClick={(e) => handleDoubleClick(e, el.id)}
                          className={`absolute cursor-move ${selected === el.id ? 'ring-2 ring-blue-500' : ''}`}
                          style={{
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height,
                            transform: `rotate(${el.rotation}deg)`,
                            fontSize: el.fontSize,
                            fontFamily: el.fontFamily,
                            fontWeight: el.fontWeight,
                            textAlign: el.textAlign as any,
                            color: el.color,
                            backgroundColor: el.backgroundColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            padding: el.type === 'text' ? '4px' : '0'
                          }}
                        >
                          {el.type === 'text' && (
                            editing === el.id ? (
                              <input
                                type="text"
                                value={el.content}
                                onChange={(e) => updateElement(el.id, { content: e.target.value })}
                                onBlur={() => setEditing(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                                className="w-full h-full bg-transparent border-none outline-none"
                                style={{
                                  fontSize: el.fontSize,
                                  fontFamily: el.fontFamily,
                                  fontWeight: el.fontWeight,
                                  textAlign: el.textAlign as any,
                                  color: el.color
                                }}
                                autoFocus
                              />
                            ) : (
                              el.content
                            )
                          )}
                          {el.type === 'image' && <img src={el.content} alt="" className="w-full h-full object-contain" />}
                          {el.type === 'barcode' && (
                            editing === el.id ? (
                              <input
                                type="text"
                                value={el.content}
                                onChange={(e) => updateElement(el.id, { content: e.target.value })}
                                onBlur={() => setEditing(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                                className="w-full text-center bg-black text-white px-2 py-1 font-mono text-xs border-none outline-none"
                                autoFocus
                              />
                            ) : (
                              <div className="bg-black text-white px-2 py-1 font-mono text-xs w-full text-center">
                                |||||| {el.content}
                              </div>
                            )
                          )}
                          {el.type === 'qrcode' && (
                            editing === el.id ? (
                              <input
                                type="text"
                                value={el.content}
                                onChange={(e) => updateElement(el.id, { content: e.target.value })}
                                onBlur={() => setEditing(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                                className="w-full h-full text-center border-2 border-black p-2 text-xs outline-none"
                                autoFocus
                              />
                            ) : (
                              <div className="border-2 border-black p-2 text-xs text-center w-full h-full flex items-center justify-center">
                                QR<br/>{el.content}
                              </div>
                            )
                          )}
                          {el.type === 'shape' && (
                            el.content === 'circle' ? (
                              <div className="w-full h-full" style={{ border: '2px solid #000', borderRadius: '50%' }} />
                            ) : el.content === 'triangle' ? (
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <polygon points="50,10 10,90 90,90" fill="none" stroke="#000" strokeWidth="2" />
                              </svg>
                            ) : el.content === 'ellipse' ? (
                              <div className="w-full h-full" style={{ border: '2px solid #000', borderRadius: '50%', transform: 'scaleX(1.5)' }} />
                            ) : (
                              <div className="w-full h-full" style={{ border: '2px solid #000' }} />
                            )
                          )}
                        </div>

                        {selected === el.id && (
                          <>
                            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(handle => (
                              <div
                                key={handle}
                                onMouseDown={(e) => handleMouseDown(e, el.id, handle)}
                                className="absolute w-2 h-2 bg-blue-500 border border-white cursor-pointer"
                                style={{
                                  left: el.x + (handle.includes('e') ? el.width - 4 : handle.includes('w') ? -4 : el.width / 2 - 4),
                                  top: el.y + (handle.includes('s') ? el.height - 4 : handle.includes('n') ? -4 : el.height / 2 - 4),
                                  cursor: `${handle}-resize`
                                }}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Properties Panel */}
      <div className="lg:hidden">
        {selectedElement && (
          <details className="bg-white border-t-2 border-gray-200 shadow-lg">
            <summary className="p-3 cursor-pointer font-bold text-lg">Properties</summary>
            <div className="p-3 pt-0 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Element Properties</h3>
                <Button size="sm" variant="destructive" onClick={() => deleteElement(selectedElement.id)}>
                  Delete
                </Button>
              </div>
              
              <div>
                <label className="text-xs font-medium">Content</label>
                <Input
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">X</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Y</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">Width</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Height</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Color</label>
                <Input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                />
              </div>
            </div>
          </details>
        )}
      </div>
      
      {/* Desktop Properties Panel */}
      <div className="hidden lg:block w-80 bg-white border-l p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Properties</h2>

        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">Label Settings</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <div><strong>{selectedLabel?.name}</strong></div>
              <div>{selectedLabel?.width_mm}mm × {selectedLabel?.height_mm}mm</div>
              <div>{selectedLabel?.width_inch}" × {selectedLabel?.height_inch}"</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">Width (px)</label>
                <Input
                  type="number"
                  value={labelSettings.width}
                  onChange={(e) => setLabelSettings({ ...labelSettings, width: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium">Height (px)</label>
                <Input
                  type="number"
                  value={labelSettings.height}
                  onChange={(e) => setLabelSettings({ ...labelSettings, height: Number(e.target.value) })}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowLabelSelect(true)
                setShowBrandSelect(true)
                setSelectedBrand(null)
              }}
              className="w-full"
            >
              Change Label Type
            </Button>
          </div>
        </Card>

        {selectedElement ? (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Element Properties</h3>
              <Button size="sm" variant="destructive" onClick={() => deleteElement(selectedElement.id)}>
                Delete
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Content</label>
                <Input
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">X</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Y</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">Width</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Height</label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Rotation: {selectedElement.rotation}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.rotation}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {selectedElement.type === 'text' && (
                <>
                  <div>
                    <label className="text-xs font-medium">Font Size</label>
                    <Input
                      type="number"
                      value={selectedElement.fontSize}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Font Family</label>
                    <select 
                      value={selectedElement.fontFamily} 
                      onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Text Align</label>
                    <select 
                      value={selectedElement.textAlign} 
                      onChange={(e) => updateElement(selectedElement.id, { textAlign: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-medium">Color</label>
                <Input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                />
              </div>

              {selectedElement.type === 'shape' && (
                <>
                  <div>
                    <label className="text-xs font-medium">Shape Type</label>
                    <select 
                      value={selectedElement.content} 
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="rectangle">Rectangle</option>
                      <option value="circle">Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="ellipse">Ellipse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Background Color</label>
                    <Input
                      type="color"
                      value={selectedElement.backgroundColor || '#f0f0f0'}
                      onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select an element to edit properties
          </div>
        )}
      </div>
    </div>
  )
}