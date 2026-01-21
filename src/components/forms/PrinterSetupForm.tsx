'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface PrinterFormData {
  name: string
  type: 'dymo' | 'zebra' | 'rollo' | 'brother' | 'desktop' | 'network'
  connection_type: 'usb' | 'network' | 'system'
  ip_address?: string
  port?: number
  dpi: 203 | 300
  is_default?: boolean
}

export interface PrinterSetupFormProps {
  initialData?: PrinterFormData
  onSubmit: (data: PrinterFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
}

/**
 * Printer setup form component
 * Handles printer configuration with all fields
 */
export const PrinterSetupForm: React.FC<PrinterSetupFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PrinterFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'desktop',
    connection_type: initialData?.connection_type || 'system',
    ip_address: initialData?.ip_address || '',
    port: initialData?.port || 9100,
    dpi: initialData?.dpi || 203,
    is_default: initialData?.is_default || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleInputChange = (field: keyof PrinterFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Printer name is required'
    }

    if (formData.connection_type === 'network') {
      if (!formData.ip_address?.trim()) {
        newErrors.ip_address = 'IP address is required for network printers'
      }
      if (!formData.port || formData.port < 1 || formData.port > 65535) {
        newErrors.port = 'Valid port number is required (1-65535)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Printer setup error:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save printer',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Printer Name */}
      <Input
        label="Printer Name"
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        error={errors.name}
        placeholder="My Label Printer"
        required
        disabled={loading}
      />

      {/* Printer Type */}
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          Printer Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleInputChange('type', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select printer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dymo">DYMO</SelectItem>
            <SelectItem value="zebra">Zebra</SelectItem>
            <SelectItem value="rollo">Rollo</SelectItem>
            <SelectItem value="brother">Brother</SelectItem>
            <SelectItem value="desktop">Desktop/Inkjet</SelectItem>
            <SelectItem value="network">Network Printer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Connection Type */}
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          Connection Type
        </label>
        <Select
          value={formData.connection_type}
          onValueChange={(value) => handleInputChange('connection_type', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System Printer</SelectItem>
            <SelectItem value="usb">USB</SelectItem>
            <SelectItem value="network">Network (IP)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Network Settings (only show if connection_type is network) */}
      {formData.connection_type === 'network' && (
        <>
          <Input
            label="IP Address"
            type="text"
            value={formData.ip_address || ''}
            onChange={(e) => handleInputChange('ip_address', e.target.value)}
            error={errors.ip_address}
            placeholder="192.168.1.100"
            required
            disabled={loading}
          />

          <Input
            label="Port"
            type="number"
            value={formData.port?.toString() || '9100'}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 9100)}
            error={errors.port}
            placeholder="9100"
            required
            disabled={loading}
            min={1}
            max={65535}
          />
        </>
      )}

      {/* DPI */}
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          DPI (Dots Per Inch)
        </label>
        <Select
          value={formData.dpi.toString()}
          onValueChange={(value) => handleInputChange('dpi', parseInt(value) as 203 | 300)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select DPI" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="203">203 DPI</SelectItem>
            <SelectItem value="300">300 DPI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Default Printer */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_default"
          checked={formData.is_default}
          onChange={(e) => handleInputChange('is_default', e.target.checked)}
          disabled={loading}
          className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
        />
        <label htmlFor="is_default" className="text-sm text-[var(--color-text-primary)]">
          Set as default printer
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Printer' : 'Add Printer'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default PrinterSetupForm
