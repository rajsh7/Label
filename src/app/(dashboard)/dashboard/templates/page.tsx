import { DashboardHeader } from "@/components/dashboard/header"
import { TemplatesContent } from "@/components/dashboard/templates/templates-content"

export default function TemplatesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6">
        <TemplatesContent />
      </main>
    </div>
  )
}
