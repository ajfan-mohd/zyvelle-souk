import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';
import { cn } from '../lib/utils';

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
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
      // Only auto-update slug if it was empty or matched the previously generated slug
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
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };

      let error;
      if (isEdit) {
        const { error: updateError } = await getSupabase()
          .from('categories')
          .update(payload)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await getSupabase()
          .from('categories')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast(isEdit ? 'Collection updated' : 'Collection created', 'success');
      navigate('/admin/categories');
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
        <button onClick={() => navigate('/admin/categories')} className="p-2 hover:bg-olive-deep/5 rounded-full">
          <ArrowLeft className="w-5 h-5 text-olive-dark" />
        </button>
        <div>
          <h2 className="text-2xl font-serif text-olive-dark">{isEdit ? 'Edit Collection' : 'Add New Collection'}</h2>
          <p className="text-xs text-olive-deep/40 uppercase tracking-widest mt-1">Organize your atelier by grouping similar pieces.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Collection Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={handleNameChange}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                placeholder="e.g., The Celestial Collection"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Slug (URL Path)</label>
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
                  className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                  placeholder="leave empty to auto-generate"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Heading/Banner Image URL</label>
                <input 
                  type="url" 
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all resize-none"
                placeholder="Describe the essence of this collection..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 border-b border-olive-deep/5 pb-2">Preview</h3>
            <div className="aspect-[16/9] bg-cream rounded-lg overflow-hidden border border-olive-deep/5 flex items-center justify-center text-olive-deep/20">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[10px] uppercase tracking-widest">No Image Provided</span>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-olive-dark text-cream flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold-muted transition-all shadow-xl shadow-olive-dark/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}
