'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Download, Star, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export interface Template {
  id: string
  name: string
  description?: string
  label_base_id: string
  thumbnail_url?: string
  is_public: boolean
  downloads: number
  rating?: number
  created_at: string
  labels?: {
    name: string
    category: string
  }
  profiles?: {
    full_name?: string
  }
}

export interface TemplatesListProps {
  userTemplates: Template[]
  publicTemplates: Template[]
}

/**
 * TemplatesList component - displays user and public templates
 */
export const TemplatesList: React.FC<TemplatesListProps> = ({
  userTemplates,
  publicTemplates,
}) => {
  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete template')
      }
    } catch (error) {
      console.error('Delete template error:', error)
      alert('An error occurred')
    }
  }

  const handleDownload = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/download`, {
        method: 'POST',
      })

      if (response.ok) {
        // Increment download count (handled by API)
        window.location.reload()
      } else {
        alert('Failed to download template')
      }
    } catch (error) {
      console.error('Download template error:', error)
      alert('An error occurred')
    }
  }

  const renderTemplateCard = (template: Template, isOwn: boolean = false) => (
    <Card key={template.id}>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {template.thumbnail_url ? (
            <img
              src={template.thumbnail_url}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[var(--color-text-tertiary)]">No preview</div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
            {template.name}
          </h3>
          {template.description && (
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">
              {template.description}
            </p>
          )}
          {template.labels && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <span className="capitalize">{template.labels.category}</span>
              <span>•</span>
              <span>{template.labels.name}</span>
            </div>
          )}
          {!isOwn && template.profiles?.full_name && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              by {template.profiles.full_name}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-secondary)]">
            <span>{template.downloads} downloads</span>
            {template.rating && (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{template.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/editor?template=${template.id}`}
            className="flex-1"
          >
            <Button variant="primary" size="sm" className="w-full">
              Use Template
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(template.id)}
          >
            <Download size={16} />
          </Button>
          {isOwn && (
            <>
              <Link href={`/editor?template=${template.id}&edit=true`}>
                <Button variant="outline" size="sm">
                  <Edit size={16} />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(template.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="my-templates">
      <TabsList>
        <TabsTrigger value="my-templates">
          My Templates ({userTemplates.length})
        </TabsTrigger>
        <TabsTrigger value="public-templates">
          Public Templates ({publicTemplates.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-templates">
        {userTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-[var(--color-text-secondary)] mb-4">
                You haven't created any templates yet.
              </p>
              <Link href="/editor">
                <Button variant="primary">Create Your First Template</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {userTemplates.map((template) => renderTemplateCard(template, true))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="public-templates">
        {publicTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-[var(--color-text-secondary)]">
                No public templates available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {publicTemplates.map((template) => renderTemplateCard(template, false))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default TemplatesList

