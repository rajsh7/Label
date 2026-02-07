'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, Plus, History, LayoutGrid, Tag } from 'lucide-react'
import templatesData from '@/data/templates.json'
import { DashboardFooter } from './dashboard-footer'

const brandLogosMap: Record<string, string> = {
  amazon: '/amazon-logo.png',
  ebay: '/ebay-logo-display.png',
  shopify: '/shopify-logo.png',
  etsy: '/etsy-logo.png',
  walmart: '/walmart-logo.png',
  usps: '/usps-logo.png',
  fedex: '/fedex-label.png',
  ups: '/ups-label.png'
}

export function DashboardOverview() {
  const [recentTemplates, setRecentTemplates] = useState<any[]>([])
  const [savedDesigns, setSavedDesigns] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Flatten templates if needed
      const allTemplates = Array.isArray(templatesData) ? templatesData : Object.values(templatesData).flat()
      
      // Get L1 templates (one for each top brand)
      const topBrands = ['amazon', 'ebay', 'shopify', 'etsy', 'fedex', 'ups', 'usps', 'dhl']
      const brandTemplates = topBrands.map(brand => 
        allTemplates.find((t: any) => t.category?.toLowerCase() === brand)
      ).filter(Boolean)
      
      setRecentTemplates(brandTemplates)

      const [designsRes, batchesRes] = await Promise.all([
        supabase.from('label_designs').select('*').eq('user_id', user.id).is('deleted_at', null).order('updated_at', { ascending: false }).limit(10),
        supabase.from('batch_jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ])

      setSavedDesigns(designsRes.data || [])
      setBatches(batchesRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-16 min-h-screen">
      <section className="flex flex-col gap-6 pt-8">
        <div className="flex flex-col gap-2 animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#590df2] to-purple-400">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mt-4 font-medium">
            Manage your labels, designs, and batch jobs all in one place.
          </p>
        </div>
      </section>

      {/* Brand Templates Grid */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutGrid className="size-5" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Brand Templates</h2>
              <p className="text-slate-500 dark:text-slate-400">Popular templates from top marketplaces</p>
            </div>
          </div>
          <Link href="/dashboard/templates" className="flex items-center gap-1 text-primary font-bold text-sm hover:underline translate-y-[-4px]">
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(n => <div key={n} className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentTemplates.map((template) => {
              const logo = brandLogosMap[template.category?.toLowerCase()] || '/Generic.png'
              
              return (
                <Link key={template.id} href={`/dashboard/editor?template=${template.id}`}>
                  <div className="group bg-white dark:bg-[#1e162e] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="aspect-[3/2] bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <img src={logo} alt={template.category} className="w-16 h-16 object-contain z-10 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{template.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{template.category} • {template.size}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recently Used & Saved Designs */}
        <div className="xl:col-span-2 space-y-16">
          {/* Recently Used */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <History className="size-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Recently Used</h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(n => <div key={n} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
              </div>
            ) : savedDesigns.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 mb-2">Your recent designs will appear here</p>
                <Link href="/dashboard/templates" className="text-primary font-bold hover:underline">Start a new project</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedDesigns.slice(0, 4).map((design) => {
                  const allTemplates = Array.isArray(templatesData) ? templatesData : Object.values(templatesData).flat()
                  const template = allTemplates.find((t: any) => t.id === design.label_base_id)
                  const category = template?.category?.toLowerCase() || 'other'
                  const logo = brandLogosMap[category] || '/Generic.png'

                  return (
                    <Link key={design.id} href={`/dashboard/editor?template=${design.id}`}>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1e162e] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                          <img src={logo} alt={category} className="w-full h-full object-contain opacity-80 group-hover:opacity-100" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{design.name || 'Untitled'}</h4>
                          <p className="text-xs text-slate-500">{new Date(design.updated_at).toLocaleDateString()}</p>
                        </div>
                        <ArrowRight className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* Saved Designs */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Tag className="size-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Saved Labels</h2>
              </div>
              <Link href="/dashboard/labels" className="text-slate-400 font-bold text-sm hover:text-primary hover:underline transition-colors">View Library</Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1,2].map(n => <div key={n} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
              </div>
            ) : savedDesigns.length === 0 ? (
              <div className="py-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center px-6">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-3">
                  <Plus className="size-6" />
                </div>
                <p className="text-slate-500 font-medium mb-4">You haven't saved any custom designs yet.</p>
                <Link href="/dashboard/templates">
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl text-sm font-bold">New Design</button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedDesigns.slice(0, 4).map((design) => (
                  <Link key={design.id} href={`/dashboard/editor?template=${design.id}`}>
                    <div className="bg-white dark:bg-[#1e162e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all relative group overflow-hidden">
                      <div className="flex items-start justify-between mb-4">
                        <div className="size-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-400">label</span>
                        </div>
                        <button className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1">{design.name || 'Untitled'}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>4" x 6"</span>
                        <span>•</span>
                        <span>Modified {new Date(design.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recent Batches Sidebar */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Batches</h2>
              <Link href="/dashboard/batch" className="text-primary font-bold text-sm hover:underline hover:text-purple-600 transition-colors">All Jobs</Link>
            </div>
            
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1,2,3].map(n => <div key={n} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
              </div>
            ) : batches.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 mb-2 font-medium text-sm">No batch jobs yet</p>
                <Link href="/dashboard/batch" className="text-primary text-sm font-bold hover:underline">Start Processing</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {batches.map((batch) => (
                  <Link key={batch.id} href={`/dashboard/batch/${batch.id}`}>
                    <div className="bg-white dark:bg-[#1e162e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                          <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-primary transition-colors">inventory_2</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{batch.name || `Batch #${batch.id.slice(0,8)}`}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{batch.total_count || 0} ITEMS • {new Date(batch.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${batch.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {batch.status}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* New Project CTA */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full translate-x-12 translate-y-[-12px] group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Ready to ship?</h3>
              <p className="text-white/80 text-sm mb-6 font-medium">Create a new design or start a batch job in seconds.</p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/templates">
                  <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Plus className="size-4" /> New Design
                  </button>
                </Link>
                <Link href="/dashboard/batch">
                  <button className="w-full bg-white/10 text-white border border-white/20 font-bold py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                    <History className="size-4" /> Start Batch
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  )
}
