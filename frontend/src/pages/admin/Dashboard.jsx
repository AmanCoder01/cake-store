import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Cake as CakeIcon, 
  DollarSign as RupeeIcon, 
  Package, 
  ArrowUpRight,
  Plus,
  Clock,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await axios.get(`${APP_CONFIG.API_BASE_URL}/orders/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ordersRes = await axios.get(`${APP_CONFIG.API_BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data.orders.slice(0, 5));
      } catch (error) {
        toast.error('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  const chartData = {
    labels: stats?.revenueStats?.map(s => s._id) || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.revenueStats?.map(s => s.revenue) || [],
        fill: true,
        backgroundColor: 'rgba(255, 111, 97, 0.1)',
        borderColor: '#FF6F61',
        tension: 0.4,
        pointBackgroundColor: '#FF6F61',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };


  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-text mb-2">Admin Command Center</h1>
          <p className="text-secondary font-medium">Overview of your bakery's performance today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link to="/admin/products" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full md:w-48 h-12 rounded-2xl border-2 font-black">Manage Products</Button>
          </Link>
          <Link to="/admin/orders" className="flex-1 md:flex-none">
            <Button className="w-full md:w-48 h-12 rounded-2xl shadow-xl shadow-primary/20 font-black">View All Orders</Button>
          </Link>
        </div>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
        {loading ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-44 rounded-[32px]" />)
        ) : (
          [
            { icon: <RupeeIcon size={24} />, label: 'Total Revenue', value: `₹${stats?.totalRevenue.toFixed(2)}`, color: 'bg-green-100 text-green-600', trend: '+12.5%' },
            { icon: <ShoppingBag size={24} />, label: 'Total Orders', value: stats?.ordersCount, color: 'bg-primary/10 text-primary', trend: '+5.4%' },
            { icon: <CakeIcon size={24} />, label: 'Products', value: stats?.productsCount, color: 'bg-accent/10 text-accent', trend: '+2 new' },
            { icon: <Users size={24} />, label: 'Active Users', value: '1,284', color: 'bg-blue-100 text-blue-600', trend: '+8.1%' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 xl:p-8 rounded-2xl xl:rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-start gap-4 hover:shadow-md transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-secondary text-sm font-black uppercase tracking-widest mb-1">{item.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-text">{item.value}</h3>
                  <span className="text-[10px] font-black bg-green-50 text-green-500 px-2 py-0.5 rounded-full">{item.trend}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-12">
        {/* revenue graph */}
        <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-text flex items-center gap-3">
              <TrendingUp className="text-primary" /> Revenue Analytics
            </h3>
            {!loading && (
              <select className="bg-background px-4 py-2 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/20 cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            )}
          </div>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex flex-col justify-end gap-2">
                <div className="flex items-end gap-4 h-full px-4">
                   {[1,2,3,4,5,6,7].map(i => <Skeleton key={i} className={`flex-1 rounded-t-lg`} style={{ height: `${20 + Math.random()*60}%` }} />)}
                </div>
                <div className="h-4 w-full bg-gray-50 rounded-full" />
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* recent orders */}
        <div className="bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-50 h-full">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-text">Recent Orders</h3>
            {!loading && (
              <Link to="/admin/orders" className="p-2 bg-background rounded-full hover:text-primary transition-all">
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
          
          <div className="space-y-6">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                      <Package size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-text line-clamp-1 text-sm">{order.user?.name || 'Guest'}</p>
                      <p className="text-[10px] text-secondary font-black uppercase tracking-wider">₹{order.totalPrice.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`} title={order.status} />
                  </div>
                ))}
                
                {recentOrders.length === 0 && (
                  <div className="py-20 text-center text-secondary font-medium">No orders yet</div>
                )}
                
                <Link to="/admin/orders">
                  <Button variant="outline" className="w-full mt-10 rounded-2xl border-2 font-black">View Full History</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
