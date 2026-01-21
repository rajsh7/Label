'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface PasteDataDialogProps {
  open: boolean
  onClose: () => void
  onPaste: (data: any[]) => void
}

/**
 * PasteDataDialog - allows users to paste CSV data as text
 */
export const PasteDataDialog: React.FC<PasteDataDialogProps> = ({
  open,
  onClose,
  onPaste,
}) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleParse = () => {
    setError(null)
    setProcessing(true)

    try {
      if (!text.trim()) {
        setError('Please paste some data')
        setProcessing(false)
        return
      }

      // Parse CSV-like text
      const lines = text.trim().split('\n')
      if (lines.length === 0) {
        setError('No data found')
        setProcessing(false)
        return
      }

      // Detect delimiter (comma, tab, or pipe)
      const firstLine = lines[0]
      let delimiter = ','
      if (firstLine.includes('\t')) {
        delimiter = '\t'
      } else if (firstLine.includes('|')) {
        delimiter = '|'
      }

      // Parse headers
      const headers = lines[0]
        .split(delimiter)
        .map((h) => h.trim().replace(/^"|"$/g, ''))

      // Parse data rows
      const data: any[] = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue // Skip empty lines

        const values = lines[i]
          .split(delimiter)
          .map((v) => v.trim().replace(/^"|"$/g, ''))

        if (values.length !== headers.length) {
          setError(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`)
          setProcessing(false)
          return
        }

        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }

      if (data.length === 0) {
        setError('No data rows found')
        setProcessing(false)
        return
      }

      // Success - pass data to parent
      onPaste(data)
      setText('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative z-10">
          <h2 className="text-xl font-semibold mb-4">Paste Data as Text</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Paste your CSV data here. The first row should be headers (column names). Data can be
                separated by commas, tabs, or pipes.
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Header1,Header2,Header3&#10;Value1,Value2,Value3&#10;Value4,Value5,Value6"
                className="w-full h-64 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleParse}
                disabled={processing}
                className="flex-1"
              >
                {processing ? 'Processing...' : 'Parse & Use Data'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasteDataDialog

