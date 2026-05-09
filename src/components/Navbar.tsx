import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Search, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { getSupabase } from '../lib/supabase';
import { cleanSearchQuery } from '../lib/security';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: any[]; categories: any[] }>({
    products: [],
    categories: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const displayWhite = isHome && !isScrolled;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '918075775586';

  const navLinks = [
    { name: 'Shop', path: '/collections' },
    { name: 'New Arrivals', path: '/collections?filter=new' },
    { name: 'Best Sellers', path: '/collections?filter=featured' },
    { name: 'About', path: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getSupabase()
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
          .limit(4);

        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(searchQuery);
      }, 400);

      return () => clearTimeout(delayDebounceFn);
    }

    setSearchResults({ products: [], categories: [] });
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);

    try {
      const cleanQuery = cleanSearchQuery(query);
      if (!cleanQuery) return;

      const response = await fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-olive-dark text-cream py-2 px-4 text-center text-[8px] md:text-[10px] tracking-[0.15em] font-medium uppercase z-[60] leading-relaxed">
        Complimentary UAE delivery on selected jewellery orders
      </div>

      <nav
        className={cn(
          'fixed top-9 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-6 py-4',
          isScrolled
            ? 'bg-cream/90 backdrop-blur-md shadow-sm translate-y-[-36px] py-3'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-[40px_1fr_92px] lg:flex lg:items-center lg:justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            className={cn(
              'lg:hidden p-1 transition-colors',
              displayWhite ? 'text-white' : 'text-olive-dark'
            )}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Nav Links Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <Link
                to="/collections"
                className={cn(
                  'text-[11px] uppercase tracking-[0.15em] font-medium transition-colors',
                  displayWhite
                    ? 'text-white/90 hover:text-white'
                    : 'text-olive-dark hover:text-gold-muted'
                )}
              >
                Shop
              </Link>

              <AnimatePresence>
                {isShopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="fixed left-1/2 top-[88px] -translate-x-1/2 w-[680px] bg-[#F8F5EF]/88 backdrop-blur-2xl backdrop-saturate-150 border border-olive-deep/10 shadow-2xl shadow-black/10 p-6 rounded-[2px]"
                  >
                    <div className="grid grid-cols-[1fr_240px] gap-10">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-olive-deep/40 mb-6">
                          Shop by Collection
                        </p>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                          <Link
                            to="/collections"
                            onClick={() => setIsShopMenuOpen(false)}
                            className="group border-b border-olive-deep/10 pb-3"
                          >
                            <span className="block font-serif text-[30px] text-olive-dark transition-all duration-300 group-hover:text-gold-muted group-hover:translate-x-1">
                              All Collections
                            </span>
                            <span className="block text-[10px] uppercase tracking-widest text-olive-deep/35 mt-1">
                              Explore the full edit
                            </span>
                          </Link>

                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.slug}`}
                              onClick={() => setIsShopMenuOpen(false)}
                              className="group border-b border-olive-deep/10 pb-3"
                            >
                              <span className="block font-serif text-[30px] text-olive-dark transition-all duration-300 group-hover:text-gold-muted group-hover:translate-x-1">
                                {cat.name}
                              </span>
                              <span className="block text-[10px] uppercase tracking-widest text-olive-deep/35 mt-1">
                                View collection
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <Link
                        to="/collections?filter=new"
                        onClick={() => setIsShopMenuOpen(false)}
                        className="group block bg-white border border-olive-deep/5 overflow-hidden rounded-[2px]"
                      >
                        <div className="aspect-[4/5] bg-cream overflow-hidden">
                          <img
                            src={
                              categories[0]?.image_url ||
                              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop'
                            }
                            alt="New arrivals"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>

                        <div className="p-4">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-olive-deep/40">
                            Editorial Selection
                          </p>
                          <h3 className="font-serif text-xl text-olive-dark mt-2">
                            New Arrivals
                          </h3>
                          <p className="text-xs text-olive-deep/50 mt-2 leading-relaxed">
                            Soft statement pieces curated for refined everyday styling.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/collections?filter=new"
              className={cn(
                'text-[11px] uppercase tracking-[0.15em] font-medium transition-colors',
                displayWhite
                  ? 'text-white/90 hover:text-white'
                  : 'text-olive-dark hover:text-gold-muted'
              )}
            >
              New Arrivals
            </Link>

            <Link
              to="/collections?filter=featured"
              className={cn(
                'text-[11px] uppercase tracking-[0.15em] font-medium transition-colors',
                displayWhite
                  ? 'text-white/90 hover:text-white'
                  : 'text-olive-dark hover:text-gold-muted'
              )}
            >
              Best Sellers
            </Link>

            <Link
              to="/about"
              className={cn(
                'text-[11px] uppercase tracking-[0.15em] font-medium transition-colors',
                displayWhite
                  ? 'text-white/90 hover:text-white'
                  : 'text-olive-dark hover:text-gold-muted'
              )}
            >
              About
            </Link>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className={cn(
              'flex flex-col items-center justify-center transition-colors mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2',
              displayWhite ? 'text-white' : 'text-olive-dark'
            )}
          >
            <h1
              className={cn(
                'text-xl md:text-3xl font-serif tracking-[0.08em] transition-all duration-500 whitespace-nowrap',
                isScrolled ? 'scale-90' : 'scale-100'
              )}
            >
              ZYVELLE SOUK
            </h1>
            <span className="text-[7px] md:text-[8px] tracking-[0.35em] uppercase opacity-70 mt-0.5">
              Fine Jewellery
            </span>
          </Link>

          {/* Icons Right */}
          <div className="flex items-center justify-end gap-3 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                'transition-colors',
                displayWhite ? 'text-white hover:text-cream' : 'text-olive-dark hover:text-gold-muted'
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'hidden sm:block transition-colors',
                displayWhite ? 'text-white hover:text-green-400' : 'text-olive-dark hover:text-green-600'
              )}
              title="Speak to an expert"
            >
              <MessageCircle className="w-5 h-5 stroke-[1.5]" />
            </a>

            <button
              onClick={() => toggleCart(true)}
              className={cn(
                'relative transition-colors',
                displayWhite ? 'text-white hover:text-cream' : 'text-olive-dark hover:text-gold-muted'
              )}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-muted text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-xl font-serif tracking-widest">ZYVELLE SOUK</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-6 h-6 text-olive-dark" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif tracking-wide hover:text-gold-muted transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {categories.length > 0 && (
                <div className="mt-10 pt-8 border-t border-olive-deep/10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-olive-deep/40 mb-5">
                    Collections
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm uppercase tracking-widest text-olive-dark/70"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-olive-deep/10 flex flex-col gap-6">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-green-600 font-bold tracking-[0.2em] uppercase text-xs"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Support
                </a>
                <Link to="/contact" className="text-sm tracking-widest uppercase text-olive-deep/60">
                  Contact Us
                </Link>
                <Link to="/about" className="text-sm tracking-widest uppercase text-olive-deep/60">
                  Our Story
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col"
          >
            <div className="p-6 md:p-12 border-b border-olive-deep/5 flex items-center justify-between">
              <div className="flex-grow flex items-center gap-4">
                <Search className="w-6 h-6 text-olive-deep/30" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for jewellery, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-2xl md:text-4xl font-serif text-olive-dark outline-none placeholder:text-olive-deep/10"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-olive-deep/5 rounded-full"
                aria-label="Close search"
              >
                <X className="w-8 h-8 text-olive-dark" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-12">
              <div className="max-w-4xl mx-auto">
                {isSearching ? (
                  <div className="py-20 text-center">
                    <span className="text-sm uppercase tracking-widest text-olive-deep/40 font-bold animate-pulse">
                      Searching the Atelier...
                    </span>
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 mb-6 border-b border-olive-deep/5 pb-2">
                        Collections
                      </h3>

                      {searchResults.categories.length > 0 ? (
                        <div className="space-y-4">
                          {searchResults.categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="group flex items-center justify-between py-2 border-b border-transparent hover:border-gold-muted transition-all"
                            >
                              <span className="text-lg font-serif text-olive-dark group-hover:text-gold-muted">
                                {cat.name}
                              </span>
                              <X className="w-4 h-4 rotate-45 text-olive-deep/20" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-olive-deep/40 italic">
                          No collections match your search.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 mb-6 border-b border-olive-deep/5 pb-2">
                        Products
                      </h3>

                      {searchResults.products.length > 0 ? (
                        <div className="space-y-6">
                          {searchResults.products.map((prod) => (
                            <Link
                              key={prod.id}
                              to={`/product/${prod.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex gap-4 group"
                            >
                              <div className="w-16 h-16 bg-cream overflow-hidden">
                                <img
                                  src={prod.image_url}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="py-1">
                                <h4 className="text-sm font-serif uppercase tracking-wider text-olive-dark group-hover:text-gold-muted">
                                  {prod.name}
                                </h4>
                                <span className="text-xs text-olive-deep/40">
                                  {new Intl.NumberFormat('en-AE', {
                                    style: 'currency',
                                    currency: 'AED',
                                  }).format(prod.sale_price || prod.price)}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-olive-deep/40 italic">
                          No products match your search.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-sm text-olive-deep/40 uppercase tracking-widest font-medium mb-4">
                      Trending Collections
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {['Necklaces', 'Earrings', 'New Arrivals'].map((trend) => (
                        <button
                          key={trend}
                          onClick={() => setSearchQuery(trend)}
                          className="px-6 py-2 border border-olive-deep/10 text-[10px] uppercase tracking-widest hover:bg-olive-dark hover:text-cream transition-all"
                        >
                          {trend}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}