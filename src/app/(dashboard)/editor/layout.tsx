import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className="lg:hidden">
        <DashboardSidebar />
      </div>
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
