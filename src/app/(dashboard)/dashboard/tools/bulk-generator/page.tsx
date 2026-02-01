'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import { generateBarcodePDF, generateAddressPDF } from '@/lib/utils/pdf-generator'

export default function BulkGeneratorPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [template, setTemplate] = useState('amazon_fba_product')
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<'free' | 'pro' | 'enterprise'>('free')

  useEffect(() => {
     const checkSubscription = async () => {
       const { supabase } = await import('@/lib/supabase/client')
       const { data: { user } } = await supabase.auth.getUser()
       if (user) {
         const { data } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()
         
         setSubscription((data?.subscription_tier as any) || 'free')
       }
     }
     checkSubscription()
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(l => l.trim())
        setRowCount(Math.max(0, lines.length - 1))
      }
      reader.readAsText(file)
    }
  }

  const generatePDF = async () => {
    if (!csvFile) return

    let limit = 50
    if (subscription === 'pro') limit = 499
    if (subscription === 'enterprise') limit = Infinity

    if (rowCount > limit) {
      alert(`Upgrade Required: Your ${subscription} plan is limited to ${limit} labels per batch. This file has ${rowCount} labels.`)
      return
    }

    setLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').map(l => l.trim()).filter(l => l)
        if (lines.length < 2) return

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const dataRows = lines.slice(1)

        const parsedData = dataRows.map(line => {
          const values = line.split(',')
          const obj: any = {}
          headers.forEach((header, i) => {
            obj[header] = values[i]?.trim()
          })
          return obj
        })

        if (template.includes('shipping') || template === 'shipping_generic') {
          const addresses = parsedData.map(row => ({
            name: row.name || row.recipient || 'N/A',
            addressLine1: row.address || row.street || row.addressline1 || '',
            addressLine2: row.address2 || row.addressline2 || '',
            city: row.city || '',
            state: row.state || '',
            zip: row.zip || row.zipcode || row.postcode || ''
          }))
          
          await generateAddressPDF({
            addresses,
            size: 'avery_5160',
            filename: `bulk-shipping-${Date.now()}.pdf`
          })
        } else {
          const items = await Promise.all(parsedData.map(async (row) => {
            const value = row.fnsku || row.sku || row.barcode || row.id || ''
            const name = row.product_name || row.name || ''
            
            if (!value) return null

            const canvas = document.createElement('canvas')
            try {
              JsBarcode(canvas, value, {
                format: "CODE128",
                width: 2,
                height: 80,
                displayValue: true
              })
              return {
                value,
                name,
                image: canvas.toDataURL('image/png')
              }
            } catch (e) {
              return { value, name, image: undefined }
            }
          }))

          await generateBarcodePDF({
            items: items.filter(Boolean) as any,
            size: template === 'amazon_fba_product' ? 'amazon_fba_001' : 'avery_5163',
            filename: `bulk-labels-${Date.now()}.pdf`
          })
        }
        setLoading(false)
      }
      reader.readAsText(csvFile)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk PDF Generator</h1>
        <p className="text-muted-foreground">
          Upload a CSV file and generate hundreds of labels in one PDF document.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">1. Upload CSV File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {!csvFile ? (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload CSV</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports .csv files
                    </p>
                  </label>
                ) : (
                  <div>
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">{csvFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rowCount} rows detected
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCsvFile(null)
                        setRowCount(0)
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="template" className="text-base font-semibold mb-2 block">
                2. Select Template
              </Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon_fba_product">Amazon FBA Product Label</SelectItem>
                  <SelectItem value="amazon_fba_shipping">Amazon FBA Shipping</SelectItem>
                  <SelectItem value="shipping_generic">Generic Shipping Label</SelectItem>
                  <SelectItem value="barcode_only">Barcode Only</SelectItem>
                  <SelectItem value="product_generic">Generic Product Label</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generatePDF}
              size="lg"
              className="w-full"
              disabled={!csvFile || rowCount === 0 || loading}
            >
              {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Download className="h-5 w-5 mr-2" />}
              {loading ? 'Generating...' : `Generate ${rowCount} Labels as PDF`}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">CSV Format Guide</Label>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Product Labels:</p>
              <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                FNSKU,Product_Name,SKU,Condition{'\n'}
                X001ABC12D,Example Product 1,SKU-001,New{'\n'}
                X002DEF34G,Example Product 2,SKU-002,New
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Shipping Labels:</p>
              <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                Name,Address,City,State,Zip,Tracking{'\n'}
                John Doe,123 Main St,Boston,MA,02101,1Z999...{'\n'}
                Jane Smith,456 Oak Ave,NYC,NY,10001,1Z888...
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>First row must be column headers</li>
                <li>Column names should match template variables</li>
                <li>Your current plan allows up to {subscription === 'free' ? '50' : '499'} labels</li>
                <li>Output will be multi-page printable PDF</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
