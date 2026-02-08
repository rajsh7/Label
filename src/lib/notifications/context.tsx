"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      isRead: false
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const clearAll = () => {
    setNotifications([])
  }

  useEffect(() => {
    const handleTemplateCreated = (e: any) => {
      addNotification({
        type: 'success',
        title: 'Template Created',
        message: e.detail?.name ? `"${e.detail.name}" has been created successfully.` : 'Your template has been created successfully.'
      })
    }

    const handleTemplateDownloaded = (e: any) => {
      addNotification({
        type: 'info',
        title: 'Template Downloaded',
        message: e.detail?.name ? `"${e.detail.name}" has been downloaded.` : 'Your template has been downloaded successfully.'
      })
    }

    window.addEventListener('template:created', handleTemplateCreated)
    window.addEventListener('template:downloaded', handleTemplateDownloaded)

    return () => {
      window.removeEventListener('template:created', handleTemplateCreated)
      window.removeEventListener('template:downloaded', handleTemplateDownloaded)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}