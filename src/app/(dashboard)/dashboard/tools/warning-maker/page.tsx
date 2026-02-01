'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import { generateWarningPDF } from '@/lib/utils/pdf-generator'

const WARNING_TYPES = [
  { value: 'CAUTION', label: '⚠️ CAUTION', color: '#FFA500' },
  { value: 'WARNING', label: '⚠️ WARNING', color: '#DC143C' },
  { value: 'DANGER', label: '⛔ DANGER', color: '#8B0000' },
  { value: 'FRAGILE', label: '📦 FRAGILE', color: '#DC143C' },
  { value: 'FLAMMABLE', label: '🔥 FLAMMABLE', color: '#FF4500' },
  { value: 'HAZMAT', label: '☣️ HAZMAT', color: '#FFD700' },
  { value: 'KEEP_DRY', label: '💧 KEEP DRY', color: '#1E90FF' },
  { value: 'THIS_SIDE_UP', label: '⬆️ THIS SIDE UP', color: '#000000' },
]

export default function WarningMakerPage() {
  const [warningType, setWarningType] = useState('WARNING')
  const [customMessage, setCustomMessage] = useState('')
  const [labelSize, setLabelSize] = useState('warning_3x3')

  const selectedWarning = WARNING_TYPES.find(w => w.value === warningType)

  const generateLabel = async () => {
    if (!selectedWarning) return
    
    await generateWarningPDF({
      type: warningType,
      label: selectedWarning.label,
      color: selectedWarning.color,
      customMessage,
      size: labelSize as any,
      filename: `warning-${warningType.toLowerCase()}.pdf`
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Warning Label Maker</h1>
        <p className="text-muted-foreground">
          Create safety and compliance warning labels with pre-designed templates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="warningType" className="text-base font-semibold mb-3 block">
                Warning Type
              </Label>
              <Select value={warningType} onValueChange={setWarningType}>
                <SelectTrigger id="warningType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WARNING_TYPES.map(type => (
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
                  <SelectItem value="warning_2x2">2" x 2"</SelectItem>
                  <SelectItem value="warning_3x3">3" x 3"</SelectItem>
                  <SelectItem value="warning_4x4">4" x 4"</SelectItem>
                  <SelectItem value="warning_4x6">4" x 6"</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customMessage" className="text-base font-semibold mb-2 block">
                Custom Message (Optional)
              </Label>
              <textarea
                id="customMessage"
                placeholder="Add additional warning text or instructions..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button onClick={generateLabel} size="lg" className="w-full">
              <Download className="h-5 w-5 mr-2" />
              Generate Warning Label
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">Preview</Label>
          <div
            className="border-4 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]"
            style={{ borderColor: selectedWarning?.color }}
          >
            <div
              className="text-5xl font-bold mb-4"
              style={{ color: selectedWarning?.color }}
            >
              {warningType.replace('_', ' ')}
            </div>
            <div className="text-6xl mb-4">
              {selectedWarning?.label.split(' ')[0]}
            </div>
            {customMessage && (
              <div className="text-sm font-semibold mt-4 max-w-xs">
                {customMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
