import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSettings, updateSetting } from '../../store/slices/settingsSlice';
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

const REASON_OPTIONS = [
  { value: 'baking and maintenance', label: 'Baking & Maintenance 🎂' },
  { value: 'heavy rain or inclement weather', label: 'Heavy Rain / Inclement Weather 🌧️' },
  { value: 'a private catering event', label: 'Private Catering Event 🎩' },
  { value: 'a public holiday', label: 'Public Holiday 🎈' },
  { value: 'outlet being out of ingredients / stock', label: 'Out of Ingredients / Stock 📦' },
  { value: 'custom', label: 'Custom Reason... ✏️' }
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { settings, isLoading: settingsLoading } = useSelector((state) => state.settings);
  const [timeFrame, setTimeFrame] = useState('Last 7 Days');
  const [selectedReasonOption, setSelectedReasonOption] = useState('baking and maintenance');
  const [customReasonText, setCustomReasonText] = useState('');

  useEffect(() => {
    dispatch(getSettings());
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
  }, [token, dispatch]);

  useEffect(() => {
    if (settings?.closeReason) {
      const match = REASON_OPTIONS.find(opt => opt.value === settings.closeReason);
      if (match) {
        setSelectedReasonOption(settings.closeReason);
        setCustomReasonText('');
      } else {
        setSelectedReasonOption('custom');
        setCustomReasonText(settings.closeReason);
      }
    }
  }, [settings?.closeReason]);

  const handleToggleOutlet = () => {
    const nextStatus = !settings?.isOutletOpen;
    const finalReason = selectedReasonOption === 'custom' ? customReasonText : selectedReasonOption;

    if (nextStatus) {
      // Opening the outlet
      dispatch(updateSetting({ key: 'isOutletOpen', value: true })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          toast.success('Outlet is now OPEN 🟢');
        } else {
          toast.error('Failed to open outlet');
        }
      });
    } else {
      // Closing the outlet: first save the closing reason, then toggle outlet status to closed
      dispatch(updateSetting({ key: 'closeReason', value: finalReason || 'baking and maintenance' })).then((reasonAction) => {
        if (reasonAction.meta.requestStatus === 'fulfilled') {
          dispatch(updateSetting({ key: 'isOutletOpen', value: false })).then((statusAction) => {
            if (statusAction.meta.requestStatus === 'fulfilled') {
              toast.success('Outlet is now CLOSED 🛑');
            } else {
              toast.error('Failed to close outlet');
            }
          });
        } else {
          toast.error('Failed to close outlet');
        }
      });
    }
  };

  const getChartData = () => {
    if (!stats?.revenueStats) return { labels: [], data: [], numDays: 7 };

    let numDays = 7;
    if (timeFrame === 'Last 30 Days') numDays = 30;
    else if (timeFrame === 'Year to Date') numDays = 90;

    const labels = [];
    const data = [];

    const statsMap = {};
    stats.revenueStats.forEach(s => {
      statsMap[s._id] = s.revenue;
    });

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const displayLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      labels.push(displayLabel);
      data.push(statsMap[dateStr] || 0);
    }

    return { labels, data, numDays };
  };

  const { labels, data, numDays } = getChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data,
        fill: true,
        backgroundColor: 'rgba(255, 111, 97, 0.1)',
        borderColor: '#FF6F61',
        tension: 0.4,
        pointBackgroundColor: '#FF6F61',
        pointBorderWidth: 2,
        pointRadius: numDays > 30 ? 1 : 4,
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
      {/* Outlet Store Status Control Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col gap-4 sm:gap-6 hover:shadow-md transition-all">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left flex-col sm:flex-row flex-1">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all shrink-0 ${
              settings?.isOutletOpen 
                ? 'bg-green-100 text-green-600 shadow-green-200' 
                : 'bg-red-100 text-red-600 shadow-red-200'
            }`}>
              <Clock className={`w-6 h-6 sm:w-[30px] sm:h-[30px] ${settings?.isOutletOpen ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-0.5 sm:mb-1">
                <h2 className="text-base sm:text-2xl font-black text-text">Outlet Status</h2>
                <span className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full relative flex ${settings?.isOutletOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                  {settings?.isOutletOpen && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  )}
                </span>
              </div>
              <p className="text-secondary font-medium text-xs sm:text-base leading-relaxed">
                {settings?.isOutletOpen 
                  ? 'Your outlet is currently OPEN. Customers can place orders normally.' 
                  : `Your outlet is currently CLOSED due to: "${settings?.closeReason || 'baking and maintenance'}".`
                }
              </p>
            </div>
          </div>
 
          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={handleToggleOutlet}
              disabled={settingsLoading}
              className={`w-full sm:w-48 h-11 sm:h-14 rounded-xl sm:rounded-2xl font-black text-white text-xs sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                settings?.isOutletOpen 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                  : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
              }`}
            >
              {settings?.isOutletOpen ? 'Close Outlet 🛑' : 'Open Outlet 🟢'}
            </button>
          </div>
        </div>

        {/* Dynamic reason input section */}
        <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
          <label className="text-xs font-black text-text uppercase tracking-widest">
            {settings?.isOutletOpen ? 'Set Reason for Closing (displays when closed):' : 'Update Closing Reason:'}
          </label>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedReasonOption}
                onChange={(e) => setSelectedReasonOption(e.target.value)}
                className="flex-1 bg-background px-5 py-3.5 rounded-2xl text-sm font-bold border-2 border-gray-100 outline-none focus:border-primary/30 transition-all text-text cursor-pointer"
              >
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {!settings?.isOutletOpen && (
                <button
                  onClick={() => {
                    const finalReason = selectedReasonOption === 'custom' ? customReasonText : selectedReasonOption;
                    dispatch(updateSetting({ key: 'closeReason', value: finalReason || 'baking and maintenance' })).then((action) => {
                      if (action.meta.requestStatus === 'fulfilled') {
                        toast.success('Close reason updated! 📝');
                      } else {
                        toast.error('Failed to update reason');
                      }
                    });
                  }}
                  disabled={settingsLoading}
                  className="bg-primary hover:bg-primary/95 text-white font-black px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-primary/10 active:scale-95 shrink-0"
                >
                  Update Reason
                </button>
              )}
            </div>

            {selectedReasonOption === 'custom' && (
              <div className="animate-fadeIn">
                <input
                  type="text"
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  placeholder="Type your custom closing reason here..."
                  className="w-full bg-background px-5 py-3.5 rounded-2xl text-sm font-bold border-2 border-primary/20 outline-none focus:border-primary/50 transition-all text-text"
                />
              </div>
            )}
          </div>
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
            { icon: <Users size={24} />, label: 'Active Users', value: stats?.usersCount || 0, color: 'bg-blue-100 text-blue-600', trend: '+8.1%' },
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
              <select 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="bg-background px-4 py-2 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/20 cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Year to Date">Year to Date</option>
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
