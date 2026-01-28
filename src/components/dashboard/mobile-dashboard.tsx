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
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-accent"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Tags className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">LabelPro</span>
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {getCurrentPageName()}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r border-border" onClick={e => e.stopPropagation()}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Tags className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">LabelPro</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Menu Bottom Navigation */}
            <div className="px-4 py-4 border-t border-border space-y-2">
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-border">
              <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile?.full_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">{getUserInitials()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
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