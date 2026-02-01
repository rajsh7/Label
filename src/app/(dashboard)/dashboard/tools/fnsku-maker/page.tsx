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

export default function FNSKUMakerPage() {
  const [fnskus, setFnskus] = useState<string[]>([''])
  const [labelSize, setLabelSize] = useState('amazon_fba_001') // 4x6" default
  const [productNames, setProductNames] = useState<{ [key: string]: string }>({})

  const addFNSKU = () => {
    setFnskus([...fnskus, ''])
  }

  const removeFNSKU = (index: number) => {
    const newFnskus = fnskus.filter((_, i) => i !== index)
    setFnskus(newFnskus.length > 0 ? newFnskus : [''])
  }

  const updateFNSKU = (index: number, value: string) => {
    const newFnskus = [...fnskus]
    newFnskus[index] = value
    setFnskus(newFnskus)
  }

  const updateProductName = (fnsku: string, name: string) => {
    setProductNames({ ...productNames, [fnsku]: name })
  }

  const generateLabels = async () => {
    const validFnskus = fnskus.filter(f => f.trim())
    if (validFnskus.length === 0) return

    const items = await Promise.all(validFnskus.map(async (fnsku) => {
      const canvas = document.createElement('canvas')
      try {
        JsBarcode(canvas, fnsku, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true, // FNSKU usually has the code below it
          fontSize: 20
        })
        return {
          value: fnsku,
          name: productNames[fnsku] || '',
          image: canvas.toDataURL('image/png')
        }
      } catch (e) {
        console.error('FNSKU generation error:', e)
        return { value: fnsku, image: undefined }
      }
    }))

    await generateBarcodePDF({
      items,
      size: labelSize,
      filename: `fnsku-${Date.now()}.pdf`
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FNSKU Label Maker</h1>
        <p className="text-muted-foreground">
          Quick Amazon FNSKU label generation. Enter FNSKU codes and generate professional labels instantly.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-6">
          {/* Label Size Selection */}
          <div>
            <Label htmlFor="labelSize" className="text-base font-semibold mb-2 block">
              Label Size
            </Label>
            <Select value={labelSize} onValueChange={setLabelSize}>
              <SelectTrigger id="labelSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazon_fba_006">2" x 1" (Compact)</SelectItem>
                <SelectItem value="amazon_fba_001">4" x 6" (Standard)</SelectItem>
                <SelectItem value="amazon_fba_3x5">3" x 5" (Medium)</SelectItem>
                <SelectItem value="avery_5163">2" x 4" (Avery 5163)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FNSKU Input Fields */}
          <div>
            <Label className="text-base font-semibold mb-3 block">FNSKU Codes & Product Names</Label>
            <div className="space-y-3">
              {fnskus.map((fnsku, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter FNSKU (e.g., X001ABC12D)"
                      value={fnsku}
                      onChange={(e) => updateFNSKU(index, e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Product Name (optional)"
                      value={productNames[fnsku] || ''}
                      onChange={(e) => updateProductName(fnsku, e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFNSKU(index)}
                    disabled={fnskus.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addFNSKU}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Another FNSKU
            </Button>
          </div>

          {/* Bulk Import */}
          <div>
            <Label htmlFor="bulkImport" className="text-base font-semibold mb-2 block">
              Bulk Import (Optional)
            </Label>
            <textarea
              id="bulkImport"
              placeholder="Paste FNSKUs here, one per line&#10;X001ABC12D&#10;X002DEF34G&#10;X003HIJ56K"
              rows={4}
              className="font-mono w-full px-4 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(l => l.trim())
                if (lines.length > 0) {
                  setFnskus(lines.map(l => l.trim().toUpperCase()))
                }
              }}
            />
          </div>
        </div>
      </Card>

      {/* Preview & Generate */}
      <div className="flex gap-4">
        <Button
          onClick={generateLabels}
          size="lg"
          className="flex-1"
          disabled={fnskus.filter(f => f).length === 0}
        >
          <Download className="h-5 w-5 mr-2" />
          Generate {fnskus.filter(f => f).length} Label{fnskus.filter(f => f).length !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Quick Info */}
      <Card className="mt-6 p-4 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-2">✨ Quick Tips</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• FNSKUs are 10 characters (e.g., X001ABC12D)</li>
          <li>• Use bulk import for multiple FNSKUs</li>
          <li>• Product names are optional but recommended</li>
          <li>• Labels are ready to print immediately</li>
        </ul>
      </Card>
    </div>
  )
}
