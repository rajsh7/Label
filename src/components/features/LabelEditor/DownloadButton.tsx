'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UpgradeModal } from '../UpgradeModal'
import { useToast } from '@/components/ui/Toast'
import { Download } from 'lucide-react'

export interface DownloadButtonProps {
  designId?: string | null
  className?: string
}

/**
 * DownloadButton component - handles label download with usage tracking
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  designId,
  className,
}) => {
  const [loading, setLoading] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const { showToast } = useToast()

  const handleDownload = async () => {
    if (!designId) {
      showToast('Please save your design before downloading', 'info')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/labels/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_id: designId, format: 'pdf' }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.upgradeRequired) {
          setUpgradeModalOpen(true)
          return
        }
        throw new Error(data.error || 'Failed to download label')
      }

      // Download the file
      if (data.pdf_base64) {
        // Create blob from base64
        const binaryString = atob(data.pdf_base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        
        // Trigger download
        const link = document.createElement('a')
        link.href = url
        link.download = `label_${designId}_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100)
      } else if (data.download_url) {
        // Open URL in new tab
        window.open(data.download_url, '_blank')
      }
      
      showToast('Label downloaded successfully!', 'success')
    } catch (error) {
      console.error('Download error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to download label',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleDownload}
        loading={loading}
        disabled={!designId}
        className={className}
      >
        <Download size={18} className="mr-2" />
        Download
      </Button>

      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade Required"
        message="You've reached your monthly label limit. Upgrade to continue creating labels."
        requiredPlan="pro"
      />
    </>
  )
}

export default DownloadButton

