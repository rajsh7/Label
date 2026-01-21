'use client'

import React from 'react'
import { LabelFilters } from '@/lib/hooks/useLabels'
import { getCategories, getMarketplaces } from '@/lib/constants/labels'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

export interface LabelFilterProps {
  filters: LabelFilters
  onFiltersChange: (filters: LabelFilters) => void
  onClearFilters: () => void
  className?: string
}

/**
 * LabelFilter component - sidebar filter panel
 * Allows filtering by category, marketplace, print method, and DPI
 */
export const LabelFilter: React.FC<LabelFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}) => {
  const categories = getCategories()
  const marketplaces = getMarketplaces()
  const printMethods: Array<'thermal' | 'inkjet' | 'desktop'> = ['thermal', 'inkjet', 'desktop']
  const dpiOptions = ['203', '300', 'all'] as const

  const toggleCategory = (category: string) => {
    const current = filters.categories || []
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category]
    onFiltersChange({ ...filters, categories: updated.length > 0 ? updated : undefined })
  }

  const toggleMarketplace = (marketplace: string) => {
    const current = filters.marketplaces || []
    const updated = current.includes(marketplace)
      ? current.filter((m) => m !== marketplace)
      : [...current, marketplace]
    onFiltersChange({ ...filters, marketplaces: updated.length > 0 ? updated : undefined })
  }

  const togglePrintMethod = (method: 'thermal' | 'inkjet' | 'desktop') => {
    const current = filters.printMethods || []
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method]
    onFiltersChange({ ...filters, printMethods: updated.length > 0 ? updated : undefined })
  }

  const setDpi = (dpi: '203' | '300' | 'all') => {
    onFiltersChange({ ...filters, dpi: dpi === 'all' ? undefined : dpi })
  }

  const activeFilterCount =
    (filters.categories?.length || 0) +
    (filters.marketplaces?.length || 0) +
    (filters.printMethods?.length || 0) +
    (filters.dpi && filters.dpi !== 'all' ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {activeFilterCount} active
          </Badge>
        </div>
      )}

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = filters.categories?.includes(category)
            return (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
                />
                <span
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]',
                    isSelected && 'text-[var(--color-text-primary)] font-medium'
                  )}
                >
                  {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Marketplace Filter */}
      {marketplaces.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Marketplace
          </h4>
          <div className="space-y-2">
            {marketplaces.map((marketplace) => {
              const isSelected = filters.marketplaces?.includes(marketplace)
              return (
                <label
                  key={marketplace}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMarketplace(marketplace)}
                    className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
                  />
                  <span
                    className={cn(
                      'text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]',
                      isSelected && 'text-[var(--color-text-primary)] font-medium'
                    )}
                  >
                    {marketplace}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Print Method Filter */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Print Method
        </h4>
        <div className="space-y-2">
          {printMethods.map((method) => {
            const isSelected = filters.printMethods?.includes(method)
            return (
              <label
                key={method}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePrintMethod(method)}
                  className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
                />
                <span
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] capitalize',
                    isSelected && 'text-[var(--color-text-primary)] font-medium'
                  )}
                >
                  {method}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* DPI Filter */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          DPI
        </h4>
        <div className="space-y-2">
          {dpiOptions.map((dpi) => {
            const isSelected = filters.dpi === dpi || (dpi === 'all' && !filters.dpi)
            return (
              <label
                key={dpi}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="dpi"
                  checked={isSelected}
                  onChange={() => setDpi(dpi)}
                  className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 focus:ring-[var(--color-primary-500)]"
                />
                <span
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]',
                    isSelected && 'text-[var(--color-text-primary)] font-medium'
                  )}
                >
                  {dpi === 'all' ? 'All DPIs' : `${dpi} DPI`}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LabelFilter

