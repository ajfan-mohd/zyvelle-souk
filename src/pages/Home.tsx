import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageCircle, Loader2, ChevronLeft, ChevronRight, Shield, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSupabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabase();
        
        // Fetch hero slides
        const { data: slideData } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('is_active', true)
          .order('order_index');
        setHeroSlides(slideData || []);

        // Fetch categories
        const { data: catData } = await supabase.from('categories').select('*').limit(4);
        setCategories(catData || []);

        // Fetch featured
        const { data: featData } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(4);
        setFeaturedProducts(featData || []);

        // Fetch new arrivals
        const { data: newData } = await supabase
          .from('products')
          .select('*')
          .eq('is_new_arrival', true)
          .eq('is_active', true)
          .limit(4);
        setNewArrivals(newData || []);

      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-olive-dark" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Zyvelle Souk | Fine Artisanal Jewellery & Handcrafted Gold Pieces</title>
        <meta name="description" content="Discover Zyvelle Souk, the ultimate destination for exquisite handcrafted fine jewellery. Explore our collection of gold necklaces, artisanal earrings, and signature rings designed for timeless elegance." />
        <meta name="keywords" content="fine jewellery, gold jewelry, artisanal jewellery, handcrafted jewelry, luxury jewelry, necklaces, rings, earrings" />
      </Helmet>

      {/* Hero Section Carousel */}
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-olive-dark">
        <AnimatePresence mode="wait">
          {heroSlides.length > 0 ? (
            <motion.div
              key={heroSlides[currentSlide].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
                className="w-full h-full"
              >
                <img 
                  src={heroSlides[currentSlide].image_url} 
                  alt={`${heroSlides[currentSlide].title} - Zyvelle Souk Hero Campaign`} 
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover brightness-[0.7]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="max-w-3xl text-white"
                  >
                    <span className="text-[10px] lg:text-xs tracking-[0.4em] uppercase font-bold text-cream/70 mb-6 block drop-shadow-lg">
                      {heroSlides[currentSlide].subtitle || 'EST. 2024 — Fine Jewellery'}
                    </span>
                    <h1 className="text-4xl md:text-8xl lg:text-[10rem] font-serif mb-6 md:mb-8 leading-[1.1] lg:leading-[0.85] tracking-tighter whitespace-pre-line drop-shadow-xl">
                      {heroSlides[currentSlide].title}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12">
                      <Link
                        to={heroSlides[currentSlide].button_link || "/collections"}
                        className="px-10 py-5 bg-cream text-olive-dark text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold-muted hover:text-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 group"
                      >
                        {heroSlides[currentSlide].button_text || 'Discover Collection'} <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Fallback Hero if no slides */
            <div className="absolute inset-0 z-0 bg-olive-dark">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
               <div className="absolute inset-0 flex items-center justify-center text-cream">
                 <h1 className="font-serif italic tracking-widest text-3xl">Zyvelle Souk Ateliar</h1>
               </div>
            </div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        {heroSlides.length > 1 && (
          <>
            <div className="absolute bottom-10 left-6 lg:left-12 z-20 flex items-center gap-6">
              <div className="flex gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "h-1 transition-all duration-500",
                      currentSlide === idx ? "w-12 bg-cream" : "w-6 bg-cream/30 hover:bg-cream/50"
                    )}
                  />
                ))}
              </div>
              <div className="text-white/50 text-[10px] font-mono tracking-widest">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </div>
            </div>

            <div className="absolute right-6 lg:right-12 bottom-10 z-20 flex gap-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-white hover:bg-cream hover:text-olive-dark transition-all duration-500 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-white hover:bg-cream hover:text-olive-dark transition-all duration-500 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Floating Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-4 z-10"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-cream/60 to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 bg-white border-b border-olive-deep/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-muted mb-8 font-bold">Our Philosophy</h2>
          <p className="text-2xl md:text-3xl font-serif text-olive-dark leading-relaxed mb-8 italic">
            "Jewellery is a legacy of stories, a reflection of the soul, and a testament to the artisan's hand."
          </p>
          <p className="text-olive-deep/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
            At Zyvelle Souk, our commitment to fine jewellery begins with the selection of exquisite materials, 
            blending heritage techniques with modern vision to create pieces that will be cherished for generations.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-32 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold-muted mb-4 block font-bold">Collections</span>
              <h2 className="text-3xl md:text-5xl font-serif text-olive-dark">Curated Fine Artefacts</h2>
            </div>
            <Link 
              to="/collections" 
              className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-olive-deep/60 hover:text-olive-dark transition-colors border-b border-transparent hover:border-olive-dark pb-1"
            >
              Explore All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/category/${cat.slug}`} className="group block relative aspect-[4/5] overflow-hidden bg-champagne">
                  <img 
                    src={cat.image_url} 
                    alt={`Shop ${cat.name} Collection`} 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-10 left-0 right-0 text-center">
                    <h3 className="text-2xl font-serif text-white tracking-widest mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] text-white/0 group-hover:text-white/100 uppercase tracking-[0.2em] transition-all duration-500">
                      Shop Now
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32 px-6 bg-[#FEFCF8]">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
          <span className="text-[9px] tracking-[0.4em] uppercase text-gold-muted mb-4 block font-bold">Artisanal Selection</span>
          <h2 className="text-3xl md:text-5xl font-serif text-olive-dark mb-6">Signature Treasures</h2>
          <p className="text-olive-deep/60 max-w-xl mx-auto text-sm leading-relaxed px-4 md:px-0">
            Essential pieces hand-selected for their exceptional brilliance and timeless design.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map((product) => (
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
      </section>

      {/* Reassurance Grid */}
      <section className="py-24 px-6 bg-olive-dark text-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <Shield className="w-10 h-10 text-gold-muted" strokeWidth={1} />
            <h3 className="text-sm uppercase tracking-widest font-bold">Certified Quality</h3>
            <p className="text-cream/60 text-[13px] leading-relaxed max-w-xs">
              Every Zyvelle Souk piece comes with an official certificate of authenticity, ensuring the purity of our gold and quality of our gems.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Globe className="w-10 h-10 text-gold-muted" strokeWidth={1} />
            <h3 className="text-sm uppercase tracking-widest font-bold">Global Shipping</h3>
            <p className="text-cream/60 text-[13px] leading-relaxed max-w-xs">
              We deliver our fine jewellery worldwide, with secure, insured packaging that guarantees your treasures arrive in pristine condition.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Award className="w-10 h-10 text-gold-muted" strokeWidth={1} />
            <h3 className="text-sm uppercase tracking-widest font-bold">Artisan Heritage</h3>
            <p className="text-cream/60 text-[13px] leading-relaxed max-w-xs">
              Our designs are inspired by centuries of artisanal craftsmanship, reimagined for the modern aesthetic of today's discerning collector.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Campaign Banner */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=2000" 
          alt="Zyvelle Souk Artisanal Campaign" 
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-olive-dark/40" />
        <div className="relative z-10 text-center text-cream px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
             <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-cream/70 mb-6 block">Our Story</span>
            <h2 className="text-4xl md:text-7xl font-serif mb-10 leading-tight">
              A Legacy of <br /> <span className="italic font-light">Craftsmanship</span>
            </h2>
            <Link 
              to="/about"
              className="inline-block px-12 py-5 bg-cream text-olive-dark text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold-muted hover:text-white transition-all duration-500"
            >
              Explore Our Narrative
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 md:py-32 px-6 bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
          <div>
            <span className="text-[9px] tracking-[0.4em] uppercase text-gold-muted mb-4 block font-bold">New arrivals</span>
            <h2 className="text-3xl md:text-5xl font-serif text-olive-dark">Just Landed</h2>
          </div>
          <Link 
            to="/collections" 
            className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-gold-muted transition-colors flex items-center gap-2 border-b border-olive-deep/20 pb-1"
          >
            Discover All New
          </Link>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {newArrivals.map((product) => (
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
      </section>

      {/* Content Expansion Block */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
          <div className="space-y-8">
             <h2 className="text-3xl md:text-4xl font-serif text-olive-dark leading-snug">The Artisanal Choice <br className="hidden md:block" /> for Rare Fine Jewellery</h2>
             <div className="text-olive-deep/60 text-sm md:text-base leading-relaxed space-y-6 max-w-xl">
                <p>
                  Choosing jewellery is a deeply personal experience. Whether you are searching for a statement necklace or understated earrings, Zyvelle Souk offers pieces that resonate with purpose and reflect your unique journey.
                </p>
                <p>
                  We use high-karat gold and ethically vetted gemstones, ensuring that every signature treasure is as durable as it is beautiful—intended to be cherished for generations as a timeless investment.
                </p>
             </div>
          </div>
          <div className="relative aspect-square md:aspect-video lg:aspect-square">
             <img 
               src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800" 
               alt="Fine Jewellery Detail" 
               crossOrigin="anonymous"
               className="w-full h-full object-cover rounded-sm shadow-xl"
               loading="lazy"
             />
             <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-32 h-32 md:w-48 md:h-48 bg-cream border border-olive-deep/5 p-4 md:p-6 flex flex-col justify-center items-center text-center shadow-xl">
                <span className="text-xl md:text-2xl font-serif text-gold-muted mb-2 font-bold">100%</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-olive-dark font-bold leading-tight">Handcrafted Excellence</span>
             </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-24 bg-olive-deep/5 border-y border-olive-deep/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-olive-deep" strokeWidth={1} />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-olive-dark mb-4 md:mb-6">Bespoke Consultations</h2>
          <p className="text-olive-deep/60 mb-8 md:mb-10 leading-relaxed font-light italic text-base md:text-lg">
            "We are here to help you find the piece that whispers your name."
          </p>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '918075775586'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-olive-dark hover:text-gold-muted transition-colors group px-8 py-4 border border-olive-dark/20 hover:border-gold-muted"
          >
            Chat with a Stylist <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}
