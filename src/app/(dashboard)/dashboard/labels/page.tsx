import { DashboardHeader } from "@/components/dashboard/header"
import { LabelsContent } from "@/components/dashboard/labels/labels-content"

export default function LabelsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <LabelsContent />
      </main>
    </div>
  )
}
