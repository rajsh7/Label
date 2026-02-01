import { BatchProcessor } from '@/components/features/BatchProcessor'
import { DashboardHero } from '@/components/dashboard/hero'

export default function BatchPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <DashboardHero 
        title="Batch Processing" 
        description="Process multiple labels at once using CSV or Excel data. Upload your file, map columns, and generate labels in bulk."
        searchPlaceholder="Search batch jobs..."
        showPills={false}
        showBottomPills={false}
      />
      <div className="max-w-[1920px] mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <BatchProcessor className="p-0 border-none shadow-none max-w-none" />
        </div>
      </div>
    </div>
  )
}
