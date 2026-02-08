'use client'

import { useState, useMemo } from 'react'
import { Edit } from 'lucide-react'
import templatesData from '@/data/templates.json'

// --- 1. Template Data from JSON ---

const ALL_TEMPLATES = [
  ...templatesData.amazon,
  ...templatesData.walmart,
  ...templatesData.ebay,
  ...templatesData.shopify,
  ...templatesData.etsy,
  ...templatesData.usps,
  ...templatesData.fedex,
  ...templatesData.ups,
  ...templatesData.dhl,
  ...templatesData.ontrac,
  ...templatesData.lasership,
  ...templatesData.pitneybowes,
  ...templatesData.stampscom,
  ...templatesData.shipstation,
  ...templatesData.endicia,
  ...templatesData.shippo,
  ...templatesData.easypost,
  ...templatesData.canadapost,
  ...templatesData.royalmail,
  ...templatesData.australiapost,
  ...templatesData.woocommerce,
  ...templatesData.bigcommerce,
  ...templatesData.magento,
  ...templatesData.prestashop,
  ...templatesData.opencart,
  ...templatesData.squarespace,
  ...templatesData.wix,
  ...templatesData.depop,
  ...templatesData.poshmark,
  ...templatesData.mercari,
  ...templatesData.generic,
]



// --- 2. Helper Logic ---

const getLogoForCategory = (category: string): string => {
  const logoMap: Record<string, string> = {
    'amazon': '/amazon-logo.png',
    'walmart': '/walmart-logo.png',
    'ebay': '/ebay-label.jpg',
    'shopify': '/shopify-logo.png',
    'etsy': '/etsy-logo.png',
    'usps': '/usps-logo.png',
    'fedex': '/fedex-label.png',
    'ups': '/ups-label.png',
    'dhl': '/dhl-label.png',
    'ontrac': '/Ontrac-label.png',
    'lasership': '/LaserShip-label.png',
    'pitneybowes': '/pb-label.png',
    'stampscom': '/pb-label.png', // Using Pitney Bowes logo as fallback
    'shipstation': '/shipstation-logo.png',
    'endicia': '/Endicia-label.png',
    'shippo': '/Shippo-label.png',
    'easypost': '/Easypost-label.png',
    'canadapost': '/Canda-label.png',
    'royalmail': '/RM-label.png',
    'australiapost': '/Australia-label.png',
    'generic': '/Generic.png',
    'woocommerce': '/WooCommerce-label.png',
    'bigcommerce': '/Bigcomerrce-label.png',
    'magento': '/magento-label.png',
    'prestashop': '/PS-label.jpg',
    'opencart': '/OpenCart-Label.png',
    'squarespace': '/Squarespace-label.png',
    'wix': '/wix-label.png',
    'depop': '/depop-label.jpg',
    'poshmark': '/Poshmark-label.png',
    'mercari': '/mercari-label.png'
  }
  
  return logoMap[category.toLowerCase()] || '/Generic.png'
}





