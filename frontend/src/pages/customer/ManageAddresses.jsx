import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Plus, Trash2, CheckCircle2, Navigation, Loader, Home as HomeIcon } from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

// Calculate physical distance to Sunderpur, Varanasi outlet (25.2917, 82.9734) using Haversine formula
const calculateHaversineDistance = (lat, lon) => {
  const outletLat = 25.2917;
  const outletLon = 82.9734;
  const R = 6371; // Earth's radius in km
  const dLat = (lat - outletLat) * Math.PI / 180;
  const dLon = (lon - outletLon) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(outletLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.5, parseFloat(d.toFixed(1)));
};

const ManageAddresses = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Address lists and forms
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New address state
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formCountry, setFormCountry] = useState('India');
  const [formPhone, setFormPhone] = useState('');
  const [formDistance, setFormDistance] = useState(1.5);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [hasGeolocated, setHasGeolocated] = useState(false);

  // Fetch all addresses from backend
  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${APP_CONFIG.API_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(data.data.addresses);
    } catch (error) {
      toast.error('Failed to load address book.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    } else {
      navigate('/login');
    }
  }, [token]);

  // Debounced forward geocoding on typing
  useEffect(() => {
    if (!formAddress || !formCity) return;
    if (formAddress.length < 5 && formCity.length < 3) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const queryStr = `${formAddress}, ${formCity}`;
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&limit=1`
        );

        if (res.data && res.data.length > 0) {
          const { lat, lon } = res.data[0];
          const realDist = calculateHaversineDistance(parseFloat(lat), parseFloat(lon));
          setFormDistance(realDist);
        } else {
          // Length heuristic fallback
          const base = ((formAddress.length + formCity.length) % 8) + 1.2;
          setFormDistance(parseFloat(base.toFixed(1)));
        }
      } catch (error) {
        const base = ((formAddress.length + formCity.length) % 8) + 1.2;
        setFormDistance(parseFloat(base.toFixed(1)));
      }
    }, 1200);

    return () => clearTimeout(delayDebounce);
  }, [formAddress, formCity]);

  // Handle current location geocoding
  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    toast.loading('📍 Detecting location & autofilling fields...', { id: 'geo-toast' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const finalDist = calculateHaversineDistance(latitude, longitude);
        setFormDistance(finalDist);

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          if (res.data && res.data.address) {
            const addr = res.data.address;
            const road = addr.road || addr.suburb || addr.neighbourhood || addr.village || '';
            const house = addr.house_number || '';
            const streetAddress = [house, road].filter(Boolean).join(', ') || res.data.display_name.split(',')[0] || 'Sundarpur Road';

            const city = addr.city || addr.town || addr.state_district || 'Varanasi';
            const postal = addr.postcode || '221005';
            const country = addr.country || 'India';
            setFormAddress(streetAddress);
            setFormCity(city);
            setFormPostalCode(postal);
            setFormCountry(country);
            setHasGeolocated(true);

            toast.success('Location autofilled successfully! 📍', { id: 'geo-toast' });
          } else {
            toast.error('Reverse geocoding failed.', { id: 'geo-toast' });
          }
        } catch (error) {
          setFormAddress('Chandpur Road, Sundarpur');
          setFormCity('Varanasi');
          setFormPostalCode('221005');
          setFormCountry('India');
          setHasGeolocated(true);
          toast.success('Autofilled with Varanasi Outlet defaults! 📍', { id: 'geo-toast' });
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        toast.error('Location permission blocked. Please enable browser location settings. 📍', { id: 'geo-toast', duration: 5000 });
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Save new address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      await axios.post(`${APP_CONFIG.API_BASE_URL}/addresses`, {
        address: formAddress,
        city: formCity,
        postalCode: formPostalCode,
        country: formCountry,
        phone: formPhone,
        distance: formDistance,
        isDefault: addresses.length === 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Address saved successfully!');
      setShowAddForm(false);
      setFormAddress('');
      setFormCity('');
      setFormPostalCode('');
      setFormPhone('');
      setFormDistance(1.5);
      setHasGeolocated(false);
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  // Set default address
  const handleSetDefault = async (id) => {
    try {
      await axios.patch(`${APP_CONFIG.API_BASE_URL}/addresses/${id}`, { isDefault: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Default address updated! Redirecting to checkout...');
      setTimeout(() => {
        navigate('/checkout');
      }, 800);
    } catch (error) {
      toast.error('Failed to set default address.');
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${APP_CONFIG.API_BASE_URL}/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Address deleted!');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm text-secondary hover:text-primary transition-all shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text">Manage Locations</h1>
            <p className="text-secondary text-sm font-medium">Add, delete, or choose your default shipping addresses</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          className="rounded-2xl shadow-md flex items-center gap-2"
        >
          {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Address</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Save Address Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-black text-text">Add New Delivery Location</h3>
                <button
                  type="button"
                  onClick={handleAutofillLocation}
                  disabled={detectingLocation}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 text-primary hover:bg-primary/10 disabled:bg-gray-100 disabled:text-gray-400 font-bold text-xs rounded-xl transition-all w-full sm:w-auto"
                >
                  {detectingLocation ? <Loader size={14} className="animate-spin" /> : <Navigation size={14} />}
                  Use Current Location
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-6">
                {/* Simulated Geolocation Status Banner inside manager form */}
                {!hasGeolocated && (
                  <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl flex items-center gap-3 text-xs font-extrabold mb-4 animate-pulse">
                    <span>⚠️ Please click "Use Current Location" first to set your coordinates and shipping distance accurately.</span>
                  </div>
                )}
                {hasGeolocated && (
                  <div className="p-4 bg-primary/5 border border-primary/10 text-primary rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black mb-4">
                    <span className="flex items-center gap-2 text-left">
                      <MapPin size={16} className="text-primary shrink-0" />
                      Distance calculated to Sundarpur Varanasi Outlet:
                    </span>
                    <span className="bg-primary text-white px-3 py-0.5 rounded-full font-black shrink-0 w-fit">
                      {formDistance} KM
                    </span>
                  </div>
                )}

                <Input
                  label="Street Address / Area (Refine your street, house, landmark)"
                  placeholder={hasGeolocated ? "e.g. Flat 301, Vaishno Vihar" : "⚠️ Click 'Use Current Location' first"}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  disabled={!hasGeolocated}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    placeholder="City"
                    value={formCity}
                    disabled={!hasGeolocated}
                    readOnly={hasGeolocated}
                    required
                  />
                  <Input
                    label="Postal Code"
                    placeholder="Postal Code"
                    value={formPostalCode}
                    disabled={!hasGeolocated}
                    readOnly={hasGeolocated}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Country"
                    placeholder="India"
                    value={formCountry}
                    disabled
                  />
                  <Input
                    label="Phone Number (For Delivery)"
                    placeholder="e.g. 9876543210"
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={savingAddress || !hasGeolocated}
                    className="flex-1 rounded-xl shadow-lg font-black"
                  >
                    {savingAddress ? 'Saving Location...' : !hasGeolocated ? 'Lock Location to Save Address' : 'Save Location Address'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address Cards List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-secondary font-medium">
            <Loader size={36} className="animate-spin text-primary" />
            <p>Loading your locations...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`p-5 sm:p-6 rounded-[30px] border-2 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md ${addr.isDefault ? 'border-primary/40 shadow-sm' : 'border-gray-100'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 text-secondary rounded-2xl shrink-0 mt-1">
                    <MapPin size={22} className={addr.isDefault ? 'text-primary' : 'text-secondary'} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-black text-text text-base">{addr.address}</h3>
                      {addr.isDefault && (
                        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Default
                        </span>
                      )}
                      <span className="bg-gray-50 border border-gray-100 text-text text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {addr.distance !== undefined ? addr.distance : 1.5} km
                      </span>
                    </div>
                    <p className="text-secondary font-medium text-sm">
                      {addr.city}, {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-primary font-bold text-sm mt-1">{addr.phone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-gray-50 sm:border-0 mt-2 sm:mt-0">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="px-4 py-2 border border-gray-200 hover:border-primary/30 text-secondary hover:text-primary font-bold text-xs rounded-xl transition-all bg-white hover:bg-primary/5 flex-grow sm:flex-grow-0 text-center"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    title="Delete Location"
                    className="p-2.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-2xl transition-all shrink-0 ml-auto sm:ml-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[32px] bg-white p-8">
            <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-text mb-2">No Saved Locations</h3>
            <p className="text-secondary text-sm mb-6 max-w-sm mx-auto">Please add a delivery address to complete orders easily and save details for next time!</p>
            <Button onClick={() => setShowAddForm(true)} size="sm" className="rounded-xl shadow-md">
              <Plus size={16} className="mr-1" /> Add Your First Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAddresses;
