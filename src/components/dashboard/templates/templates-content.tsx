"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Star,
  StarOff,
  Grid3X3,
  List,
  FileText,
  Clock,
  Trash2,
  Copy
} from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  name: string
  description: string
  elements: any[]
  label_format: string
  category: string
  is_favorite: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

const categoryColors: Record<string, string> = {
  "E-commerce": "bg-purple-500/10 text-purple-500",
  "Shipping": "bg-blue-500/10 text-blue-500",
  "Product": "bg-green-500/10 text-green-500",
  "Custom": "bg-orange-500/10 text-orange-500",
}

export function TemplatesContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setTemplates([])
        return
      }

      const { data, error } = await supabase
        .from('label_designs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        setTemplates([])
        return
      }
      
      // Transform label_designs to template format
      const transformedTemplates = (data || []).map(design => ({
        id: design.id,
        name: design.name,
        description: design.name,
        elements: JSON.parse(design.elements || '[]'),
        label_format: 'Custom',
        category: 'Custom',
        is_favorite: false,
        usage_count: 0,
        created_at: design.created_at,
        updated_at: design.updated_at || design.created_at
      }))
      
      setTemplates(transformedTemplates)
    } catch (error) {
      console.error('Error loading templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = async (id: string) => {
    // Since we're using label_designs table, just update local state
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, is_favorite: !t.is_favorite } : t
    ))
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('label_designs')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const duplicateTemplate = async (template: Template) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('label_designs')
        .insert({
          user_id: user.id,
          name: `${template.name} (Copy)`,
          elements: JSON.stringify(template.elements)
        })

      if (error) throw error
      loadTemplates()
    } catch (error) {
      console.error('Error duplicating template:', error)
    }
  }

  const useTemplate = (template: Template) => {
    // Navigate to editor with template
    router.push(`/dashboard/editor?template=${template.id}`)
  }

  const favoriteTemplates = filteredTemplates.filter((t) => t.is_favorite)
  const otherTemplates = filteredTemplates.filter((t) => !t.is_favorite)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading templates...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage reusable label templates</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => router.push('/dashboard/editor')}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted border-border"
              />
            </div>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {templates.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first template to get started</p>
            <Button onClick={() => router.push('/dashboard/editor')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {favoriteTemplates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <h2 className="text-lg font-medium text-foreground">Favorites</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteTemplate}
                    onDuplicate={duplicateTemplate}
                    onUse={useTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              {favoriteTemplates.length > 0 ? "All Templates" : "Templates"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {otherTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteTemplate}
                  onDuplicate={duplicateTemplate}
                  onUse={useTemplate}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function TemplateCard({ 
  template, 
  onToggleFavorite, 
  onDelete, 
  onDuplicate, 
  onUse 
}: {
  template: Template
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (template: Template) => void
  onUse: (template: Template) => void
}) {
  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(template.id)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              {template.is_favorite ? (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground truncate">{template.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={cn("text-xs", categoryColors[template.category] || categoryColors.Custom)}>
              {template.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{template.label_format}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {template.usage_count} uses
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(template.updated_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 pt-2">
            <Button size="sm" onClick={() => onUse(template)} className="flex-1">
              Use Template
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDuplicate(template)}>
              <Copy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(template.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
