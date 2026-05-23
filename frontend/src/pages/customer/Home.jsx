import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Clock, Truck, ShieldCheck, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../store/slices/productSlice';
import { toggleWishlist, getWishlist } from '../../store/slices/wishlistSlice';
import { getBanners } from '../../store/slices/bannerSlice';
import { getCategories } from '../../store/slices/categorySlice';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Meta from '../../components/layout/Meta';

const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: banners } = useSelector((state) => state.banner);
  const { items: categories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    dispatch(getProducts('limit=8&isFeatured=true'));
    dispatch(getBanners());
    dispatch(getCategories());
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    dispatch(toggleWishlist(productId)).then((res) => {
      if (res.payload.action === 'added') toast.success('Added to wishlist');
      else toast.success('Removed from wishlist');
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item.product?._id || item.product) === productId);
  };

  const features = [
    { icon: Truck, title: 'Fast Delivery', desc: 'Freshly baked cakes delivered within 24 hours to your doorstep.' },
    { icon: ShieldCheck, title: 'Quality Assured', desc: 'We use premium ingredients and maintain strict hygiene standards.' },
    { icon: Clock, title: 'All Occasions', desc: 'Pre-order for any upcoming event or get instant delivery for selected items.' },
  ];

  return (
    <div className="space-y-24 pb-20">
      <Meta title="Home" description="Freshly baked happiness delivered to your door." />

      {/* Hero Banners */}
      <section className="relative h-[300px] sm:h-[520px] lg:h-[650px] overflow-hidden rounded-2xl sm:rounded-[50px] lg:rounded-[60px] shadow-2xl">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              {banners.length > 0 && (
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <img src={banners[currentBanner].image.url} className="w-full h-full object-cover" alt={banners[currentBanner].title} />
                  {/* Gradient overlay — stronger on mobile for readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 sm:via-black/40 sm:to-transparent" />
                  
                  {/* Content — bottom-anchored on mobile, centered-left on desktop */}
                  <div className="absolute inset-0 flex items-end sm:items-center p-5 sm:p-14 lg:p-24 pb-12 sm:pb-14">
                    <div className="w-full sm:max-w-2xl space-y-2 sm:space-y-5">
                       <motion.span 
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                         className="inline-block bg-primary/90 backdrop-blur-sm px-3 py-1 sm:px-6 sm:py-2 rounded-full text-white text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/30 max-w-[85vw] line-clamp-2 leading-snug"
                       >
                         {banners[currentBanner].subtitle}
                       </motion.span>
                       <motion.h1 
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.4 }}
                         className="text-xl sm:text-5xl lg:text-7xl font-black text-white leading-tight sm:leading-[1.1] line-clamp-2 sm:line-clamp-none"
                       >
                         {banners[currentBanner].title}
                       </motion.h1>
                       <motion.div
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.6 }}
                       >
                         <Link to={banners[currentBanner].link}>
                           <Button size="sm" className="rounded-xl sm:rounded-2xl px-5 sm:px-12 sm:text-lg shadow-2xl mt-1 sm:mt-0">Shop Now</Button>
                         </Link>
                       </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Banner dots — hair-thin on mobile */}
            <div className="absolute bottom-2.5 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10">
              {banners.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-px sm:h-[3px] rounded-full cursor-pointer transition-all duration-500 ${
                    currentBanner === idx
                      ? 'bg-white w-5 sm:w-6'
                      : 'bg-white/35 w-2.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="space-y-6 sm:space-y-10">
        <div className="flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-extrabold text-text tracking-tight mb-1 sm:mb-3">Shop by Category</h2>
            <p className="text-secondary text-sm sm:text-base leading-snug">Deliciously categorized for your convenience</p>
          </div>
          <Link to="/products" className="group text-primary font-extrabold flex items-center gap-1 text-sm sm:text-base whitespace-nowrap shrink-0">
            See All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 sm:h-80 rounded-[40px]" />)
          ) : (
            categories?.slice(0, 4).map((cat) => (
              <Link key={cat._id} to={`/products?category=${cat.name}`} className="group relative h-48 sm:h-80 rounded-[40px] overflow-hidden shadow-lg transition-all hover:-translate-y-2">
                <img 
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-1">{cat.name}</h3>
                  <div className="w-10 h-1 bg-primary rounded-full group-hover:w-20 transition-all duration-500" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white rounded-3xl sm:rounded-[50px] lg:rounded-[60px] p-6 sm:p-12 lg:p-20 shadow-sm border border-orange-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-[32px] bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500 group-hover:rotate-6">
                {(() => {
                  const Icon = feature.icon;
                  return <Icon size={32} className="text-primary group-hover:text-white transition-colors duration-500" />;
                })()}
              </div>
              <h3 className="text-2xl font-extrabold mb-4">{feature.title}</h3>
              <p className="text-secondary leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text mb-6">Trending This Week</h2>
          <p className="text-secondary text-base max-w-2xl mx-auto">Discover the most loved selections by our community this week. Grab yours before they are gone!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 rounded-[40px]" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          ) : (
            products?.map((product) => (
              <Card key={product._id} className="group flex flex-col h-full bg-white border border-gray-50 rounded-[32px] hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <Link to={`/products/${product._id}`} className="relative h-64 overflow-hidden rounded-[24px] m-2">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-24 group-hover:translate-x-0 transition-transform">
                    <button
                      onClick={(e) => handleToggleWishlist(e, product._id)}
                      className={`w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all ${
                        isInWishlist(product._id) ? 'text-primary' : 'text-text hover:text-primary'
                      }`}
                    >
                      <Heart size={22} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-red-500 text-white px-6 py-2 rounded-full font-extrabold uppercase text-xs tracking-widest shadow-xl">Sold Out</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">{product.category}</span>
                    <div className="flex items-center gap-1.5 text-accent">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-sm">{product.ratingsAverage}</span>
                    </div>
                  </div>
                  <Link to={`/products/${product._id}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xl font-extrabold mb-2 line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex-grow">
                    <p className="text-secondary text-sm mb-4 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-2xl font-extrabold text-text tracking-tighter">₹{product.price}</span>
                    <Link to={`/products/${product._id}`}>
                        <div className="bg-background hover:bg-primary hover:text-white p-3 rounded-xl text-text transition-all active:scale-90">
                           <ArrowRight size={20} />
                        </div>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        <div className="mt-20 text-center">
            <Link to="/products">
                <Button size="lg" variant="outline" className="rounded-2xl px-12 group">
                    Explore All Masterpieces <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background rounded-3xl sm:rounded-[50px] lg:rounded-[60px] p-6 sm:p-12 lg:p-20 text-center relative overflow-hidden ring-1 ring-primary/10">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">Need a Custom Creation?</h2>
            <p className="text-secondary text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                Whether it's a dream wedding cake or a personalized birthday surprise, our master bakers are ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/products?category=Custom Creations">
                    <Button size="lg" className="rounded-2xl px-12 shadow-xl shadow-primary/20 h-14 text-base">
                        Request Custom Cake
                    </Button>
                </Link>
                <Link to="/products">
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 h-14 text-base">
                        Browse Gallery
                    </Button>
                </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
