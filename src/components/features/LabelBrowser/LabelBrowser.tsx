'use client'

import React, { useState, useEffect } from 'react'
import { useLabels } from '@/lib/hooks/useLabels'
import { Label } from '@/lib/constants/labels'
import { LabelCard } from './LabelCard'
import { LabelFilter } from './LabelFilter'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'

export interface LabelBrowserProps {
  onLabelSelect?: (label: Label) => void
  className?: string
}

/**
 * LabelBrowser component - main component for browsing and selecting labels
 * Includes search, filters, and grid display
 */
export const LabelBrowser: React.FC<LabelBrowserProps> = ({
  onLabelSelect,
  className,
}) => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { filteredLabels, loading, error, totalCount, hasMore, loadMore, filters, setFilters, clearFilters } = useLabels()

  const handleLabelSelect = (label: Label) => {
    if (onLabelSelect) {
      onLabelSelect(label)
    } else {
      // Default: navigate to editor with label selected
      // Editor route works from both marketing and dashboard contexts
      router.push(`/editor?labelId=${label.id}`)
    }
  }

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleClearSearch = () => {
    setFilters({ ...filters, search: undefined })
  }

  // Get current user ID for favorites
  const [userId, setUserId] = useState<string | undefined>()
  
  useEffect(() => {
    // Get user ID from Supabase session
    import('@/lib/supabase/client').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUserId(data.user?.id)
      })
    })
  }, [])

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-6', className)}>
      {/* Sidebar Filter - Desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-4">
          <LabelFilter
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setSidebarOpen(true)}
          className="rounded-full shadow-lg"
        >
          <Search size={20} />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-modal-bg"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
            <LabelFilter
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="search"
              placeholder="Search labels by name, category, or marketplace..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {filters.search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Showing <strong>{filteredLabels.length}</strong> of <strong>{totalCount}</strong> labels
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLabels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-[var(--color-text-secondary)] mb-2">
              No labels match your filters
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Labels Grid */}
        {!loading && filteredLabels.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLabels.map((label) => (
                <LabelCard
                  key={label.id}
                  label={label}
                  userId={userId}
                  onSelect={handleLabelSelect}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={loadMore}>
                  Load More Labels
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default LabelBrowser

