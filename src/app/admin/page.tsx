import { AdminDashboard } from '@/components/features/Admin/AdminDashboard'

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of system status and key metrics
        </p>
      </div>

      <AdminDashboard />
    </div>
  )
}

