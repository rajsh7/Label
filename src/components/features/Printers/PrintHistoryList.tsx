'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Clock, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'

export interface PrintHistoryItem {
  id: string
  design_id: string | null
  printer_id: string | null
  batch_job_id: string | null
  quantity: number
  printed_at: string
  status: 'success' | 'failed' | 'pending'
  printer_name?: string
  design_name?: string
}

/**
 * PrintHistoryList component - displays user's print history
 */
export const PrintHistoryList: React.FC = () => {
  const [printHistory, setPrintHistory] = useState<PrintHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  useEffect(() => {
    loadPrintHistory()
  }, [filter])

  const loadPrintHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('print_history')
        .select(`
          *,
          printers!print_history_printer_id_fkey(name),
          label_designs!print_history_design_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('printed_at', { ascending: false })
        .limit(100)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        design_id: item.design_id,
        printer_id: item.printer_id,
        batch_job_id: item.batch_job_id,
        quantity: item.quantity,
        printed_at: item.printed_at,
        status: item.status,
        printer_name: item.printers?.name || 'Unknown Printer',
        design_name: item.label_designs?.name || 'Unknown Design',
      }))

      setPrintHistory(formattedData)
    } catch (err) {
      console.error('Load print history error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load print history')
    } finally {
      setLoading(false)
    }
  }

  const handleReprint = async (item: PrintHistoryItem) => {
    // Navigate to editor with the design, or trigger print directly
    if (item.design_id) {
      window.location.href = `/editor?design=${item.design_id}&print=true`
    } else if (item.batch_job_id) {
      // Handle batch reprint
      window.location.href = `/batch/history?job=${item.batch_job_id}&reprint=true`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (printHistory.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Printer size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-[var(--color-text-secondary)]">
            No print history found. Your print jobs will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'success' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('success')}
        >
          Success
        </Button>
        <Button
          variant={filter === 'failed' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('failed')}
        >
          Failed
        </Button>
      </div>

      {/* Print History List */}
      <div className="space-y-3">
        {printHistory.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'success'
                        ? 'bg-green-100 text-green-600'
                        : item.status === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {item.status === 'success' ? (
                      <Printer size={20} />
                    ) : item.status === 'failed' ? (
                      <X size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {item.design_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-1">
                      <span>{item.printer_name}</span>
                      <span>•</span>
                      <span>{item.quantity} label{item.quantity !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{format(new Date(item.printed_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'success' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReprint(item)}
                    >
                      <Printer size={16} className="mr-2" />
                      Re-print
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PrintHistoryList

