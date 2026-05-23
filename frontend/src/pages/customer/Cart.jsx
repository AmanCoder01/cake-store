import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronLeft } from 'lucide-react';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const updateQty = (item, newQty) => {
    if (newQty < 1 || newQty > item.stock) return;
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-32 h-32 bg-orange-50 text-primary rounded-full flex items-center justify-center mb-8 animate-bounce">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-4xl font-black text-text mb-4">Your cart is empty</h2>
        <p className="text-secondary max-w-md mb-10 text-lg">
          Looks like you haven't added any sweet treats yet. Start exploring our delicious collections!
        </p>
        <Link to="/products">
          <Button size="lg" className="rounded-2xl shadow-lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/products" className="p-2 hover:bg-white rounded-full transition-colors text-secondary hover:text-primary">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text">Your Sweet Box</h1>
        <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">{cartItems.length} Items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* cart items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 group"
              >
                <Link to={`/products/${item.product}`} className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </Link>
                
                <div className="flex-grow flex flex-col sm:flex-row justify-between items-center w-full gap-6">
                  <div>
                    <Link to={`/products/${item.product}`} className="text-xl font-black text-text hover:text-primary transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </Link>
                    <p className="text-primary font-black text-lg">₹{item.price}</p>
                  </div>

                  <div className="flex items-center bg-background rounded-2xl p-1">
                    <button 
                      onClick={() => updateQty(item, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary transition-all disabled:opacity-50"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <p className="text-xl font-black text-text">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.product))}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* order summary */}
        <div className="lg:col-span-1">
          <Card className="p-8 sticky top-28 bg-white border border-gray-50 shadow-xl shadow-orange-500/5">
            <h3 className="text-xl font-extrabold text-text mb-8">Summary</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between text-secondary font-bold">
                <span>Subtotal</span>
                <span className="text-text">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary font-bold">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-secondary font-bold">
                <span>Estimated Tax (5%)</span>
                <span className="text-text">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-text">Total</span>
                <span className="text-2xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-base rounded-2xl shadow-xl shadow-primary/20 group"
              onClick={() => navigate('/checkout')}
            >
              Checkout <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-xs text-secondary font-medium">We accept secure payments</p>
              <div className="flex gap-4 grayscale opacity-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
