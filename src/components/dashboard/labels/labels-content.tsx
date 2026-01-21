'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import { FileText, Package, Printer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LabelsContent() {
  const [labels, setLabels] = useState<any[]>([])
  const [selectedLabel, setSelectedLabel] = useState<any>(null)
  const [showPrintDialog, setShowPrintDialog] = useState(false)

  useEffect(() => {
    async function fetchLabels() {
      const { data } = await supabase.from('label_designs').select('*')
      setLabels(data || [])
    }
    fetchLabels()
  }, [])

  const getLabelLogo = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('amazon')) return '/amazon-logo.png'
    if (lowerName.includes('walmart')) return '/walmart-logo.png'
    if (lowerName.includes('ebay')) return '/ebay-logo-display.png'
    if (lowerName.includes('shopify')) return '/shopify-logo.png'
    return null
  }

  const handleLabelClick = (label: any) => {
    setSelectedLabel(label)
    setShowPrintDialog(true)
  }

  const handlePrint = () => {
    window.print()
    setShowPrintDialog(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Labels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {labels.map(label => {
          const logo = getLabelLogo(label.name)
          return (
            <div 
              key={label.id} 
              onClick={() => handleLabelClick(label)}
              className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-card cursor-pointer"
            >
              <div className="aspect-[4/3] bg-muted relative flex items-center justify-center">
                {logo ? (
                  <Image src={logo} alt={label.name} width={120} height={60} className="object-contain" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{label.name}</h3>
                <p className="text-sm text-muted-foreground">{new Date(label.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Print Dialog */}
      {showPrintDialog && selectedLabel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPrintDialog(false)}>
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Print Label</h2>
              <button onClick={() => setShowPrintDialog(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground mb-2">You are about to print:</p>
              <p className="font-semibold text-foreground">{selectedLabel.name}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePrint} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={() => setShowPrintDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
