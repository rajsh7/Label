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
  WifiOff,
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

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  // Auto-collapse on mobile only
  const shouldCollapse = isMobile

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('Auth error:', userError)
          setError('Authentication failed')
          return
        }
        
        if (user) {
          // Try to get profile, create if doesn't exist
          let { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
                subscription_tier: 'free',
                subscription_status: 'active'
              })
              .select()
              .single()
            
            if (createError) {
              console.error('Profile creation error:', createError)
              // Use basic user data as fallback
              profileData = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
                subscription_tier: 'free'
              }
            } else {
              profileData = newProfile
            }
          } else if (profileError) {
            console.error('Profile fetch error:', profileError)
            // Use basic user data as fallback
            profileData = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              subscription_tier: 'free'
            }
          }
          
          setProfile({ ...profileData, email: user.email })
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
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

  const getPlanName = () => {
    if (!profile?.subscription_tier) return 'Free Plan'
    if (profile.subscription_tier === 'pro') return 'Pro - $7.99/mo'
    if (profile.subscription_tier === 'enterprise') return 'Enterprise - $39.99/mo'
    return 'Free Plan'
  }

  return (
    <aside className={`${shouldCollapse ? 'w-16' : 'w-64'} border-r border-border/20 bg-background/80 backdrop-blur-md flex flex-col transition-all duration-300`}>
      <div className="h-16 flex items-center gap-2 px-3 border-b border-border/20">
        <Link href="/" className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Tags className="w-4 h-4 text-accent-foreground" />
          </div>
          {!shouldCollapse && <span className="font-semibold text-sidebar-foreground truncate">LabelPro</span>}
        </Link>
      </div>

      {!isOnline && (
        <div className="px-3 py-2 bg-destructive/10 border-b border-border/20">
          <div className="flex items-center gap-2 text-xs text-destructive">
            <WifiOff className="w-3 h-3" />
            {!shouldCollapse && <span>Offline</span>}
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-5 rounded-lg text-base font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                shouldCollapse && "justify-center"
              )}
              title={shouldCollapse ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!shouldCollapse && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border/20 space-y-3">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-4 rounded-lg text-base font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                shouldCollapse && "justify-center"
              )}
              title={shouldCollapse ? item.name : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!shouldCollapse && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>

      {!shouldCollapse && (
        <div className="px-3 py-4 border-t border-border">
          {loading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="px-3 py-2 text-xs text-destructive">Failed to load</div>
          ) : (
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile?.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">{getUserInitials()}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{getPlanName()}</p>
              </div>
            </Link>
          )}
        </div>
      )}
      {shouldCollapse && (
        <div className="px-3 py-4 border-t border-border">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse mx-auto" />
          ) : (
            <Link href="/dashboard/settings" className="block">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile?.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover mx-auto"
                  title={profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto" title={profile?.full_name || profile?.email?.split('@')[0] || 'User'}>
                  <span className="text-xs font-medium text-muted-foreground">{getUserInitials()}</span>
                </div>
              )}
            </Link>
          )}
        </div>
      )}
    </aside>
  )
}
