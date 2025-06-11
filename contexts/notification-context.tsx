"use client"

import { createContext, useContext, useState, useEffect } from "react"
import demoData from '@/data/demo-data.json'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  entityId?: string
  entityType?: string
  actionType?: string
  actorName?: string
  metadata?: any
  link?: string
  createdAt: string
  updatedAt: string
}

interface NotificationContextType {
  notifications: Notification[]
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  loading: false,
  markAsRead: async () => {},
  refreshNotifications: async () => {},
  unreadCount: 0,
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  // Load notifications from demo data
  const fetchNotifications = async () => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get notifications from localStorage or use demo data
    const storedNotifications = localStorage.getItem('demo-notifications')
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      // Convert date strings to Date objects and set initial state
      const processedNotifications = demoData.notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
      }))
      setNotifications(processedNotifications)
      localStorage.setItem('demo-notifications', JSON.stringify(processedNotifications))
    }
    
    setLoading(false)
  }

  // Mark notification as read
  const markAsRead = async (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id
        ? { ...notification, read: true, updatedAt: new Date().toISOString() }
        : notification
    )
    setNotifications(updatedNotifications)
    localStorage.setItem('demo-notifications', JSON.stringify(updatedNotifications))
  }

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchNotifications()
  }

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length

  // Process notifications to ensure metadata is parsed
  const processedNotifications = notifications.map(notification => {
    if (notification.metadata && typeof notification.metadata === 'string') {
      try {
        return {
          ...notification,
          metadata: JSON.parse(notification.metadata)
        }
      } catch (e) {
        return notification
      }
    }
    return notification
  })

  return (
    <NotificationContext.Provider
      value={{
        notifications: processedNotifications,
        loading,
        markAsRead,
        refreshNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
