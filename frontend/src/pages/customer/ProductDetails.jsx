import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Clock, Truck, ShoppingCart, Minus, Plus, ChevronRight, Heart } from 'lucide-react';
import { getProductDetails } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { getWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading, isError, message } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (user) {
      dispatch(getWishlist());
    }
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
      <nav className="flex items-center gap-2 text-sm font-bold text-secondary mb-12">
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
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-3xl sm:text-4xl font-black text-primary">₹{product.price}</span>
            <span className="text-lg text-secondary line-through">₹{(product.price * 1.2).toFixed(2)}</span>
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
    </div>
  );
};

export default ProductDetails;
