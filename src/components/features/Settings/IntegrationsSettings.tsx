'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/Spinner'
import { Store, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export interface Integration {
  id: string
  platform: 'shopify' | 'woocommerce' | 'custom'
  name: string
  webhook_url: string
  api_key?: string
  status: 'active' | 'inactive' | 'error'
  last_sync?: string
}

/**
 * IntegrationsSettings component - manage WMS integrations
 */
export const IntegrationsSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'shopify' | 'woocommerce' | 'custom' | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setIntegrations((data || []) as Integration[])
    } catch (error) {
      console.error('Load integrations error:', error)
      showToast('Failed to load integrations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: 'shopify' | 'woocommerce' | 'custom', config: any) => {
    try {
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, ...config }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect integration')
      }

      showToast('Integration connected successfully', 'success')
      loadIntegrations()
      setActiveTab(null)
    } catch (error) {
      console.error('Connect integration error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to connect integration',
        'error'
      )
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return

    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect integration')
      }

      showToast('Integration disconnected successfully', 'success')
      loadIntegrations()
    } catch (error) {
      console.error('Disconnect integration error:', error)
      showToast('Failed to disconnect integration', 'error')
    }
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
      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Available Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shopify */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveTab('shopify')}
          >
            <CardContent className="text-center">
              <Store size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Shopify</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Automatically generate labels when orders are placed
              </p>
            </CardContent>
          </Card>

          {/* WooCommerce */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveTab('woocommerce')}
          >
            <CardContent className="text-center">
              <Store size={48} className="mx-auto text-purple-600 mb-4" />
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">WooCommerce</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Sync orders and generate labels automatically
              </p>
            </CardContent>
          </Card>

          {/* Custom Webhook */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveTab('custom')}
          >
            <CardContent className="text-center">
              <ExternalLink size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Custom Webhook</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Connect any platform via webhook URL
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Integrations */}
      {integrations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
            Active Integrations
          </h2>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          integration.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : integration.status === 'error'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {integration.status === 'active' ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <XCircle size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {integration.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] capitalize">
                          {integration.platform}
                          {integration.last_sync &&
                            ` • Last sync: ${new Date(integration.last_sync).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Forms */}
      {activeTab && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] capitalize">
              Connect {activeTab}
            </h3>
          </CardHeader>
          <CardContent>
            {activeTab === 'shopify' && <ShopifyConfigForm onConnect={handleConnect} />}
            {activeTab === 'woocommerce' && <WooCommerceConfigForm onConnect={handleConnect} />}
            {activeTab === 'custom' && <CustomWebhookConfigForm onConnect={handleConnect} />}
            <Button variant="outline" onClick={() => setActiveTab(null)} className="mt-4">
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Shopify Configuration Form
 */
const ShopifyConfigForm: React.FC<{
  onConnect: (platform: 'shopify', config: any) => void
}> = ({ onConnect }) => {
  const [shopUrl, setShopUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConnect('shopify', {
        shop_url: shopUrl,
        api_key: apiKey,
        api_secret: apiSecret,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Shop URL
        </label>
        <Input
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
          placeholder="your-shop.myshopify.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          API Key
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Your Shopify API key"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          API Secret
        </label>
        <Input
          type="password"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          placeholder="Your Shopify API secret"
          required
        />
      </div>
      <Button type="submit" variant="primary" loading={loading}>
        Connect Shopify
      </Button>
    </form>
  )
}

/**
 * WooCommerce Configuration Form
 */
const WooCommerceConfigForm: React.FC<{
  onConnect: (platform: 'woocommerce', config: any) => void
}> = ({ onConnect }) => {
  const [storeUrl, setStoreUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConnect('woocommerce', {
        store_url: storeUrl,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Store URL
        </label>
        <Input
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          placeholder="https://yourstore.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Consumer Key
        </label>
        <Input
          type="password"
          value={consumerKey}
          onChange={(e) => setConsumerKey(e.target.value)}
          placeholder="Your WooCommerce consumer key"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Consumer Secret
        </label>
        <Input
          type="password"
          value={consumerSecret}
          onChange={(e) => setConsumerSecret(e.target.value)}
          placeholder="Your WooCommerce consumer secret"
          required
        />
      </div>
      <Button type="submit" variant="primary" loading={loading}>
        Connect WooCommerce
      </Button>
    </form>
  )
}

/**
 * Custom Webhook Configuration Form
 */
const CustomWebhookConfigForm: React.FC<{
  onConnect: (platform: 'custom', config: any) => void
}> = ({ onConnect }) => {
  const [name, setName] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConnect('custom', {
        name: name || 'Custom Integration',
        webhook_url: webhookUrl,
        api_key: apiKey,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Integration Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Integration"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Webhook URL
        </label>
        <Input
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://your-platform.com/webhook"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          API Key (Optional)
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Optional authentication key"
        />
      </div>
      <Button type="submit" variant="primary" loading={loading}>
        Connect Webhook
      </Button>
    </form>
  )
}

export default IntegrationsSettings

