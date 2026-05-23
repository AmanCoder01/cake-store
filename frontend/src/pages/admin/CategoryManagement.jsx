import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Edit2, Layers, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../../config/constants';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', image: { url: '', public_id: '' } });
  const { token } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/categories`);
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
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
      const res = await axios.post(`${APP_CONFIG.API_BASE_URL}/upload/single?folder=categories`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentCategory({ ...currentCategory, image: { url: res.data.url, public_id: res.data.public_id } });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: currentCategory.name,
      description: currentCategory.description,
      image: currentCategory.image
    };
    try {
      if (editingId) {
        await axios.put(`${APP_CONFIG.API_BASE_URL}/categories/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category updated!');
      } else {
        await axios.post(`${APP_CONFIG.API_BASE_URL}/categories`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category created!');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Category save error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Failed to save category';
      toast.error(message);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setCurrentCategory({ 
      name: cat.name, 
      description: cat.description || '', 
      image: cat.image || { url: '', public_id: '' } 
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentCategory({ name: '', description: '', image: { url: '', public_id: '' } });
    setIsEditing(false);
    setEditingId(null);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${APP_CONFIG.API_BASE_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      setConfirmDeleteId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text mb-1">Categories</h1>
          <p className="text-secondary text-sm sm:text-base">Manage your product categories & images</p>
        </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="rounded-2xl whitespace-nowrap shrink-0">
              <Plus size={20} className="mr-2" /> Add Category
            </Button>
          )}
      </div>

      {isEditing && (
        <Card className="p-8 border-2 border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-text mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:border-primary transition-all"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    placeholder="e.g. Anniversary Cakes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-text mb-2 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:border-primary transition-all min-h-[120px]"
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                    placeholder="Short description..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-text mb-2 uppercase tracking-wider">Category Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-64 md:h-full min-h-[200px] rounded-3xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-all group"
                >
                  {currentCategory.image?.url ? (
                    <>
                      <img src={currentCategory.image.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="bg-white text-text px-6 py-2 rounded-full font-bold">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                      ) : (
                        <>
                          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-sm font-bold text-secondary">Click to upload category image</p>
                        </>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={isUploading} className="rounded-xl px-10">
                {editingId ? 'Update Category' : 'Save Category'}
              </Button>
              <Button type="button" variant="outline" className="rounded-xl" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-[24px]" />)
        ) : (
          categories.map((cat) => (
            <Card key={cat._id} className="p-6 relative overflow-hidden group">
              <AnimatePresence>
                {confirmDeleteId === cat._id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-10 bg-red-500/95 flex flex-col items-center justify-center p-4 text-center"
                  >
                    <AlertCircle className="text-white mb-2" size={32} />
                    <p className="text-white font-black mb-4">Delete "{cat.name}"?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="bg-white text-red-500 px-4 py-2 rounded-xl font-black text-sm hover:bg-gray-100"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(null)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                    {cat.image?.url ? (
                      <img src={cat.image.url} className="w-full h-full object-cover" />
                    ) : (
                      <Layers size={28} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg text-text truncate">{cat.name}</h3>
                    <p className="text-sm text-secondary truncate max-w-[150px]">{cat.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(cat)} 
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(cat._id)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
