"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, Layers, Printer, Clock } from "lucide-react"

interface UsageStatsProps {
  profile: any
}

export function UsageStats({ profile }: UsageStatsProps) {
  const tierLimits: Record<string, number> = {
    free: 50,
    pro: 1000,
    enterprise: 999999
  }

  const limit = tierLimits[profile?.subscription_tier || 'free']
  const used = profile?.labels_generated_this_month || 0
  const percentage = Math.round((used / limit) * 100)

  const stats = [
    {
      name: "Labels This Month",
      value: used.toString(),
      change: `${limit - used} remaining`,
      changeType: "neutral",
      icon: FileImage,
    },
    {
      name: "Storage Used",
      value: `${profile?.storage_used_mb || 0}MB`,
      change: "of 1GB",
      changeType: "neutral",
      icon: Layers,
    },
    {
      name: "Subscription",
      value: profile?.subscription_tier?.toUpperCase() || 'FREE',
      change: profile?.subscription_status || 'active',
      changeType: "positive",
      icon: Printer,
    },
    {
      name: "Usage",
      value: `${percentage}%`,
      change: `${used}/${limit}`,
      changeType: percentage > 80 ? "negative" : "positive",
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={stat.changeType === 'negative' ? 'text-red-500' : 'text-green-500'}>
                {stat.change}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
