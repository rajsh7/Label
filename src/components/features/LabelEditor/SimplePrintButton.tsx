import React from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface SimplePrintButtonProps {
  designId?: string
  pdfUrl?: string
  className?: string
}

export const SimplePrintButton: React.FC<SimplePrintButtonProps> = ({
  pdfUrl,
  className
}) => {
  const handlePrint = () => {
    if (pdfUrl) {
      // Open PDF in new window and print
      const printWindow = window.open(pdfUrl, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    } else {
      // Use browser print dialog
      window.print()
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handlePrint}
      className={className}
    >
      <Printer className="w-4 h-4 mr-2" />
      Print
    </Button>
  )
}

export default SimplePrintButton