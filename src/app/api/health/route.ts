import { NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring/service'

export async function GET() {
  try {
    const healthCheck = await monitoring.performHealthCheck()
    const metrics = monitoring.getSystemMetrics()
    
    const response = {
      status: healthCheck.status,
      timestamp: new Date().toISOString(),
      uptime: metrics.uptime,
      memory: metrics.memory,
      services: healthCheck.checks,
      version: process.env.npm_package_version || '1.0.0'
    }
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503
    
    return NextResponse.json(response, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}