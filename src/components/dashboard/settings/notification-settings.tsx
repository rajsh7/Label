"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

const emailNotifications = [
  {
    id: "processing",
    label: "Label processing complete",
    description: "Get notified when your labels finish processing",
    defaultChecked: true,
  },
  {
    id: "weekly",
    label: "Weekly summary",
    description: "Receive a weekly digest of your label activity",
    defaultChecked: true,
  },
  {
    id: "tips",
    label: "Tips and tutorials",
    description: "Learn how to get the most out of LabelPro",
    defaultChecked: false,
  },
  {
    id: "updates",
    label: "Product updates",
    description: "Be the first to know about new features",
    defaultChecked: true,
  },
]

const pushNotifications = [
  {
    id: "push-processing",
    label: "Processing alerts",
    description: "Real-time notifications for label processing",
    defaultChecked: true,
  },
  {
    id: "push-errors",
    label: "Error alerts",
    description: "Get notified immediately if something goes wrong",
    defaultChecked: true,
  },
  {
    id: "push-promo",
    label: "Promotional notifications",
    description: "Special offers and discounts",
    defaultChecked: false,
  },
]

export function NotificationSettings() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', user.id)
        .single()
      
      if (data?.notification_settings) {
        setSettings(data.notification_settings)
      }
    }
  }

  const handleToggle = async (key: string, checked: boolean) => {
    if (!user) return
    
    const newSettings = { ...settings, [key]: checked }
    setSettings(newSettings)
    
    await supabase
      .from('profiles')
      .update({ notification_settings: newSettings })
      .eq('id', user.id)
  }

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      alert('Push notifications enabled!')
    }
  }
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Email Notifications</CardTitle>
          <CardDescription>Choose what emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailNotifications.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="text-foreground font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch 
                id={item.id} 
                checked={settings[item.id] ?? item.defaultChecked}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
                className="self-start sm:self-center"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Push Notifications</CardTitle>
          <CardDescription>Configure your browser push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={requestPushPermission} variant="outline" className="w-full">
            Enable Browser Notifications
          </Button>
          {pushNotifications.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="text-foreground font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch 
                id={item.id} 
                checked={settings[item.id] ?? item.defaultChecked}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
                className="self-start sm:self-center"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
