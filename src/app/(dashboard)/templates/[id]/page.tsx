import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'

interface TemplatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !template) {
    redirect('/dashboard/templates')
  }

  const isOwner = template.user_id === session.user.id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={18} />
          Back to Templates
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {template.name}
              </h1>
              {template.is_public && (
                <Badge variant="default" className="text-xs">
                  Public
                </Badge>
              )}
              {!template.is_public && isOwner && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
            {template.description && (
              <p className="text-muted-foreground mb-4">{template.description}</p>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/editor?templateId=${template.id}`}>
                <Button variant="outline">
                  <Edit size={18} className="mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Template preview coming soon</p>
      </div>
    </div>
  )
}