"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Tags, Edit, FolderOpen, Layers, History, Printer, CreditCard, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Templates", href: "/dashboard/templates", icon: Tags },
  { name: "Editor", href: "/dashboard/editor", icon: Edit },
  { name: "My Labels", href: "/dashboard/labels", icon: FolderOpen },
  { name: "Batch", href: "/dashboard/batch", icon: Layers },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Printers", href: "/dashboard/printers", icon: Printer },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <GlassCard variant="sidebar" className="h-full w-20 lg:w-64 flex flex-col p-4 mr-4 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
          <Tags className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-white hidden lg:block tracking-wide">LabelPro</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "group-hover:text-blue-400 disabled-transition")} />
              <span className="font-medium hidden lg:block">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 gap-3 pl-3"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden lg:block">Logout</span>
        </Button>
      </div>
    </GlassCard>
  )
}
