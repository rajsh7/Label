'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Printer, Edit, Trash2, TestTube } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface PrinterData {
  id: string
  name: string
  printer_type: string
  connection_type: string
  network_ip?: string
  dpi: number
  darkness_level: number
  label_gap: number
  is_default: boolean
  is_online: boolean
  last_status_check?: string
}

export interface PrinterListProps {
  initialPrinters: PrinterData[]
}

/**
 * PrinterList component - displays user's configured printers
 */
export const PrinterList: React.FC<PrinterListProps> = ({ initialPrinters }) => {
  const router = useRouter()
  const [printers, setPrinters] = React.useState(initialPrinters)

  const handleDelete = async (printerId: string) => {
    if (!confirm('Are you sure you want to delete this printer?')) return

    try {
      const response = await fetch(`/api/printers/${printerId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPrinters(printers.filter((p) => p.id !== printerId))
      } else {
        alert('Failed to delete printer')
      }
    } catch (error) {
      console.error('Delete printer error:', error)
      alert('An error occurred')
    }
  }

  const handleTestPrint = async (printerId: string) => {
    try {
      const response = await fetch(`/api/printers/${printerId}/test`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('Test print sent successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to send test print')
      }
    } catch (error) {
      console.error('Test print error:', error)
      alert('An error occurred')
    }
  }

  if (printers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Printer size={48} className="mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            No printers configured
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Add your first printer to start printing labels directly from LabelPro
          </p>
          <Button variant="primary" onClick={() => router.push('/printers/new')}>
            Add Your First Printer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {printers.map((printer) => (
        <Card key={printer.id}>
          <CardContent>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    printer.is_online
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <Printer
                    size={24}
                    className={
                      printer.is_online
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {printer.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] capitalize">
                    {printer.printer_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              {printer.is_default && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  Default
                </Badge>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Status:</span>
                <Badge
                  variant={printer.is_online ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {printer.is_online ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Connection:</span>
                <span className="text-[var(--color-text-primary)] capitalize">
                  {printer.connection_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">DPI:</span>
                <span className="text-[var(--color-text-primary)]">{printer.dpi}</span>
              </div>
              {printer.network_ip && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">IP Address:</span>
                  <span className="text-[var(--color-text-primary)] font-mono text-xs">
                    {printer.network_ip}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-[var(--color-border-primary)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/printers/${printer.id}/edit`)}
                className="flex-1"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestPrint(printer.id)}
                disabled={!printer.is_online}
                title={!printer.is_online ? 'Printer is offline' : 'Send test print'}
              >
                <TestTube size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(printer.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PrinterList

