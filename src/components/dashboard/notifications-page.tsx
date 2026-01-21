"use client"

import { useNotifications } from "@/lib/notifications/context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CircleCheckBig, Info, CircleAlert } from "lucide-react"

export function NotificationsPage() {
  const { notifications, markAsRead, clearAll } = useNotifications()
  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CircleCheckBig className="w-5 h-5 text-green-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <CircleAlert className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10'
      case 'info':
        return 'bg-blue-500/10'
      case 'warning':
        return 'bg-yellow-500/10'
      default:
        return 'bg-blue-500/10'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto" onClick={clearAll}>
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Mark all as read</span>
          <span className="sm:hidden">Mark read</span>
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border text-card-foreground shadow-sm transition-all hover:shadow-md ${
                !notification.isRead
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}