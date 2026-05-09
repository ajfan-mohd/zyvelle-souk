import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Loader2, Upload, X, RefreshCcw } from 'lucide-react';
import { SectionHeader } from './Dashboard';
import { useToast } from '../components/ui/Toaster';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sale_price: '',
    description: '',
    category_id: '',
    material: '',
    stock_status: 'in_stock',
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    slug: '',
    image_url: ''
  });

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      if (isEdit) {
        await fetchProduct();
      } else {
        setInitializing(false);
      }
    };
    init();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await getSupabase().from('categories').select('*');
    setCategories(data || []);
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          price: data.price.toString(),
          sale_price: data.sale_price?.toString() || '',
          description: data.description || '',
          category_id: data.category_id || '',
          material: data.material || '',
          stock_status: data.stock_status,
          is_featured: data.is_featured,
          is_new_arrival: data.is_new_arrival,
          is_active: data.is_active,
          slug: data.slug,
          image_url: data.image_url || ''
        });
      }
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setInitializing(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const oldGeneratedSlug = generateSlug(formData.name);

    setFormData(prev => {
      const updates: any = { name: newName };
      if (!prev.slug || prev.slug === oldGeneratedSlug) {
        updates.slug = generateSlug(newName);
      }
      return { ...prev, ...updates };
    });
  };

  const handleRegenerateSlug = () => {
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(prev.name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        stock_status: formData.stock_status || 'in_stock'
      };

      let error;
      if (isEdit) {
        const { error: updateError } = await getSupabase()
          .from('products')
          .update(payload)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await getSupabase()
          .from('products')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast(isEdit ? 'Product updated' : 'Product created', 'success');
      navigate('/admin/products');
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-olive-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-olive-deep/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-olive-dark" />
        </button>
        <SectionHeader
          title={isEdit ? "Edit Product" : "Add New Product"}
          description="Define the details, imagery, and status of your jewellery piece."
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <h3 className="text-lg font-serif mb-6">Product Details</h3>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm"
                placeholder="e.g. Luna Drop Earrings"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Slug (URL Path)</label>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="text-[9px] uppercase tracking-widest text-gold-muted hover:text-olive-dark flex items-center gap-1 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" /> Regenerate
                </button>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm"
                placeholder="luna-drop-earrings"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Price (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">
                  Main Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setLoading(true);

                    try {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                      const filePath = `products/${fileName}`;

                      const { error: uploadError } = await getSupabase()
                        .storage
                        .from('product-images')
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      const { data } = getSupabase()
                        .storage
                        .from('product-images')
                        .getPublicUrl(filePath);

                      setFormData((prev) => ({
                        ...prev,
                        image_url: data.publicUrl,
                      }));

                      toast('Image uploaded successfully', 'success');
                    } catch (error: any) {
                      toast(error.message, 'error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full border border-olive-deep/10 p-4 rounded-lg text-sm bg-olive-deep/[0.01]"
                />

                {formData.image_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-olive-deep/10 p-4 outline-none focus:border-gold-muted transition-colors text-sm rounded-lg bg-olive-deep/[0.01] resize-none"
                placeholder="Describe the piece..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Collection / Category</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent"
                >
                  <option value="">Select a Collection</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm"
                  placeholder="e.g. 18K Solid Gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Main Image URL</label>
              <input
                type="url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <h3 className="text-lg font-serif mb-6">Status & Visibility</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-olive-dark uppercase tracking-widest block">Active Piece</label>
                  <span className="text-[10px] text-olive-deep/40">Show on public storefront</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    formData.is_active ? "bg-olive-dark" : "bg-olive-deep/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    formData.is_active ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-olive-dark uppercase tracking-widest block">Featured</label>
                  <span className="text-[10px] text-olive-deep/40">Show in featured gallery</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    formData.is_featured ? "bg-gold-muted" : "bg-olive-deep/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    formData.is_featured ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-olive-dark uppercase tracking-widest block">New Arrival</label>
                  <span className="text-[10px] text-olive-deep/40">Mark with 'New' badge</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_new_arrival: !formData.is_new_arrival })}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    formData.is_new_arrival ? "bg-olive-dark" : "bg-olive-deep/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    formData.is_new_arrival ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Inventory Status</label>
              <select
                value={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="low_stock">Low Stock</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm">
            <h3 className="text-sm font-serif uppercase tracking-widest text-olive-dark mb-4">Preview Image</h3>
            <div className="aspect-square bg-cream rounded-lg overflow-hidden border border-olive-deep/5">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-olive-deep/20">
                  <Upload className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-olive-dark text-cream uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-gold-muted transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-olive-dark/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
