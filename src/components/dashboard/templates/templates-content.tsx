"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Star,
  Edit,
  Search,
  Sparkles,
  Utensils,
  Printer,
  Wine,
  AlertTriangle,
  Package,
  Book,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
// import { supabase } from "@/lib/supabase/client" // Removed Supabase import
import { useRouter } from "next/navigation"
import templatesData from "@/data/templates.json" // Added local data import

interface Template {
  id: string
  name: string
  description: string
  elements: any[]
  label_format: string
  category: string
  is_favorite: boolean
  usage_count: number
  created_at: string
  updated_at: string
  image_url?: string
}

const templateCategories = [
  {
    id: "popular",
    name: "Popular Templates",
    icon: Sparkles,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    templates: [] as Template[]
  },
  {
    id: "amazon",
    name: "Amazon FBA",
    icon: Package,
    color: "bg-gradient-to-br from-orange-500 to-yellow-500",
    templates: [] as Template[]
  },
  {
    id: "walmart",
    name: "Walmart WFS",
    icon: Package,
    color: "bg-gradient-to-br from-blue-600 to-blue-700",
    templates: [] as Template[]
  },
  {
    id: "ebay",
    name: "eBay Managed",
    icon: Package,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    templates: [] as Template[]
  },
  {
    id: "shopify",
    name: "Shopify Store",
    icon: Package,
    color: "bg-gradient-to-br from-green-600 to-emerald-600",
    templates: [] as Template[]
  },
  {
    id: "etsy",
    name: "Etsy Handmade",
    icon: Wine,
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
    templates: [] as Template[]
  },
  {
    id: "food",
    name: "Food Labels",
    icon: Utensils,
    color: "bg-gradient-to-br from-green-500 to-emerald-500",
    templates: [] as Template[]
  },
  {
    id: "bottle",
    name: "Bottle Labels",
    icon: Wine,
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    templates: [] as Template[]
  },
  {
    id: "warning",
    name: "Warning Labels",
    icon: AlertTriangle,
    color: "bg-gradient-to-br from-red-500 to-orange-500",
    templates: [] as Template[]
  },
  {
    id: "packaging",
    name: "Packaging Labels",
    icon: Package,
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    templates: [] as Template[]
  },
  {
    id: "book",
    name: "Book Labels",
    icon: Book,
    color: "bg-gradient-to-br from-amber-500 to-orange-500",
    templates: [] as Template[]
  }
]

