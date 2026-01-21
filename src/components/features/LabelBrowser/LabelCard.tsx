'use client'

import React from 'react'
import { Label } from '@/lib/constants/labels'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { FavoriteButton } from './FavoriteButton'

export interface LabelCardProps {
  label: Label
  userId?: string
  onSelect: (label: Label) => void
  className?: string
}

/**
 * LabelCard component - displays a single label in the browser
 * Shows thumbnail, name, dimensions, category, and print method
 */
export const LabelCard: React.FC<LabelCardProps> = ({
  label,
  userId,
  onSelect,
  className,
}) => {
  const handleCardClick = () => {
    onSelect(label)
  }

  const formatDimensions = () => {
    if (label.width_mm && label.height_mm) {
      return `${label.width_mm}x${label.height_mm} mm`
    }
    return 'N/A'
  }

  const formatDimensionsInch = () => {
    if (label.width_inch && label.height_inch) {
      return `(${label.width_inch}x${label.height_inch} in)`
    }
    return ''
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      amazon_fba: 'bg-blue-100 text-blue-700',
      walmart_fwa: 'bg-green-100 text-green-700',
      ebay: 'bg-purple-100 text-purple-700',
      shopify: 'bg-orange-100 text-orange-700',
      etsy: 'bg-pink-100 text-pink-700',
      shipping: 'bg-gray-100 text-gray-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getPrintMethodBadge = (method: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      thermal: 'default',
      inkjet: 'secondary',
      desktop: 'outline',
    }
    return variants[method] || 'default'
  }

  const displayName = label.name.length > 30 ? `${label.name.substring(0, 30)}...` : label.name

  return (
    <Card
      data-onboarding="label-card"
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent>
        {/* Thumbnail placeholder */}
        <div className="w-full h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium">
              {label.width_mm} × {label.height_mm}
            </div>
            <div className="text-xs text-gray-400">mm</div>
          </div>
        </div>

        {/* Label Name */}
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 text-sm line-clamp-2">
          {displayName}
        </h3>

        {/* Dimensions */}
        <p className="text-xs text-[var(--color-text-secondary)] mb-3">
          {formatDimensions()} {formatDimensionsInch()}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="default" className={cn('text-xs', getCategoryColor(label.category))}>
            {label.category.replace('_', ' ').toUpperCase()}
          </Badge>
          {label.print_method && (
            <Badge variant={getPrintMethodBadge(label.print_method)} className="text-xs">
              {label.print_method}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(label)
            }}
          >
            Select
          </Button>
          {userId && (
            <FavoriteButton labelId={label.id} userId={userId} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LabelCard

