import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { INotification } from "@/types/notification";
import { setBlockedStatus } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";



interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: async () => { },
  markAsRead: async () => { },
  fetchNotifications: async () => { },
})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Fetch notifications on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && status) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, status]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleReconnect = () => {
      console.log('Socket reconnected - refetching notifications');
      fetchNotifications();
      fetchUnreadCount();
    };

    const handleNewNotification = (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast(notification.title, {
        description: notification.message,
        action: {
          label: 'View',
          onClick: () => markAsRead(notification._id),
        },
      });
    };

    const handleError = (error: Error) => {
      console.error('Socket error:', error);
      toast.error('Lost connection to notification service');
    };

    const handlePendingNotifications = (pendingNotifications: INotification[]) => {
      if (pendingNotifications.length > 0) {
        setNotifications((prev) => [...pendingNotifications, ...prev]);
        setUnreadCount((prev) => prev + pendingNotifications.length);
        // Show toast for the most recent notification
        const mostRecent = pendingNotifications[0];
        toast(`${pendingNotifications.length} new notifications`, {
          description: mostRecent.message,
          action: {
            label: 'View All',
            onClick: () => {/* Navigate to notifications page */ },
          },
        });
      }
    };

    const handleAccountBlocked = (data: { reason: string }) => {
      console.log('Account blocked event received:', data.reason);
      dispatch(setBlockedStatus({
        status: false,
        blockReason: data.reason || 'Your account has been blocked by an admin.'
      }));
      toast.error('Account Blocked', {
        description: data.reason || 'Your account has been blocked. Redirecting...',
      });
      // Small delay to allow toast to be seen before redirect
      setTimeout(() => {
        window.location.href = '/blocked-account';
      }, 2000);
    };

    socket.on('connect', handleReconnect);
    socket.on('notification', handleNewNotification);
    socket.on('error', handleError);
    socket.on('pending-notifications', handlePendingNotifications);
    socket.on('account:blocked', handleAccountBlocked);

    socket.emit('get-pending-notifications');


    return () => {
      socket.off('connect', handleReconnect);
      socket.off('notification', handleNewNotification);
      socket.off('error', handleError);
      socket.off('pending-notifications', handlePendingNotifications);
      socket.off('account:blocked', handleAccountBlocked);
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {

      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.patch('/notifications/read-all');
      if (response.data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};