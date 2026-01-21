'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function BatchDetailsModal() {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batch Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Batch details will be displayed here.</p>
          <Button onClick={handleClose} className="mt-4">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}