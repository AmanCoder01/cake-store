import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, X, ChevronDown, SlidersHorizontal, Heart, ArrowRight, Star } from 'lucide-react';
import { getProducts } from '../../store/slices/productSlice';
import { toggleWishlist, getWishlist } from '../../store/slices/wishlistSlice';
import { getCategories } from '../../store/slices/categorySlice';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../../config/constants';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, totalProducts } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: dbCategories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = searchParams.get('page') || 1;

  useEffect(() => {
    dispatch(getProducts(searchParams.toString()));
    dispatch(getCategories());
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, searchParams, user]);

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

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => (item.product?._id || item.product) === productId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchParams.set('search', searchInput);
    } else {
      searchParams.delete('search');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const setCategory = (cat) => {
    if (category === cat) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const setSort = (s) => {
    searchParams.set('sort', s);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  return (
    <div className="min-h-screen">
      <div className="mb-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-text mb-4">Discover Our Cakes</h1>
        <p className="text-secondary font-medium">Find the perfect cake for your next celebration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* sidebar filters */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-10">
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Filter size={20} className="text-primary" /> Categories
            </h3>
            <div className="flex flex-col gap-3">
              {dbCategories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setCategory(cat.name)}
                  className={`text-left px-4 py-3 rounded-2xl transition-all font-semibold ${
                    category === cat.name 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-secondary hover:bg-orange-50 hover:text-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Price Range</h3>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <button 
                onClick={() => {searchParams.delete('price[gte]'); searchParams.set('price[lte]', '500'); searchParams.set('page', '1'); setSearchParams(searchParams);}} 
                className={`px-3 py-2 rounded-lg transition-colors ${!searchParams.get('price[gte]') && searchParams.get('price[lte]') === '500' ? 'bg-primary text-white shadow-md' : 'bg-white text-secondary hover:bg-primary/10 hover:text-primary'}`}
              >Under ₹500</button>
              <button 
                onClick={() => {searchParams.set('price[gte]', '500'); searchParams.set('price[lte]', '1000'); searchParams.set('page', '1'); setSearchParams(searchParams);}} 
                className={`px-3 py-2 rounded-lg transition-colors ${searchParams.get('price[gte]') === '500' && searchParams.get('price[lte]') === '1000' ? 'bg-primary text-white shadow-md' : 'bg-white text-secondary hover:bg-primary/10 hover:text-primary'}`}
              >₹500 - ₹1000</button>
              <button 
                onClick={() => {searchParams.delete('price[lte]'); searchParams.set('price[gte]', '1000'); searchParams.set('page', '1'); setSearchParams(searchParams);}} 
                className={`px-3 py-2 rounded-lg transition-colors ${searchParams.get('price[gte]') === '1000' && !searchParams.get('price[lte]') ? 'bg-primary text-white shadow-md' : 'bg-white text-secondary hover:bg-primary/10 hover:text-primary'}`}
              >₹1000+</button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={clearFilters}>Reset Filters</Button>
        </aside>

        {/* main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 sm:p-5 rounded-[28px] shadow-sm border border-gray-100/80">
            <form onSubmit={handleSearch} className="relative w-full md:flex-1 md:max-w-lg group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center group-focus-within:bg-primary/20 transition-colors">
                <Search className="text-primary" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search for your favorite cake..."
                className="w-full pl-16 pr-28 py-3.5 rounded-2xl bg-background/60 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:shadow-lg focus:shadow-primary/5 outline-none transition-all font-medium text-text placeholder:text-gray-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-primary/20"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SlidersHorizontal size={15} className="text-primary" />
                </div>
                <select 
                  onChange={(e) => setSort(e.target.value)}
                  value={sort}
                  className="w-full md:w-52 appearance-none bg-background/60 pl-10 pr-10 py-3.5 rounded-2xl font-semibold text-text text-sm outline-none cursor-pointer border-2 border-transparent hover:border-primary/15 focus:border-primary/20 focus:bg-white transition-all"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low → High</option>
                  <option value="-price">Price: High → Low</option>
                  <option value="-ratingsAverage">Best Rated ★</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-3.5 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-transform"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-secondary font-medium">Showing <span className="text-text font-extrabold">{products.length}</span> of {totalProducts} cakes</p>
          </div>

          {/* product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 min-h-[600px] content-start">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-80 rounded-[40px]" />
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <Skeleton className="h-6 w-1/4 mx-auto" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group flex flex-col h-full bg-white border border-gray-50 rounded-[40px] hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <Link to={`/products/${product._id}`} className="relative h-80 overflow-hidden rounded-[40px] m-2">
                      <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-24 group-hover:translate-x-0 transition-transform">
                        <button
                          onClick={(e) => handleToggleWishlist(e, product._id)}
                          className={`w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all ${
                            isProductInWishlist(product._id) ? 'text-primary' : 'text-text hover:text-primary'
                          }`}
                        >
                          <Heart size={22} fill={isProductInWishlist(product._id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-red-500 text-white px-6 py-2 rounded-full font-extrabold uppercase text-xs tracking-widest shadow-xl">Sold Out</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">{product.category}</span>
                        <div className="flex items-center gap-1.5 text-accent">
                          <Star size={18} fill="currentColor" />
                          <span className="font-bold">{product.ratingsAverage}</span>
                        </div>
                      </div>
                      <Link to={`/products/${product._id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-2xl font-extrabold mb-3 line-clamp-1">{product.name}</h3>
                      </Link>
                      <div className="flex-grow">
                        <p className="text-secondary text-base mb-6 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                        <span className="text-3xl font-extrabold text-text tracking-tighter">₹{product.price}</span>
                        <Link to={`/products/${product._id}`}>
                            <div className="bg-background hover:bg-primary hover:text-white p-4 rounded-2xl text-text transition-all active:scale-90 shadow-sm">
                               <ArrowRight size={24} />
                            </div>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
                <div className="col-span-full py-20 text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Search size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">No cakes found</h3>
                    <p className="text-secondary">Try adjusting your filters or search keywords.</p>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>View All Cakes</Button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-[40px] h-full overflow-y-auto p-8 relative"
            >
              <button onClick={() => setIsFilterOpen(false)} className="absolute top-8 right-8 p-2 bg-background rounded-full">
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black mb-10">Filters</h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold mb-6">Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dbCategories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => setCategory(cat.name)}
                        className={`text-center px-4 py-3 rounded-2xl transition-all font-bold ${
                          category === cat.name 
                            ? 'bg-primary text-white' 
                            : 'bg-background text-secondary'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full h-14 text-lg" onClick={() => setIsFilterOpen(false)}>Done</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
