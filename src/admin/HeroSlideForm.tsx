import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

export default function HeroSlideForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: 'Discover Collection',
    button_link: '/collections',
    image_url: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    if (isEdit) {
      fetchSlide();
    }
  }, [id]);

  const fetchSlide = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          subtitle: data.subtitle || '',
          button_text: data.button_text || 'Discover Collection',
          button_link: data.button_link || '/collections',
          image_url: data.image_url || '',
          order_index: data.order_index || 0,
          is_active: data.is_active ?? true
        });
      }
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setInitializing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (isEdit) {
        const { error: updateError } = await getSupabase()
          .from('hero_slides')
          .update(formData)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await getSupabase()
          .from('hero_slides')
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;

      toast(isEdit ? 'Slide updated' : 'Slide created', 'success');
      navigate('/admin/slides');
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
        <button onClick={() => navigate('/admin/slides')} className="p-2 hover:bg-olive-deep/5 rounded-full">
          <ArrowLeft className="w-5 h-5 text-olive-dark" />
        </button>
        <div>
          <h2 className="text-2xl font-serif text-olive-dark">{isEdit ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h2>
          <p className="text-xs text-olive-deep/40 uppercase tracking-widest mt-1">Create a compelling first impression for your atelier.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Heading Title</label>
              <textarea 
                required
                rows={2}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all resize-none"
                placeholder="e.g., Art of Elegance"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Subtitle / Description</label>
              <textarea 
                rows={3}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all resize-none"
                placeholder="Exquisite Handcrafted Treasures..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">CTA Button Text</label>
                <input 
                  type="text" 
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">CTA Button Link</label>
                <input 
                  type="text" 
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Background Image URL</label>
              <input 
                required
                type="url" 
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm focus:border-gold-muted focus:ring-1 focus:ring-gold-muted outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 border-b border-olive-deep/5 pb-2">Status & Order</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-olive-dark uppercase tracking-widest">Active Slide</span>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData.is_active ? 'bg-olive-dark' : 'bg-olive-deep/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.is_active ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Display Order Index</label>
              <input 
                type="number" 
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full bg-cream/30 border border-olive-deep/10 px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white p-6 border border-olive-deep/5 rounded-xl shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 border-b border-olive-deep/5 pb-2 mb-4">Preview Image</h3>
            <div className="aspect-[4/5] bg-cream rounded-lg overflow-hidden border border-olive-deep/5 flex items-center justify-center text-olive-deep/20">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8" />
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-olive-dark text-cream flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold-muted transition-all shadow-xl shadow-olive-dark/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Create Slide'}
          </button>
        </div>
      </form>
    </div>
  );
}
