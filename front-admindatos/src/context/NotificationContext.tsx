import { createContext, useContext, useState, type ReactNode } from "react"
import NotificationContainer from "../components/Notifications/NotificationContainer"
import type { NotificationType } from "../components/Notifications/Notification"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = { id, type, title, message, duration }
    
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const success = (title: string, message?: string, duration?: number) => {
    showNotification("success", title, message, duration)
  }

  const error = (title: string, message?: string, duration?: number) => {
    showNotification("error", title, message, duration)
  }

  const warning = (title: string, message?: string, duration?: number) => {
    showNotification("warning", title, message, duration)
  }

  const info = (title: string, message?: string, duration?: number) => {
    showNotification("info", title, message, duration)
  }

  return (
    <NotificationContext.Provider 
      value={{ showNotification, success, error, warning, info }}
    >
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  
  if (context === undefined) {
    throw new Error("useNotification debe usarse dentro de un NotificationProvider")
  }
  
  return context
}
