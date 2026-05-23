import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Clock, Truck, ShoppingCart, Minus, Plus, ChevronRight, Heart, MessageSquare } from 'lucide-react';
import { getProductDetails } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { getWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading, isError, message } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Reviews local states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (user) {
      dispatch(getWishlist());
    }
    
    // Fetch product reviews
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${APP_CONFIG.API_BASE_URL}/reviews/${id}`);
        setReviews(data.data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();

    window.scrollTo(0, 0);
  }, [dispatch, id, user]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      stock: product.stock,
      quantity: qty
    }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    dispatch(toggleWishlist(product._id)).then((res) => {
      if (res.payload.action === 'added') toast.success('Added to wishlist');
      else toast.success('Removed from wishlist');
    });
  };

  const isInWishlist = () => {
    return wishlistItems.some(item => (item.product?._id || item.product) === product?._id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Skeleton className="h-[600px] rounded-[40px]" />
          <div className="space-y-8">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-secondary mb-8">{message}</p>
        <Link to="/products">
          <Button variant="outline">Back to Gallery</Button>
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-secondary mb-8 sm:mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-primary transition-colors">Cakes</Link>
        <ChevronRight size={14} />
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-24">
        {/* image gallery */}
        <div className="space-y-6">
          <motion.div 
            layoutId={`img-${product._id}`}
            className="aspect-square rounded-2xl sm:rounded-[40px] overflow-hidden bg-white border border-gray-100 shadow-sm relative group"
          >
            <img 
              src={product.images[activeImg]?.url || 'https://via.placeholder.com/800'} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={handleToggleWishlist}
              className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all active:scale-90 ${
                isInWishlist() ? 'bg-primary text-white' : 'bg-white/80 text-text hover:text-red-500'
              }`}
            >
              <Heart size={24} fill={isInWishlist() ? "currentColor" : "none"} />
            </button>
          </motion.div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all shrink-0 ${
                  activeImg === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`View ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* product info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-black">
              <Star size={14} fill="currentColor" />
              <span>{product.ratingsAverage}</span>
              <span className="text-secondary font-medium ml-1">({product.ratingsQuantity} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text mb-4 sm:mb-6 leading-tight">{product.name}</h1>
          
          <div className="flex flex-wrap items-baseline gap-3 mb-8">
            <span className="text-2xl sm:text-4xl font-black text-primary">₹{product.price}</span>
            <span className="text-base sm:text-lg text-secondary line-through">₹{(product.price * 1.2).toFixed(2)}</span>
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Save 20%</span>
          </div>

          <p className="text-secondary text-lg leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 pb-10 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-text">Free Shipping</h4>
                <p className="text-sm text-secondary">On orders over ₹99</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-text">Hygienic Procces</h4>
                <p className="text-sm text-secondary">100% safe & certified</p>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-background rounded-2xl p-1">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary transition-all disabled:opacity-50"
                  disabled={qty <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="w-16 text-center font-black text-xl">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary transition-all disabled:opacity-50"
                  disabled={qty >= product.stock}
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </p>
                <p className="text-xs text-secondary font-medium">Delivered in 2-4 hours</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-grow h-14 text-lg rounded-2xl group" 
                variant="outline"
              >
                <ShoppingCart size={20} className="mr-2 group-hover:rotate-12 transition-transform" /> Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-grow h-14 text-lg rounded-2xl shadow-xl shadow-primary/20"
              >
                Buy It Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="mt-20 pt-16 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-3">
              <MessageSquare size={28} className="text-primary" /> Customer Stories
            </h2>
            <p className="text-secondary text-sm font-medium mt-1">Real experiences shared by our wonderful cake lovers</p>
          </div>
          {reviews.length > 0 && (
            <span className="text-sm font-extrabold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              {reviews.length} Verified {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          )}
        </div>

        {loadingReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 md:col-span-2 rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Rating Summary Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-50 shadow-sm h-fit">
              <h3 className="text-lg font-extrabold text-text mb-6">Rating Summary</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <span className="text-5xl font-black text-text tracking-tighter">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : product.ratingsAverage}
                </span>
                <div>
                  <div className="flex gap-1 text-accent mb-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const avg = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : product.ratingsAverage;
                      return (
                        <Star 
                          key={star} 
                          size={18} 
                          fill={star <= Math.round(avg) ? "currentColor" : "none"} 
                          stroke="currentColor" 
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider">Based on {reviews.length} reviews</p>
                </div>
              </div>

              {/* Progress Bars for Stars */}
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const total = reviews.length;
                  const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={stars} className="flex items-center gap-4 text-sm font-medium">
                      <button className="w-12 text-secondary font-bold hover:text-primary transition-colors flex items-center justify-end gap-1">
                        <span>{stars}</span>
                        <Star size={12} fill="currentColor" className="text-accent" />
                      </button>
                      <div className="flex-grow h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className="w-10 text-right text-secondary font-bold text-xs">{Math.round(pct)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-secondary/40 mb-4">
                    <MessageSquare size={28} />
                  </div>
                  <h4 className="text-lg font-extrabold text-text mb-2">No reviews yet</h4>
                  <p className="text-secondary text-sm max-w-sm">
                    Have you enjoyed this masterpiece? You can write a review from your Order Details page once it is delivered!
                  </p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary/10 text-primary font-black rounded-full flex items-center justify-center text-sm shadow-inner uppercase">
                          {rev.user?.name ? rev.user.name.slice(0, 2) : 'U'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-text text-sm sm:text-base">{rev.user?.name || 'Verified Craver'}</h4>
                          <span className="text-[10px] sm:text-xs font-bold text-secondary">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 text-accent">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= rev.rating ? "currentColor" : "none"} 
                            stroke="currentColor" 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-secondary text-sm sm:text-base leading-relaxed font-medium pl-0 sm:pl-16">
                      {rev.review}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
