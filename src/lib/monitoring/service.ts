interface HealthCheck {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  error?: string
  timestamp: string
}

interface SystemMetrics {
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  requests: {
    total: number
    errors: number
    errorRate: number
  }
}

export class MonitoringService {
  private static instance: MonitoringService
  private metrics: Map<string, any> = new Map()

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  async checkDatabaseHealth(): Promise<HealthCheck> {
    const start = Date.now()
    try {
      const { createUserClient } = await import('@/lib/supabase/server')
      const { supabase } = await createUserClient()
      
      await supabase.from('profiles').select('id').limit(1)
      
      return {
        service: 'database',
        status: 'healthy',
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  getSystemMetrics(): SystemMetrics {
    const uptime = process.uptime()
    const memUsage = process.memoryUsage()
    
    return {
      uptime,
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      requests: {
        total: this.metrics.get('requests_total') || 0,
        errors: this.metrics.get('requests_errors') || 0,
        errorRate: this.calculateErrorRate()
      }
    }
  }

  incrementRequestCount() {
    const current = this.metrics.get('requests_total') || 0
    this.metrics.set('requests_total', current + 1)
  }

  incrementErrorCount() {
    const current = this.metrics.get('requests_errors') || 0
    this.metrics.set('requests_errors', current + 1)
  }

  private calculateErrorRate(): number {
    const total = this.metrics.get('requests_total') || 0
    const errors = this.metrics.get('requests_errors') || 0
    return total > 0 ? (errors / total) * 100 : 0
  }

  async performHealthCheck(): Promise<{ status: string; checks: HealthCheck[] }> {
    const checks = [await this.checkDatabaseHealth()]
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy')
    
    return { 
      status: hasUnhealthy ? 'unhealthy' : 'healthy', 
      checks 
    }
  }
}

export const monitoring = MonitoringService.getInstance()