import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, Truck, CheckCircle2, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${APP_CONFIG.API_BASE_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data.data.orders);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-orange-100 text-orange-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-12 rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-black text-text">Past Cravings</h1>
        <Link to="/products">
          <Button variant="outline" size="sm" className="rounded-xl">Order New Cake</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border-2 border-dashed border-gray-100">
           <div className="w-24 h-24 bg-background text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
             <Package size={48} />
           </div>
           <h3 className="text-2xl font-black text-text mb-4">No orders yet</h3>
           <p className="text-secondary mb-10">You haven't placed any orders yet. Let's change that!</p>
           <Link to="/products">
             <Button size="lg" className="rounded-2xl">Browse Bakery</Button>
           </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={order._id}
              className="bg-white rounded-2xl sm:rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-50">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <ShoppingBag size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-secondary uppercase tracking-[2px] mb-1">Order ID: #{order._id.slice(-8)}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-text">₹{order.totalPrice.toFixed(2)}</span>
                        <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-secondary uppercase mb-1">Date</p>
                      <p className="font-black text-text">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    {order.status === 'Processing' && (
                       <div className="flex items-center gap-2 text-primary font-black animate-pulse">
                         <Clock size={18} />
                         <span>Preparing...</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-text mb-6">Ordered Items</h4>
                    <div className="flex flex-wrap gap-4">
                      {order.orderItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-background p-3 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-sm text-text line-clamp-1">{item.name}</p>
                            <p className="text-xs text-secondary font-bold">{item.quantity} x ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <h4 className="text-lg font-black text-text mb-6">Delivery Address</h4>
                    <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-4">
                      <Truck size={20} className="text-primary shrink-0" />
                      <div className="text-sm font-medium text-secondary">
                        <p className="text-text font-bold mb-1">{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-2 text-primary">{order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-secondary">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-500' : 'bg-orange-400'}`} />
                   <span>Payment Method: {order.paymentMethod} ({order.isPaid ? 'Paid' : 'Unpaid'})</span>
                </div>
                {order.deliveredAt && (
                  <p>Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
