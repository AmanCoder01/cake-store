import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ChevronLeft, ArrowRight } from 'lucide-react';
import { getWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Meta from '../../components/layout/Meta';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isError, message } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(toggleWishlist(id)).then(() => {
        toast.success('Removed from wishlist');
    });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      stock: product.stock,
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  if (isError) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-secondary mb-8">{message}</p>
        <Button onClick={() => dispatch(getWishlist())} variant="outline">Try Again</Button>
      </div>
    );
  }

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8">
      <Meta title="My Wishlist" description="All your favorite cakes in one place." />
      
      <div className="flex items-center gap-4 mb-10">
        <Link to="/products" className="p-2 hover:bg-white rounded-full transition-colors text-secondary hover:text-primary">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-text">My Wishlist</h1>
        <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">{(items?.length || 0)} Saves</span>
      </div>

      {safeItems.length === 0 && !isLoading ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-50 mt-12"
        >
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <Heart size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-text mb-4">Your wishlist is empty</h2>
          <p className="text-secondary text-lg mb-10 max-w-md mx-auto">
            Looks like you haven't saved any masterpieces yet. Start exploring our delicious collections!
          </p>
          <Link to="/products">
            <Button size="lg" className="rounded-2xl px-10 shadow-xl shadow-primary/20">
              Browse Cakes <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {safeItems.map((item, index) => {
              const product = item?.product;
              if (!product) return null;
              return (
                <motion.div
                  key={product?._id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="group flex flex-col h-full bg-white border border-gray-100 overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={product.images[0]?.url || 'https://via.placeholder.com/400'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase">{product.category}</span>
                      </div>
                      <Link to={`/products/${product?._id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">{product?.name}</h3>
                      </Link>
                      <p className="text-2xl font-extrabold text-text mb-6">₹{product?.price}</p>
                      
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          className="flex-grow rounded-xl"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? (
                            <><ShoppingCart size={18} className="mr-2" /> Add to Cart</>
                          ) : (
                            'Out of Stock'
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
