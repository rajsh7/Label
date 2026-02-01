'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'

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
  template_name?: string
  action_type?: string
}

export interface BatchHistoryListProps {
  initialBatches: BatchJob[]
}

export const BatchHistoryList: React.FC<BatchHistoryListProps> = ({
  initialBatches,
}) => {
  const [batches, setBatches] = useState<BatchJob[]>(initialBatches)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGenerationHistory()
  }, [])

  const loadGenerationHistory = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get label generation history
      const { data: labelHistory } = await supabase
        .from('label_designs')
        .select('id, name, created_at, updated_at, print_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      // Transform to batch job format
      const historyItems: BatchJob[] = labelHistory?.map(item => ({
        id: item.id,
        status: 'completed' as const,
        total_labels: 1,
        generated_labels: 1,
        created_at: item.created_at,
        completed_at: item.updated_at,
        template_name: item.name,
        action_type: 'Label Created'
      })) || []

      // Combine with existing batches
      const allHistory = [...initialBatches, ...historyItems]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50)

      setBatches(allHistory)
    } catch (error) {
      console.error('Error loading generation history:', error)
    } finally {
      setLoading(false)
    }
  }
  const getStatusIcon = (status: string, actionType?: string) => {
    if (actionType === 'Label Created') {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (batches.length === 0 && !loading) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No batch jobs yet
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Your batch processing history will appear here. Start by creating your first batch job.
        </p>
        <Button onClick={() => window.location.href = '/dashboard/batch'} className="bg-blue-600 hover:bg-blue-700">
          Create Batch Job
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading history...</span>
        </div>
      )}
      {batches.map((batch) => (
        <div 
          key={batch.id}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(batch.status, batch.action_type)}
              <h3 className="font-semibold text-gray-900 text-lg">
                {batch.action_type || `Batch #${batch.id.slice(0, 8)}`}
              </h3>
              <Badge variant="outline" className="capitalize px-2.5 py-0.5 rounded-full">
                {batch.template_name || batch.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Total Labels</p>
                <p className="font-semibold text-gray-900 text-base">
                  {batch.total_labels}
                </p>
              </div>
              {batch.generated_labels !== undefined && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Generated</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {batch.generated_labels}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Created</p>
                <p className="font-semibold text-gray-900">
                  {format(new Date(batch.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              {batch.completed_at && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Completed</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(batch.completed_at), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>

            {batch.error_message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <FileText className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{batch.error_message}</p>
              </div>
            )}
          </div>

          {batch.status === 'completed' && batch.output_file_url && (
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                className="w-full md:w-auto gap-2 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                onClick={() => handleDownload(batch.output_file_url!)}
              >
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default BatchHistoryList

