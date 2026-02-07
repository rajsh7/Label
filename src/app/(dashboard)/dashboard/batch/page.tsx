"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from "next/link"

export default function BatchPage() {
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'active' | 'scheduled' | 'archived'>('active')

  useEffect(() => {
    async function fetchBatches() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('batch_jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        setBatches(data || [])
      }
      setLoading(false)
    }
    fetchBatches()
  }, [])

  const filteredBatches = batches.filter(batch => {
    if (filter === 'active') return ['pending', 'processing'].includes(batch.status)
    if (filter === 'scheduled') return batch.status === 'scheduled'
    return batch.status === 'completed' || batch.status === 'failed'
  })

  return (
    <div className="font-display">
      {/* Page Header Area */}
      <div className="flex flex-col gap-8 pb-8 md:pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-4 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
              Label <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Batches</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mt-4 font-medium leading-relaxed">
              Monitor real-time printing progress, analyze success rates, and manage your label production queue.
            </p>
          </div>
          <Link href="/dashboard/batch/new">
            <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Start New Batch
            </button>
          </Link>
        </div>
      </div>

      {/* Filters & Sorting */}
      <section className="flex flex-col gap-8 mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full gap-1">
            <button onClick={() => setFilter('active')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'active' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'bg-transparent text-slate-500 dark:text-slate-400'}`}>Active</button>
            <button onClick={() => setFilter('scheduled')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'scheduled' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'bg-transparent text-slate-500 dark:text-slate-400'}`}>Scheduled</button>
            <button onClick={() => setFilter('archived')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'archived' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'bg-transparent text-slate-500 dark:text-slate-400'}`}>Archived</button>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="material-symbols-outlined icon-outline text-lg">sort</span>
            <span>Sort by: Recent</span>
          </div>
        </div>

        {/* Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(n => <div key={n} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No batches found</h3>
            <p className="text-slate-500 dark:text-slate-400">Start a new batch to see it here.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
          <Link key={batch.id} href={`/dashboard/batch/${batch.id}`} className="block">
            <div className="group bg-white dark:bg-card-dark rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="flex gap-5 mb-6">
                <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-100 dark:border-slate-700">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between py-1 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{batch.name || `Batch #${batch.id.slice(0,8)}`}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">{new Date(batch.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${batch.status === 'completed' ? 'bg-emerald-500' : batch.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${batch.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : batch.status === 'failed' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{batch.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Progress</span>
                  <span>{batch.processed_count || 0}/{batch.total_count || 0}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" style={{ width: `${batch.total_count ? (batch.processed_count / batch.total_count * 100) : 0}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Total</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{batch.total_count || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Success</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{batch.success_count || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Failed</p>
                  <p className="text-base font-bold text-red-500">{batch.failed_count || 0}</p>
                </div>
              </div>
            </div>
          </Link>
          ))}
        </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="mt-12 flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
          <Link className="text-primary font-bold text-sm hover:underline flex items-center gap-1" href="/dashboard/history">
            View All History
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {batches.slice(0, 3).map((batch) => (
          <Link key={batch.id} href={`/dashboard/batch/${batch.id}`} className="block hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 gap-4 last:border-b-0">
              <div className="flex items-center gap-5">
                <div className={`size-12 rounded-full flex items-center justify-center ${batch.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <span className="material-symbols-outlined">{batch.status === 'completed' ? 'check_circle' : 'schedule'}</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{batch.name || `Batch #${batch.id.slice(0,8)}`}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{new Date(batch.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-8 md:gap-12 pl-16 md:pl-0">
                <div className="flex flex-col items-start md:items-end w-24">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Quantity</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{batch.total_count || 0}</span>
                </div>
                <div className="flex flex-col items-start md:items-end w-24">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${batch.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {batch.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
