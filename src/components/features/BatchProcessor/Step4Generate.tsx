'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, CheckCircle2, Clock } from 'lucide-react'
import { UpgradeModal } from '../UpgradeModal'
import { ScheduleModal } from './ScheduleModal'

export interface Step4GenerateProps {
  templateId: string
  fileData: any[]
  columnMapping: Record<string, string>
  onComplete?: () => void
}

/**
 * Step 4: Generate Labels
 * Summary, preview, and generate/download PDF
 */
export const Step4Generate: React.FC<Step4GenerateProps> = ({
  templateId,
  fileData,
  columnMapping,
  onComplete,
}) => {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [upgradePlan, setUpgradePlan] = useState<'pro' | 'enterprise'>('pro')
  const hasSchedulingAccess = false

  const totalLabels = fileData.length
  const estimatedTime = Math.ceil(totalLabels * 0.12) // ~120ms per label
  const estimatedSize = Math.ceil(totalLabels * 0.05) // ~50KB per label

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)

    try {
      console.log('🚀 Starting batch generation...')
      console.log('Template ID:', templateId)
      console.log('CSV Data rows:', fileData.length)
      console.log('Column mapping:', columnMapping)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Call API endpoint
      console.log('📡 Calling /api/batch...')
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          csv_data: fileData,
          column_mapping: columnMapping,
        }),
      })

      console.log('📥 Response status:', response.status)
      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.upgradeRequired) {
          setUpgradePlan(errorData.upgradePlan || 'pro')
          setUpgradeModalOpen(true)
          setError(errorData.error || 'Batch limit exceeded')
          return
        }
        throw new Error(errorData.error || 'Failed to generate labels')
      }

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (data.success && data.pdf_base64) {
        // Create download URL from base64
        const blob = new Blob([Uint8Array.from(atob(data.pdf_base64), (c) => c.charCodeAt(0))], {
          type: 'application/pdf',
        })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)

        // Auto-download
        console.log('💾 Downloading PDF...')
        const link = document.createElement('a')
        link.href = url
        link.download = `labels_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        console.log('✅ Batch generation complete!')
        console.log('Batch ID:', data.batch_id)
        // Mark as complete
        onComplete?.()
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('❌ Generate error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate labels')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            Ready to Generate
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Labels</p>
              <p className="text-2xl font-bold">
                {totalLabels}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Time</p>
              <p className="text-2xl font-bold">
                {estimatedTime}s
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Size</p>
              <p className="text-2xl font-bold">
                {estimatedSize}MB
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Columns</p>
              <p className="text-2xl font-bold">
                {Object.keys(columnMapping).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {generating && (
        <div className="p-4 border rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Generating labels...
              </span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !upgradeModalOpen && (
        <div className="p-4 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success */}
      {downloadUrl && !generating && (
        <div className="p-4 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-600" />
            <div className="flex-1">
              <p className="font-semibold">
                Labels generated successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                {totalLabels} labels have been downloaded
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = `labels_${new Date().toISOString().split('T')[0]}.pdf`
                link.click()
              }}
            >
              <Download size={18} className="mr-2" />
              Download Again
            </Button>
          </div>
        </div>
      )}

      {/* Generate Buttons */}
      {!downloadUrl && (
        <div className="flex gap-3 justify-end">
          {hasSchedulingAccess && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setScheduleModalOpen(true)}
              disabled={generating}
            >
              <Clock size={18} className="mr-2" />
              Schedule for Later
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            loading={generating}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Labels'}
          </Button>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade Required"
        message={error || 'You have reached your batch processing limit. Upgrade to continue creating batch labels.'}
        requiredPlan={upgradePlan}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={async (scheduledFor) => {
          try {
            const response = await fetch('/api/batch/schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                template_id: templateId,
                data_rows: fileData,
                column_mapping: columnMapping,
                scheduled_for: scheduledFor.toISOString(),
              }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              if (errorData.upgradeRequired) {
                setUpgradePlan('pro')
                setUpgradeModalOpen(true)
                throw new Error(errorData.error || 'Upgrade required')
              }
              throw new Error(errorData.error || 'Failed to schedule batch')
            }

            setScheduleModalOpen(false)
          } catch (error) {
            throw error
          }
        }}
      />
    </div>
  )
}

export default Step4Generate
