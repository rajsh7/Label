'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  FileText, 
  Package, 
  Printer, 
  Trash2, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Download, 
  Filter, 
  Grid3X3, 
  List, 
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardHero } from '@/components/dashboard/hero'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { deleteDesign } from '@/server/actions/designs'
import { cn } from '@/lib/utils'

export function LabelsContent() {
  const [labels, setLabels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch real data
  useEffect(() => {
    async function fetchLabels() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      try {
        if (user) {
          const { data: userData } = await supabase
            .from('label_designs')
            .select('*')
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .order('updated_at', { ascending: false })
          
          if (userData && userData.length > 0) {
            setLabels(userData)
            return
          }
        }

        // Fallback: Public templates if no user labels
        const { data: publicData } = await supabase
          .from('templates')
          .select('*')
          .limit(12)
        
        setLabels(publicData || [])
      } catch (error) {
        console.error("Error fetching labels:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLabels()
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic update
    const previousLabels = [...labels]
    setLabels(labels.filter(label => label.id !== id))
    
    try {
      const result = await deleteDesign(id)
      if (!result.success) {
        // Revert on failure
        setLabels(previousLabels)
        console.error('Failed to delete label:', result.error)
        alert('Failed to delete label')
      }
    } catch (error) {
       setLabels(previousLabels)
       console.error('Error deleting label:', error)
       alert('An error occurred while deleting')
    }
  }

  const filteredLabels = labels.filter(label => 
    label.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Reusable Hero Component */}
      <DashboardHero 
        onSearch={setSearchQuery} 
        title="My Labels" 
        description="Manage your saved label designs. Edit, print, or download your custom creations."
        searchPlaceholder="Search my designs..."
        showPills={false}
        showBottomPills={false}
      />

      <div className="max-w-[1920px] mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left: Filter/Sort (Mock for now) */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-600 bg-gray-50/50 border-gray-200">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <span className="text-sm text-gray-500 font-medium">
                {filteredLabels.length} {filteredLabels.length === 1 ? 'Design' : 'Designs'}
              </span>
            </div>

            {/* Right: View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[3/4] bg-white rounded-xl animate-pulse border border-gray-200" />
              ))}
             </div>
        ) : filteredLabels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No labels found</h3>
            <p className="text-gray-500 mt-1 mb-6">Start by creating your first label design.</p>
            <Link href="/dashboard/templates">
              <Button>Browse Templates</Button>
            </Link>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5" 
              : "grid-cols-1"
          )}>
            {filteredLabels.map((label) => (
              viewMode === 'grid' ? (
                // GRID VIEW CARD
                <div 
                  key={label.id} 
                  className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  {/* Preview Area */}
                  <div className="aspect-[4/3] bg-white relative flex items-center justify-center overflow-hidden border">
                    {label.thumbnail_url || label.image_url ? (
                      <img 
                        src={label.thumbnail_url || label.image_url} 
                        alt={label.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-white p-2 flex flex-col justify-center">
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3 h-full flex flex-col justify-center text-center">
                          {/* Template Name */}
                          <div className="text-xs font-bold text-gray-800 mb-2 truncate">
                            {label.name?.replace(/ - .*$/, '') || 'Label'}
                          </div>
                          
                          {/* Barcode/QR Code */}
                          {(label.name?.toLowerCase().includes('barcode') || label.name?.toLowerCase().includes('qr')) && (
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
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Link href={`/dashboard/advanced-editor?template=${label.id}`}>
                          <Button size="sm" className="bg-white text-gray-900 hover:bg-white/90 shadow-sm border border-gray-200">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button size="icon" variant="secondary" className="bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                       <div>
                        <h3 className="font-semibold text-gray-900 text-[15px] leading-tight mb-1 truncate pr-2" title={label.name}>
                          {label.name || 'Untitled Design'}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(label.created_at || Date.now()).toLocaleDateString()}
                        </p>
                       </div>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-700">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" /> Print
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={(e) => handleDelete(label.id, e)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-medium border border-green-100">
                        Ready to Print
                      </span>
                      <span className="text-xs text-gray-400">
                         4" x 6"
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // LIST VIEW ROW
                <div 
                  key={label.id}
                  className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="w-full sm:w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100">
                     <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900">{label.name}</h3>
                    <p className="text-sm text-gray-500">Last edited {new Date(label.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/advanced-editor?template=${label.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="ghost" size="icon"><Printer className="w-4 h-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-gray-500" /></Button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
