'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/Spinner'
import { Key, Copy, Plus, Trash2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  requests_today: number
  requests_limit: number
}

/**
 * ApiSettings component - manage API keys for Enterprise users
 */
export const ApiSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setApiKeys(
        (data || []).map((key: any) => ({
          id: key.id,
          name: key.name,
          key_prefix: key.key_prefix,
          created_at: key.created_at,
          last_used_at: key.last_used_at,
          requests_today: key.requests_today || 0,
          requests_limit: 2000, // 2000 requests per day
        }))
      )
    } catch (error) {
      console.error('Load API keys error:', error)
      showToast('Failed to load API keys', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      showToast('Please enter a name for the API key', 'error')
      return
    }

    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create API key')
      }

      setNewKey(result.api_key)
      setNewKeyName('')
      setShowNewKeyModal(false)
      loadApiKeys()
      showToast('API key created successfully', 'success')
    } catch (error) {
      console.error('Create API key error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to create API key',
        'error'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete API key')
      }

      loadApiKeys()
      showToast('API key deleted successfully', 'success')
    } catch (error) {
      console.error('Delete API key error:', error)
      showToast('Failed to delete API key', 'error')
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    showToast('API key copied to clipboard', 'success')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Key Modal */}
      {showNewKeyModal && (
        <Card className="mb-6 border-blue-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Create New API Key
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Key Name
                </label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleCreateKey}
                  loading={creating}
                  disabled={!newKeyName.trim()}
                >
                  Create Key
                </Button>
                <Button variant="outline" onClick={() => setShowNewKeyModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Key Display */}
      {newKey && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent>
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">
                  Your API key has been created
                </h3>
                <p className="text-sm text-green-800 mb-3">
                  Make sure to copy this key now. You won't be able to see it again!
                </p>
                <div className="flex items-center gap-2 bg-white p-3 rounded border border-green-200">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {newKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyKey(newKey)}
                  >
                    <Copy size={16} className="mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            API Keys
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Use API keys to authenticate requests to the LabelPro API
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setShowNewKeyModal(true)
            setNewKey(null)
          }}
        >
          <Plus size={18} className="mr-2" />
          Create API Key
        </Button>
      </div>

      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Key size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-[var(--color-text-secondary)] mb-4">
              No API keys found. Create your first API key to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Key size={20} className="text-[var(--color-text-secondary)]" />
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {key.name}
                      </h3>
                    </div>
                    <div className="ml-8 space-y-1">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        <code className="font-mono">{key.key_prefix}••••••••</code>
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                        {key.last_used_at &&
                          ` • Last used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Usage: {key.requests_today} / {key.requests_limit} requests today
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKey(key.id)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* API Documentation Link */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
                API Documentation
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Learn how to use the LabelPro API to integrate label generation into your
                applications.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open('/docs/api', '_blank')}
            >
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiSettings

