import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MessageCircle, Heart, ShieldCheck, Truck, RefreshCcw, Loader2, Minus, Plus } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { formatCurrency, generateWhatsAppLink, cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        
        // Fetch current product
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data);

        // Fetch related products (same category)
        if (data) {
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4);
          setRelatedProducts(related || []);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-olive-dark" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
          <Link to="/collections" className="text-olive-dark underline underline-offset-4 uppercase tracking-widest text-xs">Return to Collection</Link>
        </div>
      </div>
    );
  }

  const gallery = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);

  return (
    <div className="pt-32 pb-20 px-6">
      <Helmet>
        <title>{`${product.name} | Zyvelle Souk Fine Jewellery`}</title>
        <meta name="description" content={product.description || `Explore the exquisite ${product.name} from Zyvelle Souk's artisanal collection. Handcrafted with fine materials for timeless elegance.`} />
        <meta name="keywords" content={`${product.name}, fine jewelry, artisanal, gold ${product.name}, luxury ${product.name}`} />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8 md:mb-12 flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] uppercase tracking-widest text-olive-deep/40 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-olive-dark transition-colors shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link to="/collections" className="hover:text-olive-dark transition-colors shrink-0">Collections</Link>
          {product.categories && (
            <>
              <span>/</span>
              <Link to={`/category/${product.categories.slug}`} className="hover:text-olive-dark transition-colors">
                {product.categories.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-olive-dark font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2 order-2 md:order-1 flex md:flex-col gap-4">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "aspect-[4/5] w-20 md:w-full overflow-hidden bg-champagne transition-all duration-300",
                    selectedImage === idx ? "ring-1 ring-olive-dark opacity-100" : "opacity-50 hover:opacity-80"
                  )}
                >
                  <img src={img || ''} crossOrigin="anonymous" className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
            <div 
              className="md:col-span-10 order-1 md:order-2 aspect-[4/5] bg-champagne overflow-hidden relative cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={gallery[selectedImage] || ''}
                crossOrigin="anonymous"
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                alt={product.name}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <div className="mb-8 md:mb-10 text-center lg:text-left">
              <span className="text-[9px] md:text-[11px] tracking-[0.4em] uppercase text-gold-muted font-bold mb-4 block">Fine Jewellery</span>
              <h1 className="text-3xl md:text-5xl font-serif text-olive-dark mb-4 md:mb-6 leading-tight lowercase first-letter:uppercase">
                {product.name}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                {product.sale_price ? (
                  <>
                    <span className="text-xl md:text-2xl font-serif text-olive-dark">{formatCurrency(product.sale_price)}</span>
                    <span className="text-lg md:text-xl text-olive-deep/30 line-through font-serif">{formatCurrency(product.price)}</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-serif text-olive-dark">{formatCurrency(product.price)}</span>
                )}
              </div>
            </div>

            <p className="text-olive-deep/70 text-sm leading-relaxed mb-10 font-light text-center lg:text-left italic px-4 lg:px-0">
              {product.description}
            </p>

            {/* Selection */}
            <div className="space-y-8 mb-12">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest font-semibold">Material: <span className="font-normal opacity-60 ml-2">{product.material || '14K Gold Plated'}</span></span>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-center lg:text-left">Quantity</span>
                <div className="flex items-center justify-center lg:justify-start gap-6 border border-olive-deep/10 w-fit mx-auto lg:mx-0 p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-olive-deep/5 transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-olive-deep/5 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <button 
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product);
                  }
                }}
                className="w-full h-16 bg-olive-dark text-cream uppercase tracking-[0.3em] text-[11px] font-medium hover:bg-olive-deep transition-all duration-500 shadow-xl shadow-olive-dark/10 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={generateWhatsAppLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 border border-olive-deep/10 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp Enquiry
                </a>
                <button className="h-14 border border-olive-deep/10 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-olive-deep/5 transition-colors">
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4 pt-10 border-t border-olive-deep/5">
              <div className="flex items-center gap-4 text-xs text-olive-deep/70">
                <Truck className="w-4 h-4 stroke-[1.5]" />
                <span>Complimentary Express Shipping on orders over $500</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-olive-deep/70">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                <span>2 Year International Warranty</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-olive-deep/70">
                <RefreshCcw className="w-4 h-4 stroke-[1.5]" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Extra Info */}
        <div className="mt-20 md:mt-32">
          <div className="flex justify-center gap-6 md:gap-12 border-b border-olive-deep/5 mb-10 md:mb-12 overflow-x-auto scrollbar-hide">
            {['description', 'specifications', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative whitespace-nowrap",
                  activeTab === tab ? "text-olive-dark" : "text-olive-deep/40 hover:text-olive-dark"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-muted" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    <p className="text-sm leading-relaxed text-olive-deep/70">
                      Our {product.name} is a testament to timeless elegance and artisanal excellence. Designed with a keen eye for detail, this piece captures the light with every movement, creating an ethereal glow.
                    </p>
                    <p className="text-sm leading-relaxed text-olive-deep/70">
                      Perfect for both daily wear and special occasions, it serves as a versatile staple in any fine jewellery collection.
                    </p>
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                    <div className="text-[10px] uppercase tracking-widest opacity-50">Material</div>
                    <div className="text-sm">{product.material}</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50">SKU</div>
                    <div className="text-sm">ZS-{product.id.substring(0, 8).toUpperCase()}</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50">Ethically Sourced</div>
                    <div className="text-sm">Yes</div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <p className="text-sm text-olive-deep/70 italic">
                      Each Zyvelle Souk piece comes in our signature luxury packaging, perfect for gifting or storage.
                    </p>
                    <p className="text-sm text-olive-deep/70">
                      Delivery within 3-5 business days for domestic orders. International delivery may vary based on location.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-olive-dark">You May Also Love</h2>
            <div className="w-12 h-[1px] bg-gold-muted mx-auto mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                price={p.price}
                sale_price={p.sale_price}
                image_url={p.image_url}
                slug={p.slug}
                is_new_arrival={p.is_new_arrival}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
