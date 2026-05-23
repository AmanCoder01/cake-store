import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);
    if (notif.orderId) {
      navigate('/admin/orders');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-text tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Bell className="w-7 h-7" />
            </div>
            Notifications Center
          </h1>
          <p className="text-secondary font-semibold mt-1">
            Manage your real-time customer orders and store notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 transition-all shrink-0 cursor-pointer text-sm"
          >
            <Check size={18} />
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {/* Main notification list container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 text-secondary/40 rounded-full flex items-center justify-center">
              <Bell size={40} className="stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">All Caught Up!</h3>
              <p className="text-sm font-semibold text-secondary max-w-sm mt-1">
                You have no new notifications. New customer orders will show up here in real-time.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notif, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                  key={notif._id}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border transition-all ${
                    notif.isRead
                      ? 'bg-transparent border-gray-100 hover:bg-gray-50/50'
                      : 'bg-primary/5 border-primary/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold ${
                      notif.isRead 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {notif.type === 'NEW_ORDER' ? '🎂' : '🔔'}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black leading-tight ${notif.isRead ? 'text-text' : 'text-primary'}`}>
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm font-bold text-secondary leading-snug">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-secondary/70">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(notif.createdAt).toLocaleDateString(undefined, {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {notif.orderId && (
                      <button
                        onClick={() => handleNotificationClick(notif)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-text text-white font-bold rounded-xl hover:bg-text/90 transition-all text-xs shrink-0 cursor-pointer"
                      >
                        View Order
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
