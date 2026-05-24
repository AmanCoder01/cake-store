import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, Truck, CheckCircle2, ShoppingBag, Clock, ChevronRight, Star, X } from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import Skeleton from '../../components/ui/Skeleton';
import Image from '../../components/ui/Image';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);

  // Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState('');
  const [reviewProductName, setReviewProductName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleOpenReviewModal = (productId, productName) => {
    setReviewProductId(productId);
    setReviewProductName(productName);
    setRating(5);
    setReviewText('');
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error('Please write some comments for your review.');
      return;
    }
    setSubmittingReview(true);
    try {
      await axios.post(`${APP_CONFIG.API_BASE_URL}/reviews/${reviewProductId}`, {
        rating,
        review: reviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Thank you! Your review has been submitted.');
      setReviewedProductIds(prev => [...prev, reviewProductId]);
      handleCloseReviewModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchOrdersAndReviews = async () => {
      try {
        // Fetch orders
        const ordersRes = await axios.get(`${APP_CONFIG.API_BASE_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data.data.orders);

        // Fetch user reviews
        const reviewsRes = await axios.get(`${APP_CONFIG.API_BASE_URL}/reviews/myreviews`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productIds = reviewsRes.data.data.reviews.map(r => r.product);
        setReviewedProductIds(productIds);
      } catch (error) {
        toast.error('Failed to fetch orders history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndReviews();
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
                          <Image src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                          <div className="flex-grow">
                            <p className="font-bold text-sm text-text line-clamp-1">{item.name}</p>
                            {item.selectedVariant && (
                              <p className="text-[10px] text-primary font-black uppercase tracking-wider mb-0.5">{item.selectedVariant}</p>
                            )}
                            <p className="text-xs text-secondary font-bold">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                          </div>
                          {order.status === 'Delivered' && (
                            reviewedProductIds.includes(item.product) ? (
                              <span className="ml-2 px-3 py-1.5 bg-green-50 text-green-500 rounded-xl text-xs font-extrabold border border-green-100 flex items-center gap-1">
                                <CheckCircle2 size={12} fill="currentColor" className="text-green-100" /> Reviewed
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenReviewModal(item.product, item.name)}
                                className="ml-2 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-extrabold transition-all duration-300 shadow-sm"
                              >
                                Review
                              </button>
                            )
                          )}
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
              
              <div className="bg-gray-50 px-4 sm:px-6 py-2.5 flex flex-col xs:flex-row sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0 text-[10px] font-extrabold uppercase tracking-wider text-secondary border-t border-gray-100/50">
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

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseReviewModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 z-10 overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-orange-400" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-text">Write a Review</h3>
                  <p className="text-sm text-secondary font-medium mt-1">For: <span className="text-primary font-bold">{reviewProductName}</span></p>
                </div>
                <button
                  onClick={handleCloseReviewModal}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating selection */}
                <div className="flex flex-col items-center py-4 bg-background rounded-2xl border border-gray-50">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-secondary mb-3">Your Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform active:scale-90"
                      >
                        <Star
                          size={32}
                          className="transition-colors duration-200"
                          fill={star <= (hoverRating || rating) ? '#FDE047' : 'none'}
                          stroke={star <= (hoverRating || rating) ? '#FDE047' : '#D1D5DB'}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-text mt-2">
                    {rating === 5 && '😍 Outstanding masterpiece!'}
                    {rating === 4 && '😊 Delighted and delicious!'}
                    {rating === 3 && '😐 Average sweet treat.'}
                    {rating === 2 && '😟 Not what I expected.'}
                    {rating === 1 && '🤢 Very disappointing.'}
                  </span>
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-secondary">Your Feedback</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about the flavor, texture, design and delivery..."
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-grow h-12 rounded-2xl"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseReviewModal}
                    className="px-6 rounded-2xl h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
