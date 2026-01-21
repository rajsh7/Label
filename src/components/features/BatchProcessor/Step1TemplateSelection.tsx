'use client'

import React, { useEffect, useState } from 'react'
import { getUserDesigns } from '@/server/actions/designs'
import { Button } from '@/components/ui/button'

export interface Step1TemplateSelectionProps {
  selectedTemplateId: string | null
  onSelect: (templateId: string) => void
}

/**
 * Step 1: Template Selection
 * User selects a saved design/template to use for batch processing
 */
export const Step1TemplateSelection: React.FC<Step1TemplateSelectionProps> = ({
  selectedTemplateId,
  onSelect,
}) => {
  const [designs, setDesigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getUserDesigns()
      if (result.success && result.data) {
        // Filter for templates or all designs
        const templates = result.data.filter((d: any) => d.is_template || true) // Show all for now
        setDesigns(templates)
      } else {
        setError(result.error || 'Failed to load designs')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load designs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadDesigns}>Retry</Button>
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No designs found. Please create a design first.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/editor'}>
          Create Design
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Select a Design Template
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a saved design to use as a template for batch processing
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <div
            key={design.id}
            className={`cursor-pointer transition-all p-4 border border-border rounded-lg bg-card ${
              selectedTemplateId === design.id
                ? 'ring-2 ring-accent border-accent'
                : 'hover:shadow-md hover:border-accent/50'
            }`}
            onClick={() => onSelect(design.id)}
          >
            <div className="mb-3">
              <h3 className="font-semibold mb-1 text-foreground">
                {design.name}
              </h3>
              {design.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {design.description}
                </p>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {design.is_template && (
                <span className="inline-block px-2 py-1 bg-accent/10 text-accent rounded">
                  Template
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Step1TemplateSelection

