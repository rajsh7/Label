'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'

interface TemplateFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  sizes: string[]
}

const CATEGORIES = [
  { value: 'product_labels', label: 'Product Labels' },
  { value: 'shipping_labels', label: 'Shipping Labels' },
  { value: 'compliance_labels', label: 'Compliance Labels' },
  { value: 'box_labels', label: 'Box Labels' },
  { value: 'address_labels', label: 'Address Labels' },
  { value: 'name_tags', label: 'Name Tags' },
]

const BRANDS = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'avery', label: 'Avery' },
  { value: 'usps', label: 'USPS' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'dhl', label: 'DHL' },
]

const SIZES = [
  { value: '2x1', label: '2" x 1"' },
  { value: '2x4', label: '2" x 4"' },
  { value: '4x6', label: '4" x 6"' },
  { value: '3x5', label: '3" x 5"' },
  { value: 'fullsheet', label: 'Full Sheet' },
]

export function TemplateFilters({ onFilterChange }: TemplateFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    brands: [],
    sizes: [],
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const toggleFilter = (type: 'categories' | 'brands' | 'sizes', value: string) => {
    const current = filters[type]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilters({ [type]: updated })
  }

  const clearAllFilters = () => {
    const cleared = { search: '', categories: [], brands: [], sizes: [] }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  const activeFilterCount = 
    filters.categories.length + filters.brands.length + filters.sizes.length + (filters.search ? 1 : 0)

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-9 bg-white border-gray-200"
        />
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
          <span className="text-xs font-medium text-blue-700">
            {activeFilterCount} active
          </span>
          <button 
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center"
          >
            Clear
            <X className="h-3 w-3 ml-1" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.categories.includes(cat.value) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleFilter('categories', cat.value)
                }}
              >
                 {filters.categories.includes(cat.value) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={`text-sm ${filters.categories.includes(cat.value) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Brands</h3>
        <div className="space-y-2">
          {BRANDS.map(brand => (
             <label key={brand.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.brands.includes(brand.value) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleFilter('brands', brand.value)
                }}
              >
                 {filters.brands.includes(brand.value) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={`text-sm ${filters.brands.includes(brand.value) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {brand.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Sizes */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Dimensions</h3>
        <div className="space-y-2">
          {SIZES.map(size => (
             <label key={size.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.sizes.includes(size.value) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleFilter('sizes', size.value)
                }}
              >
                 {filters.sizes.includes(size.value) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={`text-sm ${filters.sizes.includes(size.value) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {size.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
