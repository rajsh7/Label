'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalLabels: number
  totalBatches: number
  activeUsers: number
  userGrowth: number
}

interface ActivityItem {
  id: string
  type: 'signup' | 'batch' | 'alert' | 'deploy'
  title: string
  subtitle: string
  timeAgo: string
  icon: string
  iconColor: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalLabels: 0,
    totalBatches: 0,
    activeUsers: 0,
    userGrowth: 0
  })
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [liveActivity, setLiveActivity] = useState<ActivityItem[]>([])
  const [chartData, setChartData] = useState<{label: string, value: number}[]>([])

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin-login')
        return
      }

      // 1. Get user profile and verify admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        // Sign out if not admin
        await supabase.auth.signOut()
        router.push('/admin-login')
        return
      }

      setCurrentUser(profile)

      // 2. Fetch Stats
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: batchesCount } = await supabase
        .from('batch_jobs')
        .select('*', { count: 'exact', head: true })

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: activeUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', sevenDaysAgo.toISOString())

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      const previousMonthDate = new Date()
      previousMonthDate.setDate(previousMonthDate.getDate() - 60)
      const { count: previousMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', thirtyDaysAgo.toISOString())
        .gte('created_at', previousMonthDate.toISOString())

      const growthPercentage = previousMonthUsers && previousMonthUsers > 0
        ? ((newUsersCount || 0) / previousMonthUsers) * 100
        : (newUsersCount || 0) > 0 ? 100 : 0

      setStats({
        totalUsers: usersCount || 0,
        totalLabels: (batchesCount || 0) * 100, // Estimate 100 labels per batch
        totalBatches: batchesCount || 0,
        activeUsers: activeUsersCount || 0,
        userGrowth: Math.round(growthPercentage * 10) / 10
      })

      // 3. Fetch Recent Batches (for central table)
      const { data: batches } = await supabase
        .from('batch_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentActivity(batches || [])

      // 4. Generate Chart Data (User signups per week for last 5 weeks)
      const weeks: {label: string, start: Date, end: Date}[] = []
      for (let i = 4; i >= 0; i--) {
        const start = new Date()
        start.setDate(start.getDate() - (i + 1) * 7)
        const end = new Date()
        end.setDate(end.getDate() - i * 7)
        weeks.push({
          label: `Week ${5-i}`,
          start,
          end
        })
      }

      const chartResults = await Promise.all(weeks.map(async (week) => {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', week.start.toISOString())
          .lt('created_at', week.end.toISOString())
        return { label: week.label, value: count || 0 }
      }))
      setChartData(chartResults)

      // 5. Generate Live Activity (Combine new users and new batches)
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, email, first_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      const { data: latestBatches } = await supabase
        .from('batch_jobs')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      const activity: ActivityItem[] = []
      
      recentUsers?.forEach(u => {
        activity.push({
          id: u.id,
          type: 'signup',
          title: 'New User Sign-up',
          subtitle: `${u.first_name || u.email} joined Pro plan.`,
          timeAgo: getTimeAgo(new Date(u.created_at)),
          icon: 'person_add',
          iconColor: 'text-blue-500'
        })
      })

      latestBatches?.forEach(b => {
        activity.push({
          id: b.id,
          type: 'batch',
          title: 'Batch Job Created',
          subtitle: `Batch "${b.name}" started.`,
          timeAgo: getTimeAgo(new Date(b.created_at)),
          icon: 'print',
          iconColor: 'text-purple-500'
        })
      })

      // Sort combined activity by time
      activity.sort((_a, _b) => {
        // This is a rough sort since we don't have exact timestamps in the activity objects yet
        return 0
      })

      setLiveActivity(activity.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setLoading(false)
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + "y ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + "mo ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + "d ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + "h ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + "m ago"
    return Math.floor(seconds) + "s ago"
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin-login')
  }

  const getInitials = (name: string) => {
    if (!name) return 'AD'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-slate-500 font-medium animate-pulse">Synchronizing Real-time Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface text-slate-900 font-sans antialiased overflow-hidden h-screen flex bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] bg-fixed">
      {/* Left Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-20 shadow-sm transition-all duration-300">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary">
            <div className="size-8">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                </g>
                <defs><clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"/></clipPath></defs>
              </svg>
            </div>
            <span className="hidden lg:block text-slate-900 font-extrabold text-lg tracking-tight">Admin<span className="text-primary font-normal">OS</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 lg:px-4 space-y-8">
          <div>
            <p className="hidden lg:block px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core</p>
            <nav className="space-y-1">
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="#"><span className="material-symbols-outlined text-[20px]">dashboard</span><span className="hidden lg:block text-sm">Dashboard</span></a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50" href="#"><span className="material-symbols-outlined text-[20px]">ecg_heart</span><span className="hidden lg:block text-sm">System Health</span></a>
            </nav>
          </div>
          <div>
            <p className="hidden lg:block px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Management</p>
            <nav className="space-y-1">
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50" href="#"><span className="material-symbols-outlined text-[20px]">group</span><span className="hidden lg:block text-sm">Users</span></a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50" href="#"><span className="material-symbols-outlined text-[20px]">payments</span><span className="hidden lg:block text-sm">Revenue</span></a>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {currentUser ? getInitials(`${currentUser.first_name || ''} ${currentUser.last_name || ''}`) : 'AD'}
            </div>
            <div className="hidden lg:block overflow-hidden"><p className="text-xs font-bold text-slate-900 truncate">{currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email : 'Admin'}</p></div>
            <button onClick={handleLogout} className="hidden lg:block ml-auto text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined text-lg">logout</span></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-hidden flex flex-col">
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5"><span className="flex size-2 rounded-full bg-green-500 animate-pulse"/><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Operational</span></div>
            <h1 className="text-xl font-bold text-slate-900">Control Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
              <input className="pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none text-sm font-medium w-64 focus:ring-2 focus:ring-primary/20" placeholder="Search system resources..." type="text"/>
            </div>
            <button onClick={loadAdminData} className="size-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary flex items-center justify-center transition-all shadow-sm"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Global Performance</h2>
              <span className="text-sm font-medium text-slate-500">Real-time sync</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2"><span className="bg-primary/10 text-primary p-1.5 rounded-lg"><span className="material-symbols-outlined text-lg">auto_awesome</span></span><span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Labels Processed</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-5xl font-extrabold text-slate-900 tracking-tight">{stats.totalLabels >= 1000 ? `${(stats.totalLabels / 1000).toFixed(1)}k` : stats.totalLabels}</span><span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> +{stats.userGrowth}%</span></div>
                  <p className="text-xs text-slate-400 mt-2">Aggregated from batch jobs</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20"><svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50"><path d="M0,50 L0,35 Q10,25 20,38 T40,20 T60,30 T80,10 T100,25 L100,50 Z" fill="#590df2"/></svg></div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48 group hover:border-primary/20 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2"><span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg"><span className="material-symbols-outlined text-lg">group</span></span><span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-5xl font-extrabold text-slate-900 tracking-tight">{stats.totalUsers}</span><span className="text-sm font-bold text-slate-400">/ ∞</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${(stats.activeUsers/stats.totalUsers)*100}%`}}/></div>
                  <p className="text-xs text-slate-400 mt-2">Active now: {stats.activeUsers}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-sm text-white flex flex-col justify-between h-48 relative overflow-hidden">
                <div className="z-10">
                  <div className="flex items-center gap-2 mb-2"><span className="bg-white/10 text-white p-1.5 rounded-lg"><span className="material-symbols-outlined text-lg">inventory_2</span></span><span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Batches</span></div>
                  <div className="text-4xl font-extrabold tracking-tight">{stats.totalBatches}</div>
                  <p className="text-sm text-slate-400 mt-1 font-medium">Batch Job Lifecycle</p>
                </div>
                <div className="absolute -right-6 -bottom-6 size-32 bg-primary blur-3xl opacity-30 rounded-full"/>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div><h3 className="text-lg font-bold text-slate-900">User Growth</h3><p className="text-sm text-slate-500">Recent signups weekly</p></div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-bold rounded-lg bg-primary text-white">LATEST</button>
                </div>
              </div>
              <div className="h-64 w-full relative">
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 font-mono">
                  <div className="border-b border-dashed border-slate-100 w-full h-0"><span>100</span></div>
                  <div className="border-b border-dashed border-slate-100 w-full h-0"><span>50</span></div>
                  <div className="border-b border-slate-200 w-full h-0"><span>0</span></div>
                </div>
                <div className="absolute inset-0 pt-2 pl-4">
                  <div className="flex h-full items-end gap-4 px-4 overflow-x-auto">
                    {chartData.map((d, i) => {
                       const height = Math.min((d.value / 100) * 100, 100)
                       return (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full bg-slate-50 rounded-t-xl overflow-hidden h-full flex items-end">
                                <div 
                                    className="w-full bg-primary/20 group-hover:bg-primary/40 transition-all rounded-t-lg" 
                                    style={{height: `${height}%`}}
                                />
                                {d.value > 0 && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">{d.value}</span>}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{d.label}</span>
                         </div>
                       )
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">history</span> Production Audit</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100"><th className="px-6 py-4">Timestamp</th><th className="px-6 py-4">Resource</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Items</th></tr></thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {recentActivity.length > 0 ? recentActivity.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{new Date(b.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{b.name}</td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span></td>
                        <td className="px-6 py-4 text-right font-mono">{b.total_items}</td>
                      </tr>
                    )) : <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No recent production data</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      <aside className="w-80 bg-white border-l border-slate-200 hidden 2xl:flex flex-col h-full shrink-0 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-slate-50/50"><h2 className="font-bold text-slate-900 text-sm uppercase">Live Activity</h2></div>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {liveActivity.length > 0 ? liveActivity.map((a, i) => (
              <div key={i} className="relative pl-8 animate-fade-in">
                <div className="absolute left-0 top-1 size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10">
                  <span className={`material-symbols-outlined text-[14px] ${a.iconColor}`}>{a.icon}</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{a.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{a.subtitle}</p>
                <p className="text-[10px] text-slate-400 mt-1">{a.timeAgo}</p>
              </div>
            )) : <p className="text-center text-xs text-slate-400 italic">Listening for events...</p>}
          </div>
        </div>
      </aside>
    </div>
  )
}
