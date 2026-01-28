'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  FileText,
  Activity,
  Shield,
  LogOut
} from 'lucide-react'

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Audit Logs", href: "/admin/logs", icon: FileText },
  { name: "System", href: "/admin/system", icon: Activity },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session?.user?.email, session?.user?.id)
      
      if (!session?.user) {
        console.log('No session, redirecting to login')
        window.location.href = '/login'
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, email, id')
        .eq('id', session.user.id)
        .single()

      console.log('Profile query result:', profile)
      console.log('Profile query error:', error)
      console.log('User ID from session:', session.user.id)
      console.log('is_admin value:', profile?.is_admin, typeof profile?.is_admin)

      // Temporary: Allow access for admin@labelpro.com regardless
      if (session.user.email === 'admin@labelpro.com') {
        console.log('Granting access to admin@labelpro.com')
        setIsAuthorized(true)
        return
      }

      if (!profile?.is_admin) {
        console.log('User is not admin, redirecting to dashboard')
        window.location.href = '/dashboard'
        return
      }

      console.log('User is admin, granting access')
      setIsAuthorized(true)
    } catch (error) {
      console.error('Admin access check failed:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-foreground">Admin Panel</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-background/50">
                  Back to App
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-background/50 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 LabelPro Admin Panel</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/admin/system" className="text-muted-foreground hover:text-foreground">
                System Status
              </Link>
              <Link href="/admin/logs" className="text-muted-foreground hover:text-foreground">
                Logs
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-foreground">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}