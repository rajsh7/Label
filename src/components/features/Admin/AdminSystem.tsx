'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle, Database, Server, Activity } from 'lucide-react'

interface SystemStatus {
  database: 'healthy' | 'degraded' | 'down'
  api: 'healthy' | 'degraded' | 'down'
  storage: 'healthy' | 'degraded' | 'down'
  response_time_ms: number
  last_check: string
}

export const AdminSystem: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setStatus({
      database: 'healthy',
      api: 'healthy',
      storage: 'healthy',
      response_time_ms: 45,
      last_check: new Date().toISOString()
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!status) {
    return <div>Failed to load system status</div>
  }

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return <CheckCircle2 size={24} className="text-green-600" />
      case 'degraded':
        return <AlertCircle size={24} className="text-yellow-600" />
      case 'down':
        return <XCircle size={24} className="text-red-600" />
      default:
        return <AlertCircle size={24} className="text-gray-600" />
    }
  }

  const getStatusBadge = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-600">Healthy</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-600">Degraded</Badge>
      case 'down':
        return <Badge className="bg-red-100 text-red-600">Down</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-blue-600" />
                <h3 className="font-semibold">Database</h3>
              </div>
              {getStatusIcon(status.database)}
            </div>
            {getStatusBadge(status.database)}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Server size={24} className="text-purple-600" />
                <h3 className="font-semibold">API</h3>
              </div>
              {getStatusIcon(status.api)}
            </div>
            {getStatusBadge(status.api)}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={24} className="text-green-600" />
                <h3 className="font-semibold">Storage</h3>
              </div>
              {getStatusIcon(status.storage)}
            </div>
            {getStatusBadge(status.storage)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Response Time</span>
              <span className="text-2xl font-bold">{status.response_time_ms}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Check</span>
              <span className="text-sm">{new Date(status.last_check).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSystem