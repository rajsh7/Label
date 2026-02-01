'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LabelEditor } from '@/components/features/LabelEditor/LabelEditor'
import { useEditorStore } from '@/lib/store/editorStore'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

/**
 * Advanced Template Editor Page
 * Loads and edits templates with EditorElement structures
 */
export default function AdvancedEditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadTemplate = (useEditorStore.getState() as any).loadTemplate

  useEffect(() => {
    const templateId = searchParams.get('template')
    
    if (!templateId) {
      // No template ID - initialize with a default label from database
      initializeCustomLabel()
      return
    }

    loadTemplateData(templateId)
  }, [searchParams])

  const initializeCustomLabel = async () => {
    try {
      setLoading(true)
      
      // Fetch any label from database to use as base
      const { data: labels, error } = await supabase
        .from('labels')
        .select('*')
        .limit(1)
        .single()
      
      if (error || !labels) {
        console.error('Error fetching default label:', error)
        // Fallback to a hardcoded known label ID
        const fallbackLabel = {
          id: 'usps_004',
          name: 'Custom Label',
          width_px_203dpi: 700,
          height_px_203dpi: 200,
          width_px_300dpi: 700,
          height_px_300dpi: 200,
        }
        
        const emptyTemplate = {
          id: null,
          name: 'New Design',
          elements: [],
        }
        
        loadTemplate(emptyTemplate, fallbackLabel)
      } else {
        // Use fetched label but customize dimensions
        const customLabel = {
          ...labels,
          name: 'Custom Label',
          width_px_203dpi: 700,
          height_px_203dpi: 200,
          width_px_300dpi: 700,
          height_px_300dpi: 200,
        }
        
        const emptyTemplate = {
          id: null,
          name: 'New Design',
          elements: [],
        }
        
        loadTemplate(emptyTemplate, customLabel)
      }
    } catch (err) {
      console.error('Error initializing custom label:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplateData = async (templateId: string) => {
    try {
      setLoading(true)
      setError(null)

      // First try to fetch from user's label_designs
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userDesign } = await supabase
          .from('label_designs')
          .select('*')
          .eq('id', templateId)
          .eq('user_id', user.id)
          .single()

        if (userDesign) {
          // Use a default label for user designs
          const defaultLabel = {
            id: 'custom',
            name: 'Custom Label',
            width_px_203dpi: userDesign.width_px || 700,
            height_px_203dpi: userDesign.height_px || 200,
            width_px_300dpi: userDesign.width_px || 700,
            height_px_300dpi: userDesign.height_px || 200,
          }
          
          loadTemplate(userDesign, defaultLabel)
          return
        }
      }

      // Fallback to public templates
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError || !template) {
        throw new Error('Template not found')
      }

      // Use default label for templates without label_base_id
      let label
      if (template.label_base_id) {
        const { data: labelData } = await supabase
          .from('labels')
          .select('*')
          .eq('id', template.label_base_id)
          .single()
        label = labelData
      }
      
      if (!label) {
        label = {
          id: 'custom',
          name: 'Custom Label',
          width_px_203dpi: 700,
          height_px_203dpi: 200,
          width_px_300dpi: 700,
          height_px_300dpi: 200,
        }
      }

      loadTemplate(template, label)
    } catch (err: any) {
      console.error('Error loading template:', err)
      setError(err.message || 'Failed to load template')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg-secondary)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary-500)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg-secondary)]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Failed to Load Template
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/templates')}
            className="px-6 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return <LabelEditor />
}
