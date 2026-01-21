'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface SaveDesignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, description: string, isTemplate: boolean) => Promise<void>
  initialName?: string
  initialDescription?: string
  isUpdate?: boolean
  loading?: boolean
}

/**
 * SaveDesignModal - Modal for saving designs
 */
export const SaveDesignModal: React.FC<SaveDesignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
  isUpdate = false,
  loading = false,
}) => {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [isTemplate, setIsTemplate] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  React.useEffect(() => {
    if (isOpen) {
      setName(initialName)
      setDescription(initialDescription)
      setErrors({})
    }
  }, [isOpen, initialName, initialDescription])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Design name is required'
    } else if (name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      newErrors.name = 'Name can only contain letters, numbers, spaces, hyphens, and underscores'
    }

    if (description && description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      await onSave(name.trim(), description.trim(), isTemplate)
      onClose()
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save design' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal-bg bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {isUpdate ? 'Update Design' : 'Save Design'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Design Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              placeholder="My Label Design"
              required
              disabled={loading}
              maxLength={100}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-gray-700)] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              placeholder="Add a description for this design..."
              className={cn(
                'w-full px-3 py-2 rounded-md border',
                'border-[var(--color-border-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
                'text-sm',
                errors.description && 'border-[var(--color-error-500)]'
              )}
              rows={3}
              maxLength={500}
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-[var(--color-error-500)]">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {description.length}/500 characters
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isTemplate}
              onChange={(e) => setIsTemplate(e.target.checked)}
              className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
              disabled={loading}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              Save as template (can be reused for batch processing)
            </span>
          </label>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
              loading={loading}
            >
              {isUpdate ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaveDesignModal

