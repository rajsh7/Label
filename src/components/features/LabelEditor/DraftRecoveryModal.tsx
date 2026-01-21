'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export interface DraftRecoveryModalProps {
  isOpen: boolean
  onRecover: () => void
  onDiscard: () => void
  draftName?: string
}

/**
 * DraftRecoveryModal - Modal for recovering unsaved drafts
 */
export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  onRecover,
  onDiscard,
  draftName,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Recover Unsaved Design?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          We found an unsaved draft{draftName ? `: "${draftName}"` : ''}. Would you like to recover it?
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onDiscard} className="flex-1">
            Discard
          </Button>
          <Button variant="primary" onClick={onRecover} className="flex-1">
            Recover Draft
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DraftRecoveryModal

