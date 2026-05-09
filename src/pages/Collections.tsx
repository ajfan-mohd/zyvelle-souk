import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, LayoutGrid, List, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

import { Helmet } from 'react-helmet-async';

export default function Collections() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        
        // Fetch categories
        const { data: catData } = await supabase.from('categories').select('*');
        setCategories(catData || []);

        // Fetch products
        let query = supabase.from('products').select('*').eq('is_active', true);
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        const { data: prodData } = await query;
        setProducts(prodData || []);
      } catch (err) {
        console.error('Error fetching collections data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-olive-dark" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream">
      <Helmet>
        <title>Shop Collections | Zyvelle Souk Fine Jewellery Gallery</title>
        <meta name="description" content="Browse the complete Zyvelle Souk jewellery collections. From handcrafted gold necklaces to bespoke earrings, find the perfect artisanal piece for your next milestone." />
        <meta name="keywords" content="jewelry collections, shop necklaces, shop earrings, gold rings, fine jewellery online, artisanal collection" />
      </Helmet>

      {/* Hero Header */}
      <section className="px-6 mb-12 md:mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-gold-muted font-bold mb-6 block">The entire archives</span>
          <h1 className="text-4xl md:text-7xl font-serif text-olive-dark mb-6 md:mb-8">Artisanal Collections</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-olive-deep/70 font-light leading-relaxed italic text-base md:text-lg">
              Explore our meticulously curated selection of fine jewellery, where modern design meets timeless craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[86px] z-40 bg-cream/90 backdrop-blur-md border-y border-olive-deep/5 px-6 py-6 mb-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap transition-all whitespace-nowrap",
                selectedCategory === null ? "text-olive-dark border-b-2 border-gold-muted pb-1" : "text-olive-deep/40 hover:text-olive-dark"
              )}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap transition-all whitespace-nowrap",
                  selectedCategory === cat.id ? "text-olive-dark border-b-2 border-gold-muted pb-1" : "text-olive-deep/40 hover:text-olive-dark"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-olive-deep/5">
            <div className="flex items-center gap-2 text-olive-deep/60">
              <span className="text-[10px] uppercase tracking-widest font-bold">Sort By</span>
              <div className="relative group">
                <button className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-olive-dark">
                  Newest <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="h-4 w-[1px] bg-olive-deep/10 mx-2" />
            <span className="text-[10px] uppercase tracking-widest text-olive-deep/40 font-bold">
              {products.length} Results
            </span>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  sale_price={product.sale_price}
                  image_url={product.image_url}
                  slug={product.slug}
                  is_new_arrival={product.is_new_arrival}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <p className="text-lg font-serif italic text-olive-deep/40">No pieces found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination Placeholder */}
      <div className="mt-32 flex justify-center">
        <button className="text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 border-olive-dark pb-2 hover:text-gold-muted hover:border-gold-muted transition-all">
          Load More Pieces
        </button>
      </div>
    </div>
  );
}
