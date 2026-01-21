import { redirect, notFound } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Download, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface BatchDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { id } = await params
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get batch job details
  const { data: batchJob, error } = await supabase
    .from('batch_jobs')
    .select('*, templates(name), labels(name, category)')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !batchJob) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />
      case 'failed':
        return <XCircle className="text-red-600" size={20} />
      case 'processing':
        return <RefreshCw className="text-yellow-600 animate-spin" size={20} />
      case 'pending':
        return <Clock className="text-blue-600" size={20} />
      default:
        return <AlertCircle className="text-gray-600" size={20} />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'outline',
    }
    return variants[status] || 'outline'
  }

  const template = batchJob.templates
  const label = batchJob.labels

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/batch/history"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4"
        >
          <ArrowLeft size={18} />
          Back to Batch History
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Batch Job #{batchJob.id.slice(0, 8)}
              </h1>
              <Badge variant={getStatusBadge(batchJob.status)} className="text-xs">
                {getStatusIcon(batchJob.status)}
                <span className="ml-1 capitalize">{batchJob.status}</span>
              </Badge>
            </div>
            <p className="text-[var(--color-text-secondary)]">
              Created {format(new Date(batchJob.created_at), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
          {batchJob.status === 'completed' && batchJob.file_path && (
            <Link href={`/api/batch/${batchJob.id}/download`}>
              <Button variant="primary">
                <Download size={18} className="mr-2" />
                Download PDF
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Status</span>
                  <Badge variant={getStatusBadge(batchJob.status)}>
                    {getStatusIcon(batchJob.status)}
                    <span className="ml-1 capitalize">{batchJob.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Labels</span>
                  <span className="font-semibold">{batchJob.total_labels || 0}</span>
                </div>
                {batchJob.status === 'processing' && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Generated</span>
                    <span className="font-semibold">
                      {batchJob.generated_labels || 0} / {batchJob.total_labels || 0}
                    </span>
                  </div>
                )}
                {batchJob.status === 'completed' && batchJob.completed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Completed</span>
                    <span>{format(new Date(batchJob.completed_at), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {batchJob.status === 'failed' && batchJob.error_message && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--color-error-500)]">Error Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{batchJob.error_message}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Information */}
          {template && typeof template === 'object' && 'name' in template && (
            <Card>
              <CardHeader>
                <CardTitle>Template Used</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{template.name}</p>
                {label && typeof label === 'object' && 'name' in label && (
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Label: {label.name}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Job ID
                  </p>
                  <p className="text-sm font-mono break-all">{batchJob.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Created
                  </p>
                  <p className="text-sm">
                    {format(new Date(batchJob.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                {batchJob.completed_at && (
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Completed
                    </p>
                    <p className="text-sm">
                      {format(new Date(batchJob.completed_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                {batchJob.file_path && (
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Output File
                    </p>
                    <p className="text-sm font-mono break-all text-xs">{batchJob.file_path}</p>
                  </div>
                )}
              </div>

              {batchJob.status === 'completed' && batchJob.file_path && (
                <div className="mt-6 pt-6 border-t border-[var(--color-border-primary)]">
                  <Link href={`/api/batch/${batchJob.id}/download`} className="block w-full">
                    <Button variant="primary" className="w-full">
                      <Download size={18} className="mr-2" />
                      Download PDF
                    </Button>
                  </Link>
                </div>
              )}

              {batchJob.status === 'failed' && (
                <div className="mt-6 pt-6 border-t border-[var(--color-border-primary)]">
                  <Link href="/batch" className="block w-full">
                    <Button variant="primary" className="w-full">
                      <RefreshCw size={18} className="mr-2" />
                      Create New Batch
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}