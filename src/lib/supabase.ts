import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Settings menu.');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  price: number;
  sale_price: number | null;
  description: string;
  image_url: string | null;
  gallery_images: string[] | null;
  material: string | null;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at: string;
  category?: Category;
};
