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
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const clearAll = () => {
    setNotifications([])
  }

  useEffect(() => {
    const handleUserSignup = () => {
      addNotification({
        type: 'success',
        title: 'Welcome to LabelPro!',
        message: 'Your account has been created successfully. Start creating amazing labels!'
      })
    }

    const handleTemplateCreated = () => {
      addNotification({
        type: 'success',
        title: 'Template saved',
        message: 'Your custom label template has been saved successfully.'
      })
    }

    const handleLabelPrinted = () => {
      addNotification({
        type: 'info',
        title: 'Label printed',
        message: 'Your label has been sent to the printer successfully.'
      })
    }

    window.addEventListener('user:signup', handleUserSignup)
    window.addEventListener('template:created', handleTemplateCreated)
    window.addEventListener('label:printed', handleLabelPrinted)

    return () => {
      window.removeEventListener('user:signup', handleUserSignup)
      window.removeEventListener('template:created', handleTemplateCreated)
      window.removeEventListener('label:printed', handleLabelPrinted)
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