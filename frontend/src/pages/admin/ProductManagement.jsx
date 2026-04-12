import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  ImagePlus,
  Loader2
} from 'lucide-react';
import { getProducts } from '../../store/slices/productSlice';
import { getCategories } from '../../store/slices/categorySlice';
import { APP_CONFIG } from '../../config/constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);
  const { items: dbCategories } = useSelector((state) => state.category);
  const { token } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Birthday',
    stock: '',
    images: [] // { url, public_id }
  });

  // For preview of selected local files before upload
  const [previewFiles, setPreviewFiles] = useState([]);

  useEffect(() => {
    dispatch(getProducts('limit=100'));
    dispatch(getCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Birthday',
      stock: '',
      images: []
    });
    setPreviewFiles([]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || []
    });
    setPreviewFiles([]);
    setIsModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${APP_CONFIG.API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted');
      setConfirmDeleteId(null);
      dispatch(getProducts('limit=100'));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Handle file selection from gallery
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewFiles(prev => [...prev, ...previews]);
  };

  // Remove a preview file
  const removePreview = (indexToRemove) => {
    setPreviewFiles(prev => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return updated;
    });
  };

  // Remove an already-uploaded image
  const removeUploadedImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Upload files to Cloudinary via backend
  const uploadFiles = async () => {
    if (previewFiles.length === 0) return [];

    setUploading(true);
    try {
      const form = new FormData();
      previewFiles.forEach(pf => form.append('images', pf.file));

      const { data } = await axios.post(`${APP_CONFIG.API_BASE_URL}/upload`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return data.data.images;
    } catch (error) {
      toast.error('Image upload failed');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Upload any new files first
      const newImages = await uploadFiles();

      // 2. Combine existing images with newly uploaded ones
      const allImages = [...formData.images, ...newImages];

      if (allImages.length === 0) {
        allImages.push({ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600' });
      }

      const submittableData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
        images: allImages
      };

      if (editingProduct) {
        await axios.patch(`${APP_CONFIG.API_BASE_URL}/products/${editingProduct._id}`, submittableData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated');
      } else {
        await axios.post(`${APP_CONFIG.API_BASE_URL}/products`, submittableData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added');
      }
      setIsModalOpen(false);
      setPreviewFiles([]);
      dispatch(getProducts('limit=100'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-text mb-2">Bakery Inventory</h1>
          <p className="text-secondary font-medium">Manage your cake listings and stock levels.</p>
        </div>
        <Button onClick={handleAddProduct} size="lg" className="rounded-2xl shadow-xl shadow-primary/20 w-full md:w-auto">
          <Plus size={20} className="mr-2" /> Add New Cake
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter products..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background border-2 border-transparent outline-none font-medium transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select className="bg-background px-4 py-3 rounded-2xl font-bold outline-none border-2 border-transparent cursor-pointer">
              <option>All Categories</option>
              {dbCategories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-secondary text-xs font-black uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Stock</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]?.url} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <span className="font-black text-text">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-text">₹{product.price}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-bold text-secondary">{product.stock} pcs</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditProduct(product)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(product._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {confirmDeleteId === product._id && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute inset-y-0 right-0 z-10 bg-red-600 flex items-center gap-4 px-6 rounded-l-2xl shadow-2xl"
                          >
                            <span className="text-white text-[10px] font-black uppercase tracking-tighter">Confirm Delete?</span>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-white text-red-600 p-2 rounded-lg font-black hover:bg-gray-100 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product._id} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]?.url} alt={product.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h4 className="font-black text-text leading-tight">{product.name}</h4>
                      <span className="inline-block mt-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-text text-lg">₹{product.price}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-secondary text-[10px]">{product.stock} pcs</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 relative">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-blue-600 active:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(product._id)}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-red-600 active:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                  <AnimatePresence>
                    {confirmDeleteId === product._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-10 bg-red-600 rounded-xl flex items-center justify-between px-6 shadow-xl"
                      >
                        <span className="text-white text-xs font-black uppercase tracking-wider">Confirm Delete?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-white text-red-600 px-4 py-1.5 rounded-lg font-black text-xs hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-white text-xs font-black hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !isLoading && (
            <div className="py-20 text-center text-secondary font-medium">No products found. Start adding some!</div>
          )}
        </div>
      </div>

      {/* product modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-full flex flex-col"
            >
              <div className="p-10 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-3xl font-black text-text">
                  {editingProduct ? 'Edit Masterpiece' : 'Create New Creation'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-background rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  <div className="md:col-span-2">
                    <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Velvet Chocolate Dream" />
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-text mb-2 ml-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us about the ingredients, texture and flavor..."
                        className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 bg-white text-text transition-all outline-none min-h-[120px]"
                      />
                    </div>
                  </div>
                  <Input label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleInputChange} required placeholder="599" />
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text mb-1.5 ml-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white font-bold outline-none transition-all"
                    >
                      {dbCategories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <Input label="Stock Levels" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required placeholder="20" />

                  {/* IMAGE UPLOAD SECTION */}
                  <div className="md:col-span-2 mb-6">
                    <label className="block text-sm font-semibold text-text mb-3 ml-1">Product Images</label>

                    {/* Already uploaded / existing images */}
                    {formData.images.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 group">
                            <img src={img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(i)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X size={20} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Preview of newly selected files */}
                    {previewFiles.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {previewFiles.map((pf, i) => (
                          <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 group">
                            <img src={pf.preview} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-1 right-1 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">NEW</div>
                            <button
                              type="button"
                              onClick={() => removePreview(i)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X size={20} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <ImagePlus size={28} />
                      </div>
                      <p className="text-text font-bold mb-1">Click to upload images</p>
                      <p className="text-secondary text-sm">PNG, JPG, WEBP up to 5MB each · Max 5 images</p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="md:col-span-2 mt-6 flex gap-4">
                    <Button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex-grow h-14 rounded-2xl shadow-xl shadow-primary/20"
                    >
                      {(submitting || uploading) && <Loader2 size={20} className="mr-2 animate-spin" />}
                      {uploading ? 'Uploading Images...' : submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="px-10 rounded-2xl">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
