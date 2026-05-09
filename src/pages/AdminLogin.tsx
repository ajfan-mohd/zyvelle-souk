import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast('Logged in successfully', 'success');
      navigate('/admin');
    } catch (error: any) {
      toast(error.message || 'Failed to login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-olive-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-cream p-10 md:p-14 shadow-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif text-olive-dark tracking-widest mb-4">ZYVELLE SOUK</h1>
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold-muted font-bold">
            <Lock className="w-3 h-3" />
            Admin Portal
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-olive-deep/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-olive-deep/20 bg-transparent py-3 pl-8 focus:border-gold-muted outline-none transition-colors text-sm"
                placeholder="admin@zyvelle.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-olive-deep/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-olive-deep/20 bg-transparent py-3 pl-8 focus:border-gold-muted outline-none transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-olive-dark text-cream uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-olive-deep transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-widest text-olive-deep/40 hover:text-olive-dark transition-colors"
          >
            ← Return to Storefront
          </button>
        </div>
      </motion.div>
    </div>
  );
}
