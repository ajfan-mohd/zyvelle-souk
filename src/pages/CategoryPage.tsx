import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

import { Helmet } from 'react-helmet-async';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        
        // Fetch category
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        
        setCategory(catData);

        if (catData) {
          // Fetch products in category
          const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', catData.id)
            .eq('is_active', true);
          setProducts(prodData || []);
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-olive-dark" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Category Not Found</h2>
          <Link to="/collections" className="text-olive-dark underline underline-offset-4 uppercase tracking-widest text-xs">View All Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream">
      <Helmet>
        <title>{`${category.name} | Zyvelle Souk Artisanal Collection`}</title>
        <meta name="description" content={`Discover our ${category.name} collection at Zyvelle Souk. Handcrafted fine jewellery designed for elegance and timeless style.`} />
        <meta name="keywords" content={`${category.name}, fine jewelry, artisanal jewelry, gold ${category.name}, luxury collection`} />
      </Helmet>

      {/* Category Header */}
      <section className="relative h-[50vh] flex items-center justify-center mb-20 overflow-hidden">
        <img 
          src={category.image_url} 
          alt={`Discover our exquisite collection of ${category.name} - Zyvelle Souk`} 
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-olive-dark/20" />
        <div className="relative z-10 text-center text-cream px-6">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold mb-6 block">Collection</span>
          <h1 className="text-4xl md:text-7xl font-serif mb-6 lowercase first-letter:uppercase">{category.name}</h1>
          <div className="w-12 h-[1px] bg-cream mx-auto" />
        </div>
      </section>

      {/* Product Grid */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16 border-b border-olive-deep/5 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-olive-deep/40 font-bold">
            {products.length} Results in {category.name}
          </span>
          <div className="flex gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-olive-dark">
            <span className="opacity-40">Filter:</span>
            <button className="hover:text-gold-muted transition-colors">Style</button>
            <button className="hover:text-gold-muted transition-colors">Material</button>
            <button className="hover:text-gold-muted transition-colors">Price</button>
          </div>
        </div>

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
          <div className="py-20 text-center">
            <p className="text-lg font-serif italic text-olive-deep/40">Our {category.name} collection is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
