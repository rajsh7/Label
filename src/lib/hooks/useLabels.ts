'use client'

import { useState, useEffect, useMemo } from 'react'
import { Label, ALL_LABELS, searchLabels, getLabelsByCategory, getLabelsByMarketplace, getLabelsByPrintMethod } from '@/lib/constants/labels'

export interface LabelFilters {
  search?: string
  categories?: string[]
  marketplaces?: string[]
  printMethods?: string[]
  dpi?: '203' | '300' | 'all'
}

export interface UseLabelsReturn {
  labels: Label[]
  filteredLabels: Label[]
  loading: boolean
  error: Error | null
  totalCount: number
  hasMore: boolean
  loadMore: () => void
  filters: LabelFilters
  setFilters: (filters: LabelFilters) => void
  clearFilters: () => void
}

const ITEMS_PER_PAGE = 20

/**
 * Hook for managing label data with search and filters
 * Supports pagination and caching
 */
export function useLabels(initialFilters?: LabelFilters): UseLabelsReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFiltersState] = useState<LabelFilters>(initialFilters || {})

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || '')
    }, 300)

    return () => clearTimeout(timer)
  }, [filters.search])

  // Filter labels based on current filters
  const filteredLabels = useMemo(() => {
    setLoading(true)
    try {
      let results = ALL_LABELS

      // Apply search
      if (debouncedSearch) {
        results = searchLabels(debouncedSearch)
      }

      // Apply category filter
      if (filters.categories && filters.categories.length > 0) {
        const categoryResults: Label[] = []
        filters.categories.forEach((category) => {
          categoryResults.push(...getLabelsByCategory(category))
        })
        results = results.filter((label) => categoryResults.includes(label))
      }

      // Apply marketplace filter
      if (filters.marketplaces && filters.marketplaces.length > 0) {
        const marketplaceResults: Label[] = []
        filters.marketplaces.forEach((marketplace) => {
          marketplaceResults.push(...getLabelsByMarketplace(marketplace))
        })
        results = results.filter((label) => marketplaceResults.includes(label))
      }

      // Apply print method filter
      if (filters.printMethods && filters.printMethods.length > 0) {
        const printMethodResults: Label[] = []
        filters.printMethods.forEach((method) => {
          printMethodResults.push(...getLabelsByPrintMethod(method))
        })
        results = results.filter((label) => printMethodResults.includes(label))
      }

      // Apply DPI filter (if specified, filter by availability of that DPI)
      if (filters.dpi && filters.dpi !== 'all') {
        results = results.filter((label) => {
          if (filters.dpi === '203') {
            return label.width_px_203dpi && label.height_px_203dpi
          } else if (filters.dpi === '300') {
            return label.width_px_300dpi && label.height_px_300dpi
          }
          return true
        })
      }

      // Remove duplicates
      results = Array.from(new Map(results.map((label) => [label.id, label])).values())

      setLoading(false)
      return results
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to filter labels'))
      setLoading(false)
      return []
    }
  }, [debouncedSearch, filters.categories, filters.marketplaces, filters.printMethods, filters.dpi])

  // Get paginated results
  const paginatedLabels = useMemo(() => {
    return filteredLabels.slice(0, page * ITEMS_PER_PAGE)
  }, [filteredLabels, page])

  const setFilters = (newFilters: LabelFilters) => {
    setFiltersState(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFiltersState({})
    setPage(1)
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  const hasMore = paginatedLabels.length < filteredLabels.length

  // Cache in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('labelFilters', JSON.stringify(filters))
    } catch (err) {
      // Ignore localStorage errors
    }
  }, [filters])

  return {
    labels: ALL_LABELS,
    filteredLabels: paginatedLabels,
    loading,
    error,
    totalCount: filteredLabels.length,
    hasMore,
    loadMore,
    filters,
    setFilters,
    clearFilters,
  }
}

