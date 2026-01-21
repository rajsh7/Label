"use client"

import { useState, useEffect } from "react"
import { Check, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"

const integrations = [
  {
    id: "amazon",
    name: "Amazon Seller Central",
    description: "Import FBA labels directly from your Amazon account",
    icon: "/amazon-logo.png",
    connected: true,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync orders and generate shipping labels automatically",
    icon: "/shopify-logo.png",
    connected: true,
  },
  {
    id: "ebay",
    name: "eBay",
    description: "Connect your eBay store for seamless label management",
    icon: "/ebay-logo-display.png",
    connected: false,
  },
  {
    id: "walmart",
    name: "Walmart Marketplace",
    description: "Import Walmart shipping labels with one click",
    icon: "/walmart-logo.png",
    connected: false,
  },
  {
    id: "shipstation",
    name: "ShipStation",
    description: "Integrate with ShipStation for advanced shipping workflows",
    icon: "/shipstation-logo.png",
    connected: true,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect LabelPro to 5,000+ apps via Zapier",
    icon: "/zapier-logo.png",
    connected: false,
  },
]

export function IntegrationSettings() {
  const [user, setUser] = useState<any>(null)
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([])
  const [apiKeys, setApiKeys] = useState({ prod: '', test: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data } = await supabase
        .from('profiles')
        .select('connected_integrations, api_key_prod, api_key_test')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setConnectedIntegrations(data.connected_integrations || [])
        setApiKeys({
          prod: data.api_key_prod || '',
          test: data.api_key_test || ''
        })
      }
    }
  }

  const toggleIntegration = async (integrationId: string, isConnected: boolean) => {
    if (!user) return
    setLoading(true)

    let newIntegrations = [...connectedIntegrations]
    if (isConnected) {
      newIntegrations = newIntegrations.filter(id => id !== integrationId)
    } else {
      newIntegrations.push(integrationId)
    }

    const { error } = await supabase
      .from('profiles')
      .update({ connected_integrations: newIntegrations })
      .eq('id', user.id)

    if (!error) {
      setConnectedIntegrations(newIntegrations)
    }
    setLoading(false)
  }

  const generateApiKey = (type: 'prod' | 'test') => {
    return `lp_${type}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }

  const regenerateKey = async (type: 'prod' | 'test') => {
    if (!user || !confirm('Are you sure? This will invalidate the old key.')) return
    setLoading(true)

    const newKey = generateApiKey(type)
    const field = type === 'prod' ? 'api_key_prod' : 'api_key_test'

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: newKey })
      .eq('id', user.id)

    if (!error) {
      setApiKeys({ ...apiKeys, [type]: newKey })
      alert('API key regenerated successfully!')
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const maskApiKey = (key: string) => {
    if (!key) return 'lp_****_****************************'
    return key.substring(0, 8) + '****************************'
  }
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Connected Integrations</CardTitle>
          <CardDescription>Manage your connected platforms and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const isConnected = connectedIntegrations.includes(integration.id)
              return (
              <div
                key={integration.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={integration.icon || "/placeholder.svg"}
                      alt={integration.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{integration.name}</p>
                      {isConnected && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-0">
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Button
                  variant={isConnected ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleIntegration(integration.id, isConnected)}
                  disabled={loading}
                  className={
                    isConnected ? "bg-transparent w-full sm:w-auto" : "bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                  }
                >
                  {isConnected ? "Disconnect" : "Connect"}
                  {!isConnected && <ExternalLink className="w-3 h-3 ml-2" />}
                </Button>
              </div>
            )})}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">API Access</CardTitle>
          <CardDescription>Manage your API keys for custom integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4">
              <div className="min-w-0">
                <p className="font-medium text-foreground">Production API Key</p>
                <p className="text-sm text-muted-foreground font-mono break-all">{maskApiKey(apiKeys.prod)}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent w-full sm:w-auto"
                  onClick={() => copyToClipboard(apiKeys.prod)}
                  disabled={!apiKeys.prod}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent w-full sm:w-auto"
                  onClick={() => regenerateKey('prod')}
                  disabled={loading}
                >
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4">
              <div className="min-w-0">
                <p className="font-medium text-foreground">Test API Key</p>
                <p className="text-sm text-muted-foreground font-mono break-all">{maskApiKey(apiKeys.test)}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent w-full sm:w-auto"
                  onClick={() => copyToClipboard(apiKeys.test)}
                  disabled={!apiKeys.test}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent w-full sm:w-auto"
                  onClick={() => regenerateKey('test')}
                  disabled={loading}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
