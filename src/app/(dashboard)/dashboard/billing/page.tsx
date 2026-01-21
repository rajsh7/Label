import { DashboardHeader } from "@/components/dashboard/header"
import { BillingContent } from "@/components/dashboard/billing/billing-content"

export default function BillingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <BillingContent />
      </main>
    </div>
  )
}
