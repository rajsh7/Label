'use client'

import React, { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/Spinner'
import { Printer } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { printLabels, PrinterConfig } from '@/lib/services/printerService'
import { useToast } from '@/components/ui/Toast'

export interface PrintModalProps {
  open: boolean
  onClose: () => void
  designId: string
  pdfUrl?: string
}

/**
 * PrintModal component - allows user to select printer and quantity
 */
export const PrintModal: React.FC<PrintModalProps> = ({
  open,
  onClose,
  designId,
  pdfUrl,
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [printers, setPrinters] = useState<any[]>([])
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loadingPrinters, setLoadingPrinters] = useState(true)

  useEffect(() => {
    if (open) {
      loadPrinters()
    }
  }, [open])

  const loadPrinters = async () => {
    setLoadingPrinters(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('printers')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      if (error) throw error

      setPrinters(data || [])
      if (data && data.length > 0) {
        // Select default printer or first printer
        const defaultPrinter = data.find((p) => p.is_default) || data[0]
        setSelectedPrinterId(defaultPrinter.id)
      }
    } catch (error) {
      console.error('Load printers error:', error)
      showToast('Failed to load printers', 'error')
    } finally {
      setLoadingPrinters(false)
    }
  }

  const handlePrint = async () => {
    if (!selectedPrinterId && printers.length > 0) {
      showToast('Please select a printer', 'error')
      return
    }

    setLoading(true)

    try {
      // If no printers configured, use browser print
      if (printers.length === 0) {
        if (pdfUrl) {
          const printWindow = window.open(pdfUrl, '_blank')
          if (printWindow) {
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print()
              }, 500)
            }
          }
        } else {
          window.print()
        }
        showToast('Print dialog opened', 'success')
        onClose()
        return
      }

      const printer = printers.find((p) => p.id === selectedPrinterId)
      if (!printer) {
        showToast('Selected printer not found', 'error')
        return
      }

      const printerConfig: PrinterConfig = {
        id: printer.id,
        name: printer.name,
        printer_type: printer.type,
        connection_type: printer.connection_type,
        network_ip: printer.ip_address,
        dpi: 203, // Default DPI
        darkness_level: 10, // Default darkness
        label_gap: 2, // Default gap
      }

      const result = await printLabels(
        {
          designId,
          quantity,
          printerId: selectedPrinterId,
        },
        printerConfig,
        pdfUrl
      )

      if (result.success) {
        showToast(`Print job sent! ${quantity} label(s) queued.`, 'success')
        onClose()
      } else {
        showToast(result.error || 'Failed to print labels', 'error')
      }
    } catch (error) {
      console.error('Print error:', error)
      showToast('An error occurred while printing', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <div className="space-y-6">
        {/* Printer Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Select Printer <span className="text-red-500">*</span>
          </label>
          {loadingPrinters ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : printers.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                No printers configured. Please add a printer first.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose()
                  window.location.href = '/printers/new'
                }}
              >
                Add Printer
              </Button>
            </div>
          ) : (
            <select
              value={selectedPrinterId}
              onChange={(e) => setSelectedPrinterId(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              {printers.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {printer.name}
                  {printer.is_default ? ' (Default)' : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        {/* Print Button */}
        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            loading={loading}
            disabled={loadingPrinters}
            className="flex-1"
          >
            <Printer size={18} className="mr-2" />
            Print {quantity} Label{quantity !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default PrintModal

