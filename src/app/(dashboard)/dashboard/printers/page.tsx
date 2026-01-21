import { PrintersContent } from "@/components/dashboard/printers/printers-content"
import { DashboardHeader } from "@/components/dashboard/header"

export default function PrintersPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <PrintersContent />
      </main>
    </div>
  )
}
