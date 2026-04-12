import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Layers, 
  TrendingUp,
  Settings,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <TrendingUp size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Banners', path: '/admin/banners', icon: <ImageIcon size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen overflow-y-auto">
      <div className="p-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
            C
          </div>
          <div>
            <span className="block text-lg font-black text-text leading-none">Cake</span>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Baker's Panel</span>
          </div>
        </Link>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-secondary hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : 'text-secondary hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3 font-bold">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
