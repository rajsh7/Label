import { DashboardHeader } from "@/components/dashboard/header"
import { HelpContent } from "@/components/dashboard/help/help-content"

export default function HelpPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <HelpContent />
      </main>
    </div>
  )
}
