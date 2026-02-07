'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false) // Start with false for instant UI render
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)
      setEmail(user.email || '')

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setFirstName(profileData.first_name || '')
        setLastName(profileData.last_name || '')
        setBio(profileData.bio || '')
      }

      setLoading(false)
    }
    loadUserData()
  }, [])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Save error:', error)
        alert('Failed to save changes: ' + error.message)
      } else {
        alert('Changes saved successfully')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save changes')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0f1115] pb-12">
      <section className="flex flex-col gap-2 py-8 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Account & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#590df2] to-purple-400">Settings</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Manage your personal details and preferences.</p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start px-6 md:px-12 max-w-[1600px] mx-auto">
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-3 sticky top-24">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-[2rem] transition-all font-medium ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-white/5 shadow-md text-[#590df2] font-bold ring-2 ring-[#590df2]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile Information
          </button>
        </aside>

        <div className="flex-1 space-y-8 max-w-5xl">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group">
                  <div className="size-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800 ring-8 ring-slate-50 dark:ring-white/5 shadow-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black">
                      {firstName?.[0] || email?.[0]?.toUpperCase() || 'U'}
                      {lastName?.[0] || ''}
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-4">First Name</label>
                    <input
                      className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-[#590df2]/20 focus:border-[#590df2] transition-all outline-none"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-4">Last Name</label>
                    <input
                      className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-[#590df2]/20 focus:border-[#590df2] transition-all outline-none"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-4">Email Address</label>
                    <input
                      className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none cursor-not-allowed opacity-60"
                      type="email"
                      value={email}
                      disabled
                    />
                    <p className="text-xs text-slate-500 ml-4">Email cannot be changed</p>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-4">Bio</label>
                    <textarea
                      className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium resize-none h-32 focus:ring-4 focus:ring-[#590df2]/20 focus:border-[#590df2] transition-all outline-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[2rem] font-bold hover:bg-[#590df2] hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
