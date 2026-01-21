'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

export interface FavoriteButtonProps {
  labelId: string
  userId?: string
  className?: string
}

/**
 * FavoriteButton component - toggle favorite status for a label
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  labelId,
  userId,
  className,
}) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    checkFavoriteStatus()
  }, [labelId, userId])

  const checkFavoriteStatus = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('label_id', labelId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (not an error)
        console.error('Check favorite error:', error)
      }

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Check favorite error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId || loading) return

    setLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('label_id', labelId)

        if (error) throw error
        setIsFavorite(false)
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            label_id: labelId,
          })

        if (error) throw error
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Toggle favorite error:', error)
      alert('Failed to update favorite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
      <button
        data-onboarding="favorite-button"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'p-1 rounded-lg transition-colors',
        'hover:bg-gray-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        size={18}
        className={cn(
          'transition-colors',
          isFavorite
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-400 hover:text-yellow-400'
        )}
      />
    </button>
  )
}

export default FavoriteButton

