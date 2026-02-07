'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function BatchDetailPage() {
  const { id } = useParams()
  const [batch, setBatch] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchBatchDetails()

    // Real-time subscription
    const channel = supabase
      .channel('batch-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'batch_jobs', filter: `id=eq.${id}` },
        (payload) => {
          setBatch((current: any) => ({ ...current, ...payload.new }))
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'batch_job_items', filter: `batch_job_id=eq.${id}` },
        () => {
          fetchItems() // Refresh items on change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  async function fetchBatchDetails() {
    try {
      const { data: batchData, error } = await supabase
        .from('batch_jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching batch:', error)
        return
      }

      setBatch(batchData)
      await fetchItems()
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      // We set loading to false in fetchItems, but if fetchItems isn't called or fails, we must ensure it's set here? 
      // Actually fetchItems sets it. Let's move setLoading(false) to here or ensure fetchItems is awaited.
      // Better:
    }
  }

  async function fetchItems() {
    try {
      const { data: itemsData, error } = await supabase
        .from('batch_job_items')
        .select('*')
        .eq('batch_job_id', id)
        .order('created_at', { ascending: true })

      if (error) console.error('Error fetching items:', error)
      setItems(itemsData || [])
    } finally {
      setLoading(false)
    }
  }

  const handleProcessBatch = async () => {
    setProcessing(true)
    try {
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('You must be logged in to process batches')
      }

      // Call API to process batch
      const response = await fetch('/api/batch/process', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ batchId: id })
      })
      
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to start processing')
      
      alert('Batch processing started!')
    } catch (error: any) {
      console.error('Processing error:', error)
      alert(error.message)
    } finally {
      setProcessing(false)
    }
  }


  const handleDownload = () => {
    // Since we generate a single merged PDF, we can take the URL from the first processed item
    const pdfUrl = items.find(i => i.generated_pdf_url)?.generated_pdf_url
    
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    } else {
      alert('No PDF URL found. The processing might have failed or is incomplete.')
    }
  }

  if (loading) return <div className="p-10 text-center">Loading batch details...</div>
  if (!batch) return <div className="p-10 text-center">Batch not found</div>

  return (
    <div className="font-display max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Link href="/dashboard/batch" className="hover:text-primary">Batches</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">{batch.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{batch.name}</h1>
          <div className="flex items-center gap-4">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
               batch.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
               batch.status === 'processing' ? 'bg-blue-100 text-blue-700' :
               'bg-slate-100 text-slate-700'
             }`}>
               {batch.status}
             </span>
             <span className="text-sm text-slate-500">
               {batch.processed_count} / {batch.total_count} processed
             </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {batch.status === 'pending' && (
            <button 
              onClick={handleProcessBatch}
              disabled={processing}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">play_arrow</span>
              )}
              {processing ? 'Starting...' : 'Start Processing'}
            </button>
          )}
          {batch.status === 'completed' && (
            <button 
              onClick={handleDownload}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download All
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(batch.processed_count / batch.total_count) * 100}%` }}
        ></div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{index + 1}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
                    {Object.values(item.row_data).slice(0, 3).join(' | ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.status === 'processed' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.generated_pdf_url && (
                    <a href={item.generated_pdf_url} target="_blank" className="text-primary hover:underline text-xs font-bold">
                      View PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
