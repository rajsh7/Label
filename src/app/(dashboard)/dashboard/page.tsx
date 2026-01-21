import { DashboardHeader } from "@/components/dashboard/header"
import { RecentLabels } from "@/components/dashboard/recent-labels"
import { UsageStats } from "@/components/dashboard/usage-stats"
import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const { supabase, session } = await createUserClient()
  
  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const { data: designs } = await supabase
    .from('label_designs')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 sm:p-8 border border-border">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome to LabelPro</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6">Create, manage, and print professional labels for your e-commerce business</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a href="/dashboard/editor" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Create New Label
                  </button>
                </a>
                <a href="/dashboard/batch" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-background border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                    Batch Processing
                  </button>
                </a>
                <a href="/label-formats" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-background border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                    Browse Templates
                  </button>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/dashboard/editor" className="block p-6 sm:p-12 bg-card rounded-xl border border-border hover:border-primary transition-colors group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">Label Editor</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Design custom labels with drag-and-drop editor</p>
              </a>

              <a href="/dashboard/batch" className="block p-6 sm:p-12 bg-card rounded-xl border border-border hover:border-primary transition-colors group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-accent/20 transition-colors">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">Batch Processing</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Generate hundreds of labels from CSV files</p>
              </a>

              <a href="/label-formats" className="block p-6 sm:p-12 bg-card rounded-xl border border-border hover:border-primary transition-colors group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">Templates</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Browse 255+ pre-made label templates</p>
              </a>
            </div>

            <UsageStats profile={profile} />
            <RecentLabels designs={designs || []} />
          </div>
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Product</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                    <li><Link href="/label-formats" className="hover:text-foreground">Labels</Link></li>
                    <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                    <li><Link href="/integrations" className="hover:text-foreground">Integrations</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Company</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                    <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                    <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                    <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Resources</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/documentation" className="hover:text-foreground">Documentation</Link></li>
                    <li><Link href="/help-center" className="hover:text-foreground">Help Center</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                    <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                    <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-1 text-center">
                  <h3 className="font-semibold text-foreground mb-3">LabelPro</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">The complete platform for e-commerce label management.</p>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
                <p>© 2024 LabelPro. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
    </div>
  )
}
