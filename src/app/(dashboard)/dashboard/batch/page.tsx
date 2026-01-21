import { BatchProcessor } from '@/components/features/BatchProcessor'

export default function BatchPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <BatchProcessor />
      </div>
    </div>
  )
}
