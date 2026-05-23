import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Cake, LayoutDashboard, Menu, X, Heart, Bell } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { APP_CONFIG } from '../../config/constants';
import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="glass sticky top-0 z-50 px-4 md:px-8 lg:px-16 xl:px-24 py-3 shadow-sm">
      <div className="max-w-[1536px] mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Cake className="text-primary w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            {APP_CONFIG.APP_NAME}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text hover:text-primary font-medium transition-colors">Home</Link>
          <Link to="/products" className="text-text hover:text-primary font-medium transition-colors">Cakes</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-text hover:text-primary font-medium flex items-center gap-1 transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/wishlist" 
            className="text-text hover:text-primary w-9 h-9 flex items-center justify-center rounded-full hover:bg-primary/5 transition-all shrink-0"
            title="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <Link 
            to="/cart" 
            className="relative text-text hover:text-primary w-9 h-9 flex items-center justify-center rounded-full hover:bg-primary/5 transition-all shrink-0"
            title="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <div className="relative shrink-0">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-text hover:text-primary w-9 h-9 flex items-center justify-center rounded-full hover:bg-primary/5 transition-all shrink-0 cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 z-50 animate-fade-in max-h-[400px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-50">
                      <span className="font-black text-sm text-text">Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-left">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-center text-secondary py-6 font-semibold">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => {
                              markAsRead(notif._id);
                              if (notif.orderId) {
                                navigate(user.role === 'admin' ? '/admin/orders' : '/orders');
                              }
                              setNotifOpen(false);
                            }}
                            className={`p-3 rounded-2xl cursor-pointer text-left transition-all ${
                              notif.isRead 
                                ? 'bg-transparent hover:bg-gray-50' 
                                : 'bg-primary/5 hover:bg-primary/10 border-l-2 border-primary'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <p className={`text-xs font-black text-text ${!notif.isRead && 'text-primary'}`}>
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] font-semibold text-secondary mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-gray-400 font-bold block mt-1.5">
                              {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <User size={16} />
                </div>
                <span className="hidden lg:inline font-bold text-sm">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-text hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-all shrink-0"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block btn-primary py-1.5 px-5 text-sm font-semibold">
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-text hover:text-primary rounded-full hover:bg-primary/5 transition-all shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl z-50">
          <div className="px-6 py-6 space-y-2">
            <Link to="/" onClick={closeMenu} className="block px-4 py-3 rounded-2xl text-text hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Home
            </Link>
            <Link to="/products" onClick={closeMenu} className="block px-4 py-3 rounded-2xl text-text hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Cakes
            </Link>
            <Link to="/wishlist" onClick={closeMenu} className="block px-4 py-3 rounded-2xl text-text hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Wishlist
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={closeMenu} className="block px-4 py-3 rounded-2xl text-text hover:bg-primary/5 hover:text-primary font-medium transition-all">
                Dashboard
              </Link>
            )}
            <Link to="/orders" onClick={closeMenu} className="block px-4 py-3 rounded-2xl text-text hover:bg-primary/5 hover:text-primary font-medium transition-all">
              My Orders
            </Link>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-text text-sm">{user.name}</p>
                      <p className="text-xs text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={closeMenu} className="block text-center bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
