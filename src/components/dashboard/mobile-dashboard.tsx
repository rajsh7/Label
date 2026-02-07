"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  HelpCircle,
  CreditCard,
  History,
  Printer,
  Tags,
  Edit,
  Layers,
  Menu,
  X,
  Mail,
  Tag,
  Barcode,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editor", href: "/dashboard/editor", icon: Edit },
  { name: "Templates", href: "/dashboard/templates", icon: Tags },
  { name: "Batch Processing", href: "/dashboard/batch", icon: Layers },
  { name: "My Labels", href: "/dashboard/labels", icon: FolderOpen },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Printers", href: "/dashboard/printers", icon: Printer },
]

const toolsNavigation = [
  { name: "Address Labels", href: "/dashboard/tools/address-maker", icon: Mail },
  { name: "FNSKU Maker", href: "/dashboard/tools/fnsku-maker", icon: Tag },
  { name: "Barcode Maker", href: "/dashboard/tools/barcode-maker", icon: Barcode },
  { name: "Warning Maker", href: "/dashboard/tools/warning-maker", icon: AlertTriangle },
]

const bottomNavigation = [
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function MobileDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile({ ...profileData, email: user.email })
      }
    }
    
    loadUserData()
  }, [])

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const getCurrentPageName = () => {
    const allNavItems = [...navigation, ...bottomNavigation]
    const currentItem = allNavItems.find(item => item.href === pathname)
    return currentItem?.name || 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/10 px-4 py-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <Tags className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-sm text-blue-600">LabelPro</span>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-700">
            {getCurrentPageName()}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white/90 backdrop-blur-md border-r border-white/20" onClick={e => e.stopPropagation()}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Tags className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-blue-600">LabelPro</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:text-blue-600 hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              <div className="pt-4 mt-4 border-t border-border">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tools
                </p>
                {toolsNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:text-blue-600 hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Menu Bottom Navigation */}
            <div className="px-4 py-4 border-t border-white/20 space-y-2">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:text-blue-600 hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-white/20">
              <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile?.full_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-700">{getUserInitials()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-slate-700">
                    {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {profile?.subscription_tier === 'pro' ? 'Pro Plan' : 
                     profile?.subscription_tier === 'enterprise' ? 'Enterprise' : 'Free Plan'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-4">
        {children}
      </main>
    </div>
  )
}