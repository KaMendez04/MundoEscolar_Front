import Notification, { type NotificationProps } from "./Notification"

interface NotificationContainerProps {
  notifications: Omit<NotificationProps, "onClose">[]
  onClose: (id: string) => void
}

const NotificationContainer = ({ notifications, onClose }: NotificationContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  )
}

export default NotificationContainer
