'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export interface PrinterFormData {
  name: string
  printer_type: string
  connection_type: string
  network_ip?: string
  dpi: number
  darkness_level: number
  label_gap: number
  is_default: boolean
}

export interface PrinterFormProps {
  initialData?: Partial<PrinterFormData>
  printerId?: string
}

/**
 * PrinterForm component - for adding/editing printers
 */
export const PrinterForm: React.FC<PrinterFormProps> = ({
  initialData,
  printerId,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PrinterFormData>({
    name: initialData?.name || '',
    printer_type: initialData?.printer_type || 'dymo_4xl',
    connection_type: initialData?.connection_type || 'usb',
    network_ip: initialData?.network_ip || '',
    dpi: initialData?.dpi || 203,
    darkness_level: initialData?.darkness_level || 15,
    label_gap: initialData?.label_gap || 3,
    is_default: initialData?.is_default || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Printer name is required'
    }
    if (formData.connection_type === 'network' && !formData.network_ip?.trim()) {
      newErrors.network_ip = 'IP address is required for network printers'
    }
    if (formData.darkness_level < 0 || formData.darkness_level > 30) {
      newErrors.darkness_level = 'Darkness level must be between 0 and 30'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const url = printerId ? `/api/printers/${printerId}` : '/api/printers'
      const method = printerId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/printers')
        router.refresh()
      } else {
        setErrors({ submit: data.error || 'Failed to save printer' })
        setLoading(false)
      }
    } catch (error) {
      console.error('Save printer error:', error)
      setErrors({ submit: 'An error occurred. Please try again.' })
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Printer Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Warehouse Printer 1"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Printer Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Printer Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.printer_type}
              onChange={(e) =>
                setFormData({ ...formData, printer_type: e.target.value })
              }
              className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              <option value="dymo_4xl">DYMO LabelWriter 4XL</option>
              <option value="dymo_450">DYMO LabelWriter 450</option>
              <option value="zebra_lp2844">Zebra LP 2844</option>
              <option value="zebra_gx430t">Zebra GX430t</option>
              <option value="rollo_x1030">Rollo X1030</option>
              <option value="brother_ql1100">Brother QL-1100</option>
              <option value="desktop_inkjet">Desktop Inkjet</option>
              <option value="desktop_laser">Desktop Laser</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Connection Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Connection Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.connection_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  connection_type: e.target.value,
                  network_ip: e.target.value !== 'network' ? '' : formData.network_ip,
                })
              }
              className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              <option value="usb">USB</option>
              <option value="network">Network (IP Address)</option>
              <option value="system">System Printer</option>
            </select>
          </div>

          {/* Network IP (conditional) */}
          {formData.connection_type === 'network' && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                IP Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.network_ip}
                onChange={(e) =>
                  setFormData({ ...formData, network_ip: e.target.value })
                }
                placeholder="192.168.1.100"
                required
              />
              {errors.network_ip && (
                <p className="text-sm text-red-600 mt-1">{errors.network_ip}</p>
              )}
            </div>
          )}

          {/* DPI */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              DPI (Dots Per Inch) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.dpi}
              onChange={(e) =>
                setFormData({ ...formData, dpi: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            >
              <option value="203">203 DPI</option>
              <option value="300">300 DPI</option>
            </select>
          </div>

          {/* Darkness Level */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Darkness Level: {formData.darkness_level}
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={formData.darkness_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  darkness_level: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
              <span>Light</span>
              <span>Dark</span>
            </div>
            {errors.darkness_level && (
              <p className="text-sm text-red-600 mt-1">{errors.darkness_level}</p>
            )}
          </div>

          {/* Label Gap */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Label Gap (mm)
            </label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.label_gap}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  label_gap: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="3"
            />
          </div>

          {/* Default Printer */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) =>
                setFormData({ ...formData, is_default: e.target.checked })
              }
              className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
            />
            <label
              htmlFor="is_default"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              Set as default printer
            </label>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {printerId ? 'Update Printer' : 'Add Printer'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default PrinterForm

