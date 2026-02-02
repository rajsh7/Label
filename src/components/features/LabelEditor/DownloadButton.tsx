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
      // If no design ID, show message to save first
      showToast('Please save your design before downloading', 'info')
      return
    }

    setLoading(true)

    try {
      // Find the canvas element in the editor
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) {
        throw new Error('Canvas not found')
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('Failed to generate image', 'error')
          setLoading(false)
          return
        }

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `label_${designId}_${new Date().toISOString().split('T')[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100)
        
        showToast('Label downloaded successfully!', 'success')
        setLoading(false)
      }, 'image/png', 1.0)
      
    } catch (error) {
      console.error('Download error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to download label',
        'error'
      )
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleDownload}
        loading={loading}
        disabled={loading}
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

