"use client"

import { useState } from "react"
import { Bell, Check, Trash2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Label batch completed",
    message: "Your batch of 250 Amazon FBA labels has been processed successfully.",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New printer connected",
    message: "DYMO LabelWriter 450 has been successfully connected to your account.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Low label stock",
    message: "Your Zebra ZD420 printer has only 50 labels remaining.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    title: "Template saved",
    message: "Your custom Walmart shipping label template has been saved.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Account upgraded",
    message: "Welcome to LabelPro Pro! You now have access to unlimited labels.",
    time: "1 day ago",
    read: true,
  },
]

export function NotificationsContent() {
  const [notificationList, setNotificationList] = useState(notifications)

  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notificationList.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "transition-all hover:shadow-md",
              !notification.read && "border-accent/50 bg-accent/5"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  notification.type === "success" && "bg-green-500/10",
                  notification.type === "warning" && "bg-yellow-500/10",
                  notification.type === "info" && "bg-blue-500/10"
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="bg-accent text-accent-foreground">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notificationList.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  )
}
