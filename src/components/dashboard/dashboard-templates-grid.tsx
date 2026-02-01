'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, FileText, Download, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Template {
  id: string
  name: string
  elements: any[]
  category: string
  [key: string]: any
}

interface DashboardTemplatesGridProps {
  initialTemplates: Template[]
}

interface UserStats {
  labelsCreated: number
  labelsUsed: number
  monthlyLimit: number
}

export function DashboardTemplatesGrid({ initialTemplates }: DashboardTemplatesGridProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [userStats, setUserStats] = useState<UserStats>({ labelsCreated: 0, labelsUsed: 0, monthlyLimit: 100 })
  const ITEMS_PER_PAGE = 20
  const [hasMore, setHasMore] = useState(initialTemplates.length >= ITEMS_PER_PAGE)

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's created labels
      const { data: createdLabels } = await supabase
        .from('label_designs')
        .select('id')
        .eq('user_id', user.id)

      // Get user's template usage (downloads/prints)
      const { data: usageData } = await supabase
        .from('label_designs')
        .select('print_count')
        .eq('user_id', user.id)

      const totalUsage = usageData?.reduce((sum, item) => sum + (item.print_count || 0), 0) || 0

      setUserStats({
        labelsCreated: createdLabels?.length || 0,
        labelsUsed: totalUsage,
        monthlyLimit: 100 // Default limit, can be fetched from user profile
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const loadMore = async () => {
    try {
      setLoading(true)
      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      if (data) {
        setTemplates(prev => {
          // Filter out any templates that are already in the state
          const existingIds = new Set(prev.map(t => t.id))
          const newTemplates = data.filter(t => !existingIds.has(t.id))
          return [...prev, ...newTemplates]
        })
        setPage(prev => prev + 1)
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Error loading more templates:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-6 py-12 space-y-12">
      {/* User Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Labels Created */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Labels Created</h3>
                <p className="text-xs sm:text-sm text-gray-500">This month</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.labelsCreated}</div>
              <div className="text-xs sm:text-sm text-gray-500">of {userStats.monthlyLimit}</div>
            </div>
          </div>
          <Progress 
            value={(userStats.labelsCreated / userStats.monthlyLimit) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{userStats.monthlyLimit} limit</span>
          </div>
        </div>

        {/* Labels Used */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Labels Used</h3>
                <p className="text-xs sm:text-sm text-gray-500">Downloads & prints</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.labelsUsed}</div>
              <div className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% this week
              </div>
            </div>
          </div>
          <Progress 
            value={Math.min((userStats.labelsUsed / 50) * 100, 100)} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>50 weekly goal</span>
          </div>
        </div>
      </div>
      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={`/dashboard/advanced-editor?template=${template.id}`}
            className="group block"
          >
            <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100/50">
              {/* Visual Preview Container */}
              <div className="aspect-[1.4] bg-white relative group-hover:bg-gray-100 transition-colors border">
                {/* Free Pill - Top Left inside image */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 text-[11px] px-3 py-1 rounded-full font-medium shadow-sm">
                    Free
                  </span>
                </div>

                {/* Template Visual Preview */}
                {template.image_url ? (
                  <img 
                    src={template.image_url} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white p-2 flex flex-col justify-center">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3 h-full flex flex-col justify-center text-center">
                      {/* Template Name */}
                      <div className="text-xs font-bold text-gray-800 mb-2 truncate">
                        {template.name.replace(/ - .*$/, '')}
                      </div>
                      
                      {/* Barcode/QR Code */}
                      {(template.name.toLowerCase().includes('barcode') || template.name.toLowerCase().includes('qr')) && (
                        <div className="bg-black h-8 w-full mb-2 flex items-center justify-center">
                          <div className="text-white text-[6px] font-mono">||||| |||| |||||</div>
                        </div>
                      )}
                      
                      {/* Content Lines */}
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-1 bg-gray-200 rounded w-2/3 mx-auto"></div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className={`text-[6px] px-1 py-0.5 rounded mt-2 mx-auto w-fit ${
                        template.category === 'product_labels' ? 'bg-blue-100 text-blue-600' :
                        template.category === 'shipping_labels' ? 'bg-green-100 text-green-600' :
                        template.category === 'compliance_labels' ? 'bg-red-100 text-red-600' :
                        template.category === 'box_labels' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {template.category?.replace('_', ' ').toUpperCase() || 'LABEL'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Info - Left aligned, minimal */}
              <div className="p-4 bg-white">
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
                  {template.category?.split('_').join(' ') || 'General'} Label Template
                </p>
                <h3 className="font-bold text-gray-900 truncate text-[15px] group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
           <Button 
             onClick={loadMore}
             disabled={loading}
             className="px-8 py-6 rounded-full shadow-lg shadow-blue-600/20"
           >
             {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
             {loading ? 'Loading...' : 'Load More Templates'}
           </Button>
        </div>
      )}
    </div>
  )
}
