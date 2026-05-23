import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../config/constants';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const knownNotificationIds = useRef(new Set());

  // Setup custom axios instance with auth headers
  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem('token')}`
    }
  });

  // Request browser Notification API permission
  useEffect(() => {
    if (user && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('System Notification permission granted.');
        }
      }).catch(console.error);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!token && !localStorage.getItem('token')) return;
    try {
      const response = await axios.get(
        `${APP_CONFIG.API_BASE_URL}/notifications`,
        getAxiosConfig()
      );
      if (response.data?.status === 'success') {
        const notifs = response.data.data.notifications;
        
        // Background polling native system notification triggers
        if (knownNotificationIds.current.size > 0 && document.visibilityState === 'hidden') {
          const brandNewUnread = notifs.filter(
            n => !n.isRead && !knownNotificationIds.current.has(n._id)
          );
          
          brandNewUnread.forEach(notif => {
            // Play sound in background
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
              audio.volume = 0.45;
              audio.play().catch(() => {});
            } catch (_) {}

            // Trigger OS notification
            if ('Notification' in window && Notification.permission === 'granted') {
              const systemNotif = new Notification(notif.title, {
                body: notif.message,
                icon: 'https://cdn-icons-png.flaticon.com/512/992/992717.png', // Sweet cake icon
                tag: notif._id
              });
              
              systemNotif.onclick = () => {
                window.focus();
                window.location.href = user?.role === 'admin' ? '/admin/orders' : '/orders';
                systemNotif.close();
              };
            }
          });
        }

        // Store fetched notification IDs to prevent duplicates
        notifs.forEach(n => knownNotificationIds.current.add(n._id));

        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.patch(
        `${APP_CONFIG.API_BASE_URL}/notifications/${id}/read`,
        {},
        getAxiosConfig()
      );
      if (response.data?.status === 'success') {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.patch(
        `${APP_CONFIG.API_BASE_URL}/notifications/read-all`,
        {},
        getAxiosConfig()
      );
      if (response.data?.status === 'success') {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Connect sockets & fetch initial list on user login
  useEffect(() => {
    if (user && token) {
      fetchNotifications();

      // Derive Socket.io host from API_BASE_URL
      const socketUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
      
      // Establish Socket connection
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
      });
      
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.io connected:', socket.id);
        socket.emit('register', user._id);
      });

      socket.on('new-notification', (notif) => {
        // Prepend new notification and record ID
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        knownNotificationIds.current.add(notif._id);

        // Play subtle sound if browser allows (even in background)
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
          audio.volume = 0.45;
          audio.play().catch(() => {});
        } catch (_) {}

        // If tab is in background, show native OS system notification
        if (document.visibilityState === 'hidden') {
          if ('Notification' in window && Notification.permission === 'granted') {
            const systemNotif = new Notification(notif.title, {
              body: notif.message,
              icon: 'https://cdn-icons-png.flaticon.com/512/992/992717.png',
              tag: notif._id
            });
            
            systemNotif.onclick = () => {
              window.focus();
              window.location.href = user?.role === 'admin' ? '/admin/orders' : '/orders';
              systemNotif.close();
            };
          }
        } else {
          // Display beautiful in-app micro-animated toast notification if active
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-fade-in' : 'animate-fade-out'
              } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex border border-gray-100/80 overflow-hidden transition-all duration-300 transform translate-y-0`}
              style={{
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)'
              }}
            >
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg shrink-0 font-bold">
                    {notif.type === 'NEW_ORDER' ? '🎂' : '🚚'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-black text-text leading-tight">{notif.title}</p>
                    <p className="mt-1 text-xs font-semibold text-secondary leading-snug">{notif.message}</p>
                  </div>
                </div>
              </div>
              <div className="border-l border-gray-50 flex items-stretch">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-4 text-xs font-black text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors uppercase tracking-wider shrink-0"
                >
                  Got it
                </button>
              </div>
            </div>
          ), { duration: 6000 });
        }
      });

      // Cleanup on logout or unmount
      return () => {
        socket.disconnect();
        console.log('Socket.io disconnected');
      };
    } else {
      // User is not logged in or logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      knownNotificationIds.current.clear();
    }
  }, [user, token]);

  // Optional: Background polling as solid fallback if WebSockets are unavailable/blocked
  useEffect(() => {
    if (user && token) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // Poll every 15 seconds
      
      return () => clearInterval(interval);
    }
  }, [user, token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
