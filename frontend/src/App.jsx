import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSettings } from './store/slices/settingsSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Component to automatically scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


// Customer Pages
import Home from './pages/customer/Home';
import ProductList from './pages/customer/ProductList';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Login from './pages/customer/Login';
import Signup from './pages/customer/Signup';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import Wishlist from './pages/customer/Wishlist';
import AboutUs from './pages/customer/AboutUs';
import BakingProcess from './pages/customer/BakingProcess';
import PrivacyPolicy from './pages/customer/PrivacyPolicy';
import Terms from './pages/customer/Terms';
import ManageAddresses from './pages/customer/ManageAddresses';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BannerManagement from './pages/admin/BannerManagement';
import AdminNotifications from './pages/admin/AdminNotifications';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Layout for customer routes
const CustomerContainer = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-8 max-w-[1536px]">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Layout for admin routes
const AdminContainer = () => (
  <ProtectedRoute isAdmin={true}>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </ProtectedRoute>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route element={<AdminContainer />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/banners" element={<BannerManagement />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
        </Route>

        {/* Customer Routes */}
        <Route element={<CustomerContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><ManageAddresses /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/baking-process" element={<BakingProcess />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Catch-all for non-existent routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
