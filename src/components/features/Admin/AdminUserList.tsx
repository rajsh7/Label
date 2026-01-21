'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, User, Shield, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  subscription_tier: 'free' | 'pro' | 'enterprise'
  subscription_status: string
  is_admin: boolean
  created_at: string
  labels_used_this_month: number
  batches_used_this_month: number
  avatar_url?: string
  company_name?: string
}

export const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          email, 
          full_name, 
          company_name,
          avatar_url,
          subscription_tier, 
          subscription_status, 
          is_admin, 
          created_at,
          labels_used_this_month,
          batches_used_this_month,
          trial_ends_at
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const formattedUsers = (users || []).map(user => ({
        ...user,
        subscription_tier: user.subscription_tier || 'free',
        subscription_status: user.subscription_status || 'active',
        labels_used_this_month: user.labels_used_this_month || 0,
        batches_used_this_month: user.batches_used_this_month || 0
      }))
      
      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.email.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="search"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                            ) : user.is_admin ? (
                              <Shield size={20} className="text-purple-600" />
                            ) : (
                              <User size={20} className="text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name || user.company_name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.company_name && user.full_name && (
                              <p className="text-xs text-muted-foreground">{user.company_name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize ${
                            user.subscription_tier === 'enterprise'
                              ? 'bg-purple-100 text-purple-600'
                              : user.subscription_tier === 'pro'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.subscription_tier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-muted-foreground">
                          <div>{user.labels_used_this_month} labels</div>
                          <div>{user.batches_used_this_month} batches</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            user.subscription_status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.subscription_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminUserList