'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Plus, Trash2 } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import { generateBarcodePDF } from '@/lib/utils/pdf-generator'

const BARCODE_TYPES = [
  { value: 'CODE128', label: 'CODE128 (Most Common)' },
  { value: 'EAN13', label: 'EAN-13 (Retail)' },
  { value: 'UPC-A', label: 'UPC-A (US/Canada)' },
  { value: 'CODE39', label: 'CODE39' },
  { value: 'QRCODE', label: 'QR Code' },
]

export default function BarcodeMakerPage() {
  const [barcodes, setBarcodes] = useState<string[]>([''])
  const [barcodeType, setBarcodeType] = useState('CODE128')
  const [labelSize, setLabelSize] = useState('avery_5163')

  const addBarcode = () => {
    setBarcodes([...barcodes, ''])
  }

  const removeBarcode = (index: number) => {
    const newBarcodes = barcodes.filter((_, i) => i !== index)
    setBarcodes(newBarcodes.length > 0 ? newBarcodes : [''])
  }

  const updateBarcode = (index: number, value: string) => {
    const newBarcodes = [...barcodes]
    newBarcodes[index] = value
    setBarcodes(newBarcodes)
  }

  const generateLabels = async () => {
    const validBarcodes = barcodes.filter(b => b.trim())
    if (validBarcodes.length === 0) return

    const items = await Promise.all(validBarcodes.map(async (value) => {
      // Create a temporary canvas to render the barcode
      const canvas = document.createElement('canvas')
      try {
        JsBarcode(canvas, value, {
          format: barcodeType as any,
          width: 2,
          height: 100,
          displayValue: false
        })
        return {
          value,
          image: canvas.toDataURL('image/png')
        }
      } catch (e) {
        console.error('Barcode generation error:', e)
        return { value, image: undefined }
      }
    }))

    await generateBarcodePDF({
      items,
      size: labelSize,
      filename: `barcodes-${Date.now()}.pdf`
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Barcode Label Maker</h1>
        <p className="text-muted-foreground">
          Generate barcode labels from SKUs, product codes, or any numeric/alphanumeric data.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-6">
          {/* Barcode Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barcodeType" className="text-base font-semibold mb-2 block">
                Barcode Type
              </Label>
              <Select value={barcodeType} onValueChange={setBarcodeType}>
                <SelectTrigger id="barcodeType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BARCODE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="labelSize" className="text-base font-semibold mb-2 block">
                Label Size
              </Label>
              <Select value={labelSize} onValueChange={setLabelSize}>
                <SelectTrigger id="labelSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avery_5163">2" x 4" (Avery 5163)</SelectItem>
                  <SelectItem value="avery_5160">1" x 2.625" (Avery 5160)</SelectItem>
                  <SelectItem value="product_1x2">1" x 2" (Small)</SelectItem>
                  <SelectItem value="product_2x3">2" x 3" (Medium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Barcode Values */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Barcode Values</Label>
            <div className="space-y-2">
              {barcodes.map((barcode, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Enter barcode value (e.g., 123456789012)"
                    value={barcode}
                    onChange={(e) => updateBarcode(index, e.target.value)}
                    className="flex-1 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeBarcode(index)}
                    disabled={barcodes.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addBarcode} className="mt-3">
              <Plus className="h-4 w-4 mr-1" />
              Add Another
            </Button>
          </div>

          {/* Bulk Import */}
          <div>
            <Label htmlFor="bulkImport" className="text-base font-semibold mb-2 block">
              Bulk Import (Optional)
            </Label>
            <textarea
              id="bulkImport"
              placeholder="Paste barcode values here one per line"
              rows={4}
              className="font-mono w-full px-4 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(l => l.trim())
                if (lines.length > 0) {
                  setBarcodes(lines.map(l => l.trim()))
                }
              }}
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={generateLabels}
        size="lg"
        className="w-full"
        disabled={barcodes.filter(b => b).length === 0}
      >
        <Download className="h-5 w-5 mr-2" />
        Generate {barcodes.filter(b => b).length} Label{barcodes.filter(b => b).length !== 1 ? 's' : ''}
      </Button>
    </div>
  )
}
