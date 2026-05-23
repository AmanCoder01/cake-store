import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, 
  Search, 
  Trash2, 
  X, 
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  User,
  ShoppingBag
} from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${APP_CONFIG.API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`${APP_CONFIG.API_BASE_URL}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order set to ${status}`);
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-orange-100 text-orange-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-text mb-2">Order Fulfillment</h1>
          <p className="text-secondary font-medium">Track and manage customer deliveries.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background border-transparent focus:bg-white focus:border-primary/20 outline-none font-medium transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-gray-50/50 text-secondary text-xs font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Order Details</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Total</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-10 w-24 rounded-lg" /></td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 rounded-full" />
                          <Skeleton className="h-3 w-24 rounded-full" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-8 py-6 text-right"><Skeleton className="w-10 h-10 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-black text-text uppercase tracking-wider text-sm">#{order._id.slice(-8)}</p>
                        <p className="text-xs text-secondary font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">
                           {order.user?.name?.charAt(0) || 'G'}
                         </div>
                         <div>
                           <p className="font-bold text-text text-sm">{order.user?.name || 'Guest Customer'}</p>
                           <p className="text-xs text-secondary">{order.user?.email || 'N/A'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-text">₹{order.totalPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{order.paymentMethod}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[1.5px] ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {orders.length === 0 && !loading && (
            <div className="py-20 text-center text-secondary font-medium">No orders found yet.</div>
          )}
        </div>
      </div>

      {/* order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-[40px] shadow-2xl overflow-hidden max-h-full flex flex-col"
            >
              <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-3xl font-black text-text uppercase tracking-tight">Order Details</h2>
                  <p className="text-secondary font-bold text-xs uppercase tracking-[2px] mt-1">ID: #{selectedOrder._id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                 {/* items */}
                 <div className="lg:col-span-2 space-y-10">
                   <div>
                     <h3 className="text-xl font-black text-text mb-6">Ordered Items</h3>
                     <div className="space-y-4">
                       {selectedOrder.orderItems.map((item, i) => (
                         <div key={i} className="flex items-center gap-6 p-4 bg-background rounded-[24px] border border-gray-100">
                           <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                           <div className="flex-grow">
                             <h4 className="font-black text-text">{item.name}</h4>
                             <p className="text-secondary font-bold">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                           </div>
                           <p className="text-xl font-black text-text">₹{(item.quantity * item.price).toFixed(2)}</p>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-black text-secondary uppercase tracking-[2px] mb-4">Customer Info</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <User size={24} />
                          </div>
                          <div>
                            <p className="font-black text-text">{selectedOrder.user?.name || 'Guest'}</p>
                            <p className="text-xs text-secondary font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-secondary uppercase tracking-[2px] mb-4">Shipping To</h4>
                        <div className="flex gap-4">
                          <Truck size={20} className="text-primary shrink-0" />
                          <p className="text-sm text-secondary font-semibold leading-relaxed">
                            {selectedOrder.shippingAddress.address}, <br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode} <br />
                            {selectedOrder.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                   </div>
                 </div>

                 {/* sidebar summary */}
                 <div className="space-y-8">
                   <div className="bg-background rounded-3xl p-8 border border-gray-100">
                     <h3 className="text-xl font-black text-text mb-6">Order Status</h3>
                     <div className="space-y-3">
                       {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                         <button 
                           key={status}
                           onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                           className={`w-full py-3 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                             selectedOrder.status === status
                               ? getStatusColor(status) + ' ring-4 ring-current ring-opacity-10'
                               : 'bg-white text-gray-400 hover:text-text'
                           }`}
                         >
                           {status}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-secondary font-bold">Total Bill</span>
                        <span className="text-3xl font-black text-primary">₹{selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-center text-[10px] font-black text-secondary uppercase tracking-[2px]">
                         Paid via {selectedOrder.paymentMethod} • {selectedOrder.isPaid ? 'CONFIRMED' : 'PENDING'}
                      </p>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
