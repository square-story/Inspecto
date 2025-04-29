import { useNotification } from "@/contexts/NotificationContext"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Bell } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification()
  const [open, setOpen] = useState(false)

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setOpen(false)
  }
  const handleNotificationClick = async (id: string) => {
    markAsRead(id)
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-primary">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  className={cn(
                    "flex flex-col gap-1 p-4 text-left hover:bg-secondary-100 border-b",
                    !notification.isRead && "bg-accent"
                  )}
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-primary">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-primary-600">{notification.message}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}