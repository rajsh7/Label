'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, X, Clipboard } from 'lucide-react'
import { PasteDataDialog } from './PasteDataDialog'

export interface Step2UploadDataProps {
  uploadedFile: File | null
  fileData: any[] | null
  onUpload: (file: File, data: any[]) => void
}

/**
 * Step 2: Upload Data File
 * User uploads CSV or Excel file containing label data
 */
export const Step2UploadData: React.FC<Step2UploadDataProps> = ({
  uploadedFile,
  fileData,
  onUpload,
}) => {
  const [dragActive, setDragActive] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    setProcessing(true)
    setError(null)

    try {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      const validExtensions = ['.csv', '.xls', '.xlsx']

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const isValidType =
        validTypes.includes(file.type) || validExtensions.includes(fileExtension)

      if (!isValidType) {
        throw new Error('Please upload a CSV or Excel file (.csv, .xls, .xlsx)')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Read file
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result

          if (fileExtension === '.csv') {
            // Parse CSV
            const text = data as string
            const lines = text.split('\n').filter((line) => line.trim())
            if (lines.length === 0) {
              throw new Error('CSV file is empty')
            }

            const headers = lines[0].split(',').map((h) => h.trim())
            const rows = lines.slice(1).map((line) => {
              const values = line.split(',').map((v) => v.trim())
              const row: any = {}
              headers.forEach((header, index) => {
                row[header] = values[index] || ''
              })
              return row
            })

            onUpload(file, rows)
          } else {
            // Parse Excel - simplified without xlsx library
            setError('Excel files not supported yet. Please use CSV or paste data.')
            setProcessing(false)
            return
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse file')
        } finally {
          setProcessing(false)
        }
      }

      reader.onerror = () => {
        setError('Failed to read file')
        setProcessing(false)
      }

      if (fileExtension === '.csv') {
        reader.readAsText(file)
      } else {
        reader.readAsBinaryString(file)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
      setProcessing(false)
    }
  }, [onUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onUpload(null as any, null as any)
    setError(null)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Upload Data File
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Upload a CSV or Excel file containing the data for your labels. Each row will become one label.
      </p>

      {!uploadedFile ? (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary-300)]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload
              size={48}
              className={`mx-auto mb-4 ${
                dragActive ? 'text-[var(--color-primary-500)]' : 'text-[var(--color-text-tertiary)]'
              }`}
            />
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Drag and drop your file here
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              or click to browse
            </p>
            <div className="flex gap-3 justify-center">
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={processing}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50">
                  {processing ? 'Processing...' : 'Choose File'}
                </span>
              </label>
              <Button
                variant="outline"
                onClick={() => setPasteDialogOpen(true)}
                disabled={processing}
              >
                <Clipboard size={18} className="mr-2" />
                Paste Data
              </Button>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-4">
              Supported formats: CSV, XLS, XLSX (Max 5MB)
            </p>
          </div>
          <PasteDataDialog
            open={pasteDialogOpen}
            onClose={() => setPasteDialogOpen(false)}
            onPaste={(data) => {
              // Create a mock file object for consistency
              const mockFile = new File([], 'pasted_data.csv', { type: 'text/csv' })
              onUpload(mockFile, data)
            }}
          />
        </>
      ) : (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="text-green-600" />
              <div>
                <p className="font-medium">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB • {fileData?.length || 0} rows
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {fileData && fileData.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Preview (first 5 rows):
          </p>
          <div className="overflow-x-auto border border-[var(--color-border-primary)] rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-gray-50)]">
                <tr>
                  {Object.keys(fileData[0]).map((key) => (
                    <th key={key} className="px-4 py-2 text-left font-semibold text-[var(--color-text-primary)]">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-t border-[var(--color-border-primary)]">
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="px-4 py-2 text-[var(--color-text-secondary)]">
                        {String(value || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step2UploadData

