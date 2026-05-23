import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../../config/constants';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    subtitle: '', 
    link: '/products', 
    image: { url: '', public_id: '' } 
  });
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/banners`);
      setBanners(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setIsUploading(true);
    try {
      const res = await axios.post(`${APP_CONFIG.API_BASE_URL}/upload/single`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({ ...formData, image: { url: res.data.url, public_id: res.data.public_id } });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image.url) return toast.error('Please upload an image first');

    try {
      await axios.post(`${APP_CONFIG.API_BASE_URL}/banners`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Banner added!');
      setShowForm(false);
      setFormData({ title: '', subtitle: '', link: '/products', image: { url: '', public_id: '' } });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to add banner');
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${APP_CONFIG.API_BASE_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted!');
      setConfirmDeleteId(null);
      fetchBanners();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text mb-1">Banner Management</h1>
          <p className="text-secondary text-sm sm:text-base">Control the promotional sliders at the top of your site</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="rounded-2xl whitespace-nowrap shrink-0">
            <Plus size={20} className="mr-2" /> New Banner
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-8 border-2 border-dashed border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-text mb-2 uppercase tracking-tight">Main Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:border-primary transition-all font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 50% Off Birthday Cakes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-text mb-2 uppercase tracking-tight">Subtitle</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:border-primary transition-all"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Use code CAKE50 at checkout"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-text mb-2 uppercase tracking-tight">Button Link</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:border-primary transition-all"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-text mb-2 uppercase tracking-tight">Banner Image</label>
                <div className="relative h-[240px] rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group">
                  {formData.image.url ? (
                    <>
                      <img src={formData.image.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <label className="cursor-pointer bg-white text-text px-6 py-2 rounded-full font-bold">Change Image</label>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      {isUploading ? <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto" /> : <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />}
                      <p className="text-sm font-bold text-gray-500">{isUploading ? 'Uploading...' : 'Click to Upload'}</p>
                    </div>
                  )}
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isUploading} className="rounded-xl px-12">Save Banner</Button>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[300px] rounded-[40px]" />)
        ) : (
          banners.map((banner) => (
            <Card key={banner._id} className="relative overflow-hidden group h-[300px]">
              <img src={banner.image.url} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 p-10 flex flex-col justify-end">
                 <h3 className="text-3xl font-black text-white mb-2">{banner.title}</h3>
                 <p className="text-white/80 mb-6">{banner.subtitle}</p>
                 <div className="flex gap-4">
                   <button onClick={() => setConfirmDeleteId(banner._id)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      <Trash2 size={20} />
                   </button>
                 </div>
                 
                 <AnimatePresence>
                   {confirmDeleteId === banner._id && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="absolute inset-0 bg-red-600/95 flex flex-col items-center justify-center p-6 text-center z-20"
                     >
                       <AlertCircle className="text-white mb-3" size={40} />
                       <h4 className="text-xl font-black text-white mb-4">Delete this banner?</h4>
                       <div className="flex gap-4">
                         <button 
                           onClick={() => handleDelete(banner._id)}
                           className="bg-white text-red-600 px-8 py-2.5 rounded-xl font-black transition-transform active:scale-95"
                         >
                           Delete
                         </button>
                         <button 
                           onClick={() => setConfirmDeleteId(null)}
                           className="bg-transparent border-2 border-white text-white px-8 py-2.5 rounded-xl font-black hover:bg-white/10 transition-all"
                         >
                           Go Back
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