export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [itemsToShow, setItemsToShow] = useState(50)
  const [labelSizes, setLabelSizes] = useState<string[]>([])

  const filteredTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            template.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory ? template.category.toLowerCase() === selectedCategory.toLowerCase() : true
      
      // Size filter
      let matchesSize = true
      if (labelSizes.length > 0) {
        matchesSize = labelSizes.some(size => {
          if (size === '4x6') return template.size?.includes('4"') && template.size?.includes('6"')
          if (size === '2.25x1.25') return template.size?.includes('2.25"') || template.size?.includes('2.625"')
          if (size === '3x3') return template.size?.includes('3"') && !template.size?.includes('x 5') && !template.size?.includes('x 2')
          return false
        })
      }
      
      return matchesSearch && matchesCategory && matchesSize
    })
  }, [searchQuery, selectedCategory, labelSizes])

  const toggleSize = (size: string) => {
    setLabelSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const displayedTemplates = useMemo(() => {
    return filteredTemplates.slice(0, itemsToShow)
  }, [filteredTemplates, itemsToShow])

  const hasMore = itemsToShow < filteredTemplates.length

  const loadMore = () => {
    setItemsToShow(prev => prev + 12) // Load 12 more templates
  }


  return (
    <div className="min-h-screen flex flex-col gap-8 font-display">
      
      {/* Hero Section */}
      <section className="flex flex-col gap-6 py-8 relative">
        <div className="flex flex-col gap-4 animate-fade-in-up max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            Label <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Templates</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mt-2 font-medium">
            Professional, print-ready designs for every marketplace.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mt-4 relative group z-10">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300 transform focus-within:-translate-y-1">
            <span className="material-symbols-outlined text-slate-400 text-3xl ml-4">search</span>
            <input 
              className="w-full bg-transparent border-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 px-4 py-3 focus:ring-0 outline-none" 
              placeholder="Search for boxes, bottles, shipping labels..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Compatible with</span>
          {[
            { name: 'Amazon', color: '#FF9900', icon: 'shopping_cart' },
            { name: 'Walmart', color: '#0071DC', icon: 'storefront' },
            { name: 'Shopify', color: '#95BF47', icon: 'shopping_bag' },
            { name: 'eBay', color: '#E53238', icon: 'sell' },
            { name: 'Etsy', color: '#F56400', icon: 'palette' }
          ].map((cat) => (
             <button 
               key={cat.name}
               onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
               className={`px-4 py-2 rounded-full border transition-all shadow-sm flex items-center gap-2 group ${selectedCategory === cat.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-card-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'}`}
             >
              <span className={`material-symbols-outlined text-lg ${selectedCategory === cat.name ? 'text-white' : `group-hover:text-[${cat.color}]`}`}>{cat.icon}</span>
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          ))}
          <button 
             onClick={() => setSelectedCategory(null)}
             className={`px-4 py-2 rounded-full border transition-all shadow-sm flex items-center gap-2 group ${selectedCategory === null ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-card-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'}`}
           >
            <span className="font-bold text-sm">All</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 sticky top-32 bg-[#f6f5f8] dark:bg-[#161022] z-0">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Sort By</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input defaultChecked className="w-4 h-4 text-primary border-slate-300 focus:ring-primary text-primary" name="sort" type="radio"/>
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">Most Popular</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 text-primary border-slate-300 focus:ring-primary text-primary" name="sort" type="radio"/>
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">Newest Arrivals</span>
              </label>
            </div>
          </div>
          <hr className="border-slate-200 dark:border-slate-800"/>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Label Size</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input checked={labelSizes.includes('4x6')} onChange={() => toggleSize('4x6')} className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary" type="checkbox"/>
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">4" x 6" (Shipping)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input checked={labelSizes.includes('2.25x1.25')} onChange={() => toggleSize('2.25x1.25')} className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary" type="checkbox"/>
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">2.25" x 1.25"</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input checked={labelSizes.includes('3x3')} onChange={() => toggleSize('3x3')} className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary" type="checkbox"/>
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">3" x 3" (Square)</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Template Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Showing <span className="text-slate-900 dark:text-white font-bold">{displayedTemplates.length}</span> of <span className="text-slate-900 dark:text-white font-bold">{filteredTemplates.length}</span> templates</p>
            <div className="flex gap-2">
              <button className="size-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="size-9 flex items-center justify-center rounded-lg bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayedTemplates.map((template) => (
              <div key={template.id} className="group flex flex-col gap-4">
                <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-md transition-all duration-500 hover:shadow-glow group-hover:-translate-y-1`}>
                  {/* Card Content (Logo + Placeholder) */}
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative p-6">
                      <img 
                        src={getLogoForCategory(template.category)} 
                        alt={`${template.name} Template`}
                        className="w-2/3 h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${template.badgeColor.includes('bg-[#') ? '' : template.badgeColor} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border border-white/20 shadow-sm`}
                              style={template.badgeColor.includes('bg-[#') ? { backgroundColor: template.badgeColor.replace('bg-[', '').replace(']', '').split(' ')[0], color: 'white' } : {}}
                        >{template.badge}</span>
                      </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <a href={`/editor?template=${template.id}`} 
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-r from-primary to-purple-600 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2"
                      >
                          <Edit className="w-5 h-5" />
                          Open in Editor
                      </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{template.size} • {template.type}</p>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={loadMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Load More Templates
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
