'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText } from 'lucide-react'
import { format } from 'date-fns'

export interface BatchJob {
  id: string
  template_id?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  total_labels: number
  generated_labels?: number
  output_file_url?: string
  error_message?: string
  created_at: string
  completed_at?: string
}

export interface BatchHistoryListProps {
  initialBatches: BatchJob[]
}

/**
 * BatchHistoryList component - displays batch processing history
 */
export const BatchHistoryList: React.FC<BatchHistoryListProps> = ({
  initialBatches,
}) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'outline',
    }
    return variants[status] || 'outline'
  }

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (initialBatches.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText size={48} className="mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            No batch jobs yet
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Your batch processing history will appear here
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard/batch'}>
            Create Batch Job
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {initialBatches.map((batch) => (
        <Card key={batch.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    Batch Job #{batch.id.slice(0, 8)}
                  </h3>
                  <Badge variant={getStatusBadge(batch.status)} className="text-xs">
                    {batch.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--color-text-secondary)] mb-1">Total Labels</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {batch.total_labels}
                    </p>
                  </div>
                  {batch.generated_labels !== undefined && (
                    <div>
                      <p className="text-[var(--color-text-secondary)] mb-1">Generated</p>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {batch.generated_labels}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[var(--color-text-secondary)] mb-1">Created</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {format(new Date(batch.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {batch.completed_at && (
                    <div>
                      <p className="text-[var(--color-text-secondary)] mb-1">Completed</p>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {format(new Date(batch.completed_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>

                {batch.error_message && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{batch.error_message}</p>
                  </div>
                )}
              </div>

              {batch.status === 'completed' && batch.output_file_url && (
                <Button
                  variant="primary"
                  onClick={() => handleDownload(batch.output_file_url!)}
                >
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BatchHistoryList

