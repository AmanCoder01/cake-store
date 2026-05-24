import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, ShoppingBag, Plus, Trash2, X } from 'lucide-react';
import { clearCart, saveShippingAddress } from '../../store/slices/cartSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);
  const isOutletClosed = settings?.isOutletOpen === false;

  const [step, setStep] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New address form
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cartItems, navigate, step]);

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(`${APP_CONFIG.API_BASE_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const addresses = data.data.addresses;
        setSavedAddresses(addresses);

        // Auto-select the default or first address
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (error) {
        // Silently fail — user will just see the add form
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (token) fetchAddresses();
    else setLoadingAddresses(false);
  }, [token]);

  const getSelectedAddress = () => {
    return savedAddresses.find(a => a._id === selectedAddressId);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Save new address to backend + select it
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { data } = await axios.post(`${APP_CONFIG.API_BASE_URL}/addresses`, {
        address: formAddress,
        city: formCity,
        postalCode: formPostalCode,
        country: formCountry,
        phone: formPhone,
        isDefault: savedAddresses.length === 0 // first address is default
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newAddr = data.data.address;
      setSavedAddresses(prev => [...prev, newAddr]);
      setSelectedAddressId(newAddr._id);
      setShowAddForm(false);
      setFormAddress('');
      setFormCity('');
      setFormPostalCode('');
      setFormCountry('');
      setFormPhone('');
      toast.success('Address saved!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  // Delete a saved address
  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${APP_CONFIG.API_BASE_URL}/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAddresses(prev => prev.filter(a => a._id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(savedAddresses.filter(a => a._id !== id)[0]?._id || null);
      }
      toast.success('Address removed');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  // Proceed with selected address
  const handleContinueToPayment = () => {
    if (isOutletClosed) {
      toast.error('The outlet is currently closed. Order placement is disabled.');
      return;
    }
    const selected = getSelectedAddress();
    if (!selected) {
      toast.error('Please select or add a delivery address');
      return;
    }
    dispatch(saveShippingAddress(selected));
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (isOutletClosed) {
      toast.error('The outlet is currently closed. Order placement is disabled.');
      return;
    }
    const selected = getSelectedAddress();
    if (!selected) return;

    setIsOrdering(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress: {
          address: selected.address,
          city: selected.city,
          postalCode: selected.postalCode,
          country: selected.country,
          phone: selected.phone
        },
        paymentMethod: 'COD',
        totalPrice: total
      };

      const { data } = await axios.post(`${APP_CONFIG.API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.status === 'success') {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8">
      {/* progress bar */}
      <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
        {[{ n: 1, label: 'Address' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Done' }].map((s, idx) => (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                step >= s.n ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-300 border-2 border-gray-100'
              }`}>
                {step > s.n ? <CheckCircle2 size={24} /> : s.n}
              </div>
              <span className={`text-xs font-bold ${step >= s.n ? 'text-primary' : 'text-gray-300'}`}>{s.label}</span>
            </div>
            {s.n < 3 && (
              <div className={`flex-grow h-1.5 mx-4 rounded-full transition-all ${
                step > s.n ? 'bg-primary' : 'bg-gray-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* STEP 1 — Select or Add Address */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <MapPin size={28} />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-text">Delivery Address</h2>
                        <p className="text-secondary text-sm font-medium">Select a saved address or add a new one</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setShowAddForm(!showAddForm)}
                    >
                      {showAddForm ? <><X size={16} className="mr-1" /> Cancel</> : <><Plus size={16} className="mr-1" /> New Address</>}
                    </Button>
                  </div>

                  {/* Saved Addresses */}
                  {loadingAddresses ? (
                    <div className="text-center py-12 text-secondary font-medium">Loading addresses...</div>
                  ) : savedAddresses.length > 0 && !showAddForm ? (
                    <div className="space-y-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all group ${
                            selectedAddressId === addr._id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-100 hover:border-primary/30 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                              selectedAddressId === addr._id
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}>
                              {selectedAddressId === addr._id && (
                                <CheckCircle2 size={16} className="text-white" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-black text-text">{addr.address}</p>
                                {addr.isDefault && (
                                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Default</span>
                                )}
                              </div>
                              <p className="text-secondary font-medium text-sm">
                                {addr.city}, {addr.postalCode}, {addr.country}
                              </p>
                              <p className="text-primary font-bold text-sm mt-1">{addr.phone}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showAddForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
                      <MapPin size={40} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-secondary font-bold mb-2">No saved addresses</p>
                      <p className="text-secondary text-sm mb-6">Add your first delivery address to get started</p>
                      <Button onClick={() => setShowAddForm(true)} size="sm" className="rounded-xl">
                        <Plus size={16} className="mr-1" /> Add Address
                      </Button>
                    </div>
                  ) : null}

                  {/* Add New Address Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSaveNewAddress}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-4">
                          <div className="md:col-span-2">
                            <Input label="Street Address" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} required placeholder="123 Sweet Street, Sector 14" />
                          </div>
                          <Input label="City" value={formCity} onChange={(e) => setFormCity(e.target.value)} required placeholder="Mumbai" />
                          <Input label="Postal Code" value={formPostalCode} onChange={(e) => setFormPostalCode(e.target.value)} required placeholder="400001" />
                          <Input label="Country" value={formCountry} onChange={(e) => setFormCountry(e.target.value)} required placeholder="India" />
                          <Input label="Phone Number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required placeholder="+91 98765 43210" />

                          <div className="md:col-span-2 mt-4 flex gap-4">
                            <Button type="submit" disabled={savingAddress} className="flex-grow h-12 rounded-2xl">
                              {savingAddress ? 'Saving...' : 'Save Address'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="px-8 rounded-2xl">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* Continue Button */}
                {!showAddForm && savedAddresses.length > 0 && (
                  isOutletClosed ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 font-extrabold text-center leading-relaxed">
                      🎂 We are currently closed due to: "{settings?.closeReason || 'baking and maintenance'}". Order placement is temporarily disabled.
                    </div>
                  ) : (
                    <Button
                      onClick={handleContinueToPayment}
                      size="lg"
                      className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 group"
                    >
                      Continue to Payment <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )
                )}
              </motion.div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-50">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-text mb-6 sm:mb-8">Payment Method</h2>
                  <div className="p-6 rounded-3xl border-4 border-primary bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-text">Cash on Delivery</p>
                        <p className="text-secondary font-medium">Pay when your cake arrives</p>
                      </div>
                    </div>
                    <CheckCircle2 size={32} className="text-primary" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100 divide-y divide-gray-100">
                  <div className="pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2"><MapPin size={20} className="text-primary" /> Deliver To</h3>
                      <button onClick={() => setStep(1)} className="text-primary font-black hover:underline uppercase text-xs tracking-widest">Change</button>
                    </div>
                    {(() => {
                      const sel = getSelectedAddress();
                      return sel ? (
                        <p className="text-secondary leading-relaxed font-medium">
                          {sel.address}, {sel.city}, <br /> {sel.postalCode}, {sel.country} <br /> {sel.phone}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  <div className="pt-8">
                    {isOutletClosed ? (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 font-extrabold text-center leading-relaxed">
                        🎂 We are currently closed due to: "{settings?.closeReason || 'baking and maintenance'}". Order placement is temporarily disabled.
                      </div>
                    ) : (
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isOrdering}
                        size="lg"
                        className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20"
                      >
                        {isOrdering ? 'Placing Order...' : 'Place My Order'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* summary sidebar */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-28 bg-white border border-gray-50 shadow-sm">
              <h3 className="text-xl font-extrabold text-text mb-8">Your Items</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <p className="font-bold text-text line-clamp-1">{item.name}</p>
                      <p className="text-sm text-secondary font-bold">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-secondary font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary font-bold text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-500">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-secondary font-bold text-sm">
                  <span>Tax (5%)</span>
                  <span className="text-text">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="font-bold text-text">Total</span>
                  <span className="text-xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* STEP 3 — Success (full-width, centered) */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center"
        >
          <div className="w-32 h-32 bg-green-100 text-green-500 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-200">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text mb-6">Order Placed!</h2>
          <p className="text-secondary text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Your delicious cake is now being prepared with love. We'll notify you when it's on its way!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button size="lg" variant="outline" className="rounded-2xl border-2 px-10">Track Order</Button>
            </Link>
            <Link to="/">
              <Button size="lg" className="rounded-2xl px-10 shadow-lg">Back to Home</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;

