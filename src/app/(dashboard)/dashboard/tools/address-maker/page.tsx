'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, Download, Plus, Trash2 } from 'lucide-react'

interface AddressEntry {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
}

import { generateAddressPDF } from '@/lib/utils/pdf-generator'

export default function AddressLabelMakerPage() {
  const [addresses, setAddresses] = useState<AddressEntry[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('avery_5160')
  const [returnAddress, setReturnAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  })

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const newAddresses: AddressEntry[] = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(',').map(v => v.trim())
        const entry: any = { id: `addr_${Date.now()}_${i}` }
        
        headers.forEach((header, index) => {
          if (header === 'name') entry.name = values[index]
          if (header === 'address' || header === 'address1' || header === 'addressline1') entry.addressLine1 = values[index]
          if (header === 'address2' || header === 'addressline2') entry.addressLine2 = values[index]
          if (header === 'city') entry.city = values[index]
          if (header === 'state') entry.state = values[index]
          if (header === 'zip' || header === 'zipcode') entry.zip = values[index]
        })
        
        if (entry.name && entry.addressLine1 && entry.city && entry.state && entry.zip) {
          newAddresses.push(entry as AddressEntry)
        }
      }
      
      setAddresses(prev => [...prev, ...newAddresses])
    }
    reader.readAsText(file)
  }

  const addManualAddress = () => {
    setAddresses(prev => [...prev, {
      id: `addr_${Date.now()}`,
      name: '',
      addressLine1: '',
      city: '',
      state: '',
      zip: ''
    }])
  }

  const updateAddress = (id: string, field: keyof AddressEntry, value: string) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ))
  }

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id))
  }

  const generatePDF = async () => {
    if (addresses.length === 0) return

    await generateAddressPDF({
      addresses: addresses,
      returnAddress: returnAddress.name ? returnAddress : undefined,
      size: selectedTemplate,
      filename: `address-labels-${Date.now()}.pdf`
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📬 Address Label Maker
          </h1>
          <p className="text-gray-600">
            Create professional address labels for mailing, shipping, and returns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Label Template</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="avery_5160"
                    checked={selectedTemplate === 'avery_5160'}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Avery 5160 (2.625&quot; x 1&quot;) - 30/sheet</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="avery_5161"
                    checked={selectedTemplate === 'avery_5161'}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Avery 5161 (4&quot; x 1.33&quot;) - 20/sheet</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="avery_5163"
                    checked={selectedTemplate === 'avery_5163'}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Avery 5163 (4&quot; x 2&quot;) - 10/sheet</span>
                </label>
              </div>
            </Card>

            {/* Return Address */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Return Address (Optional)</h2>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={returnAddress.name}
                    onChange={(e) => setReturnAddress(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input
                    value={returnAddress.addressLine1}
                    onChange={(e) => setReturnAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input
                    value={returnAddress.addressLine2}
                    onChange={(e) => setReturnAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                    placeholder="Apt 4B (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={returnAddress.city}
                      onChange={(e) => setReturnAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={returnAddress.state}
                      onChange={(e) => setReturnAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="ST"
                      maxLength={2}
                    />
                  </div>
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={returnAddress.zip}
                    onChange={(e) => setReturnAddress(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Address List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Addresses ({addresses.length})
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={addManualAddress}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manual
                  </Button>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Import CSV
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVImport}
                      className="hidden"
                    />
                  </label>
                  <Button
                    onClick={generatePDF}
                    disabled={addresses.length === 0}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No addresses yet</p>
                  <p className="text-sm">Add addresses manually or import from CSV</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={addr.name}
                            onChange={(e) => updateAddress(addr.id, 'name', e.target.value)}
                            placeholder="Recipient Name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Address Line 1</Label>
                          <Input
                            value={addr.addressLine1}
                            onChange={(e) => updateAddress(addr.id, 'addressLine1', e.target.value)}
                            placeholder="123 Main St"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Address Line 2</Label>
                          <Input
                            value={addr.addressLine2 || ''}
                            onChange={(e) => updateAddress(addr.id, 'addressLine2', e.target.value)}
                            placeholder="Apt, Suite, etc. (optional)"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">City</Label>
                          <Input
                            value={addr.city}
                            onChange={(e) => updateAddress(addr.id, 'city', e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">State</Label>
                            <Input
                              value={addr.state}
                              onChange={(e) => updateAddress(addr.id, 'state', e.target.value)}
                              placeholder="ST"
                              maxLength={2}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">ZIP</Label>
                            <Input
                              value={addr.zip}
                              onChange={(e) => updateAddress(addr.id, 'zip', e.target.value)}
                              placeholder="12345"
                            />
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            onClick={() => removeAddress(addr.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