const quickActions = [
  { name: "Edit Online", action: "edit", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { name: "Word", action: "word", color: "bg-blue-50 text-blue-600 border-blue-200", icon: "📄" },
  { name: "Google Docs", action: "docs", color: "bg-green-50 text-green-600 border-green-200", icon: "📝" },
  { name: "PDF", action: "pdf", color: "bg-red-50 text-red-600 border-red-200", icon: "📄" },
]

interface TemplatesContentProps {
  searchQuery?: string
}

export function TemplatesContent({ searchQuery = '' }: TemplatesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [labelSizes, setLabelSizes] = useState<string[]>([])
  const [printerTypes, setPrinterTypes] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    loadAllTemplates()
  }, [])

  const loadAllTemplates = async () => {
    setLoading(true)
    try {
      // Replaced Supabase logic with local JSON data source
      // const { data: publicData, error: publicError } = await supabase...
      
      const allTemplates = Object.values(templatesData).flat().map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description || t.name,
        elements: t.elements || [],
        label_format: t.type,
        category: t.category,
        is_favorite: false,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: t.image_url
      }))

      setTemplates(allTemplates)
      updateCategoryCounts(allTemplates)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCategoryCounts = (allTemplates: Template[]) => {
    templateCategories.forEach(category => {
      const categoryTemplates = allTemplates.filter(template => {
        const templateCategory = template.category?.toLowerCase() || ''
        const templateName = template.name?.toLowerCase() || ''
        
        switch (category.id) {
          case 'popular':
            return template.usage_count > 50 || templateName.includes('amazon') || templateName.includes('shipping') || templateName.includes('avery')
          case 'amazon':
            return templateName.includes('amazon') || templateName.includes('fba') || templateName.includes('fnsku') || templateCategory.includes('amazon')
          case 'walmart':
            return templateName.includes('walmart') || templateName.includes('wfs') || templateCategory.includes('walmart')
          case 'ebay':
            return templateName.includes('ebay') || templateCategory.includes('ebay')
          case 'shopify':
            return templateName.includes('shopify') || templateCategory.includes('shopify')
          case 'etsy':
            return templateName.includes('etsy') || templateCategory.includes('etsy')
          case 'food':
            return templateCategory.includes('food') || templateName.includes('nutrition') || templateName.includes('ingredient') || templateName.includes('expiry') || templateName.includes('organic') || templateName.includes('allergen') || templateCategory.includes('compliance')
          case 'bottle':
            return templateCategory.includes('bottle') || templateCategory.includes('beverage') || templateName.includes('wine') || templateName.includes('bottle') || templateName.includes('label') || templateCategory.includes('product')
          case 'warning':
            return templateCategory.includes('warning') || templateCategory.includes('safety') || templateName.includes('warning') || templateName.includes('caution') || templateName.includes('fragile') || templateCategory.includes('compliance')
          case 'packaging':
            return templateCategory.includes('packaging') || templateCategory.includes('product') || templateName.includes('barcode') || templateName.includes('product') || templateName.includes('qr') || templateCategory.includes('box')
          case 'book':
            return templateCategory.includes('book') || templateCategory.includes('education') || templateName.includes('library') || templateName.includes('book') || templateName.includes('spine')
          default:
            return false
        }
      })
      category.templates = categoryTemplates // Show all templates in category
    })
  }

  const loadTemplatesForCategory = async (categoryId: string) => {
    setLoading(true)
    try {
      const category = templateCategories.find(cat => cat.id === categoryId)
      if (category && category.templates) {
        setTemplates(category.templates)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    loadTemplatesForCategory(categoryId)
  }

  const handleQuickAction = (action: string, _template?: Template) => {
    switch (action) {
      case 'edit':
        router.push('/dashboard/editor')
        break
      case 'word':
        window.open('https://www.office.com/', '_blank')
        break
      case 'docs':
        window.open('https://docs.google.com/', '_blank')
        break
      case 'pdf':
        router.push('/dashboard/editor')
        break
    }
  }

  const filteredCategories = templateCategories.filter(category =>
    searchTerm === '' || category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTemplates = templates.filter(template =>
    searchTerm === '' || 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(template => {
    // Size filter
    if (labelSizes.length > 0) {
      const matches = labelSizes.some(size => {
        if (size === '4x6') return template.name?.includes('4" × 6"') || template.name?.includes('4\" × 6\"') || template.name?.includes('4x6')
        if (size === '2.5x4') return template.name?.includes('2.5" × 4"') || template.name?.includes('2.5\" × 4\"') || template.name?.includes('2.5x4')
        if (size === '3x5') return template.name?.includes('3" × 5"') || template.name?.includes('3\" × 5\"') || template.name?.includes('3x5')
        if (size === '2x4') return template.name?.includes('2" × 4"') || template.name?.includes('2\" × 4\"') || template.name?.includes('2x4')
        return false
      })
      if (!matches) return false
    }
    // Printer type filter
    if (printerTypes.length > 0) {
      const matches = printerTypes.some(type => {
        if (type === 'thermal') return template.label_format === 'thermal'
        if (type === 'inkjet') return template.label_format === 'inkjet'
        if (type === 'desktop') return template.label_format === 'desktop'
        return false
      })
      if (!matches) return false
    }
    return true
  })

  const toggleSize = (size: string) => {
    setLabelSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const togglePrinter = (type: string) => {
    setPrinterTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Label Templates
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Editable free label templates you can customize online. Enjoy professional-quality, printable designs for free. Start creating today!
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => handleQuickAction(action.action)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border font-medium transition-all hover:shadow-md",
                    action.color
                  )}
                >
                  {action.icon && <span>{action.icon}</span>}
                  {action.name}
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/dashboard/editor')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-blue-100 text-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Generate Free Label</span>
                <span className="sm:hidden">Generate</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('food')
                  loadTemplatesForCategory('food')
                }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-green-100 text-sm"
              >
                <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Food Label</span>
                <span className="sm:hidden">Food</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/templates')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-gray-100 text-sm"
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Printable Label</span>
                <span className="sm:hidden">Print</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('bottle')
                  loadTemplatesForCategory('bottle')
                }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-blue-100 text-sm"
              >
                <Wine className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Bottle Label</span>
                <span className="sm:hidden">Bottle</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('warning')
                  loadTemplatesForCategory('warning')
                }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-red-100 text-sm"
              >
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Warning Label</span>
                <span className="sm:hidden">Warning</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('packaging')
                  loadTemplatesForCategory('packaging')
                }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-purple-100 text-sm"
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Packaging Label</span>
                <span className="sm:hidden">Package</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('book')
                  loadTemplatesForCategory('book')
                }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-full font-medium transition-all hover:shadow-md hover:bg-orange-100 text-sm"
              >
                <Book className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Book Label</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12">
        {!selectedCategory ? (
          /* Category Grid */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template Category</h2>
              <p className="text-gray-600">Select from our professionally designed label categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories
                .filter(category => category.templates.length > 0) // Only show categories with templates
                .map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="space-y-4">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform",
                      category.color
                    )}>
                      <category.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {category.templates.length} templates available
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.templates.slice(0, 2).map((template) => (
                        <Badge key={template.id} variant="secondary" className="text-xs">
                          {template.name}
                        </Badge>
                      ))}
                      {category.templates.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.templates.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Templates List */
          <div className="space-y-8">
            {/* Back Button & Category Header */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Label Size</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={labelSizes.includes('4x6')} onChange={() => toggleSize('4x6')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">4" x 6" (Shipping)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={labelSizes.includes('2.5x4')} onChange={() => toggleSize('2.5x4')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">2.5" x 4"</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={labelSizes.includes('3x5')} onChange={() => toggleSize('3x5')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">3" x 5"</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={labelSizes.includes('2x4')} onChange={() => toggleSize('2x4')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">2" x 4"</span>
                    </label>
                  </div>
                </div>
                <hr className="border-slate-200 dark:border-slate-800"/>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Printer Type</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={printerTypes.includes('thermal')} onChange={() => togglePrinter('thermal')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">Thermal</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={printerTypes.includes('inkjet')} onChange={() => togglePrinter('inkjet')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">Inkjet</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={printerTypes.includes('desktop')} onChange={() => togglePrinter('desktop')} className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" type="checkbox"/>
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">Desktop</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Templates Content */}
              <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                ← Back to Categories
              </Button>
              <div className="w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {templateCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {filteredTemplates.length} templates found
                </p>
              </div>
            </div>

            {/* Templates Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 animate-pulse">Loading templates...</div>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or browse other categories.</p>
                <Button onClick={() => setSelectedCategory(null)}>
                  Browse Categories
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => router.push(`/dashboard/editor?template=${template.id}`)}
                    onQuickAction={handleQuickAction}
                  />
                ))}
              </div>
            )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TemplateCard({ 
  template, 
  onEdit,
  onQuickAction
}: {
  template: Template
  onEdit: () => void
  onQuickAction: (action: string, template: Template) => void
}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Preview Area */}
      <div className="aspect-[4/3] bg-white relative overflow-hidden border">
        {template.image_url ? (
          <img 
            src={template.image_url} 
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white p-2 flex flex-col justify-center">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3 h-full flex flex-col justify-center text-center">
              {/* Template Name */}
              <div className="text-xs font-bold text-gray-800 mb-2 truncate">
                {template.name.replace(/ - .*$/, '')}
              </div>
              
              {/* Barcode/QR Code */}
              {(template.name.toLowerCase().includes('barcode') || template.name.toLowerCase().includes('qr')) && (
                <div className="bg-black h-8 w-full mb-2 flex items-center justify-center">
                  <div className="text-white text-[6px] font-mono">||||| |||| |||||</div>
                </div>
              )}
              
              {/* Content Lines */}
              <div className="space-y-1">
                <div className="h-1.5 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto"></div>
                {template.category === 'shipping_labels' && (
                  <>
                    <div className="h-1 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    <div className="h-1 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  </>
                )}
              </div>
              
              {/* Category Badge */}
              <div className={`text-[6px] px-1 py-0.5 rounded mt-2 mx-auto w-fit ${
                template.category === 'product_labels' ? 'bg-blue-100 text-blue-600' :
                template.category === 'shipping_labels' ? 'bg-green-100 text-green-600' :
                template.category === 'compliance_labels' ? 'bg-red-100 text-red-600' :
                template.category === 'box_labels' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {template.category.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            onClick={onEdit}
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Template
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Use Template
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onQuickAction('pdf', template)}
            className="px-3"
          >
            PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
