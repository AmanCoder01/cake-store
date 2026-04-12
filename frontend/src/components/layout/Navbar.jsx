import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Cake, LayoutDashboard, Menu, X, Heart } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { APP_CONFIG } from '../../config/constants';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/wishlist" className="text-text hover:text-primary transition-colors">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="relative group">
            <ShoppingCart className="text-text group-hover:text-primary transition-colors" size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <User size={18} />
                </div>
                <span className="hidden lg:inline font-medium text-sm">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-text hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
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
            className="md:hidden p-2 text-text hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
