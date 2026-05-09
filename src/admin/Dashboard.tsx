import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import CategoryProductsView from './CategoryProductsView';
import { 
  BarChart3, 
  Settings, 
  Package, 
  LayoutDashboard, 
  Layers,
  Image as ImageIcon,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2, 
  Trash2, 
  Eye,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Users,
  ShoppingBag,
  Menu,
  X,
  Loader2,
  Star,
  AlertCircle,
  FileImage
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useToast } from '../components/ui/Toaster';
import CategoryForm from './CategoryForm';
import HeroSlideForm from './HeroSlideForm';

// Placeholder sub-components
const StatsCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 border border-olive-deep/5 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-olive-deep/5 rounded-lg">
        <Icon className="w-5 h-5 text-olive-dark" />
      </div>
      {trend && (
        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-olive-deep/40 text-[10px] uppercase tracking-widest font-bold mb-1">{title}</h3>
    <p className="text-2xl font-serif text-olive-dark">{value}</p>
  </div>
);

export const SectionHeader = ({ title, description, actions }: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
    <div>
      <h1 className="text-2xl font-serif text-olive-dark mb-1">{title}</h1>
      <p className="text-sm text-olive-deep/60">{description}</p>
    </div>
    <div className="flex gap-3">
      {actions}
    </div>
  </div>
);

// Admin Dashboard Views
const Overview = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    featured: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getSupabase();
        const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
        const { count: featCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true);
        const { count: stockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'out_of_stock');

        setStats({
          products: prodCount || 0,
          categories: catCount || 0,
          featured: featCount || 0,
          outOfStock: stockCount || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Pieces', value: stats.products, icon: ShoppingBag, color: 'text-olive-dark' },
    { label: 'Collections', value: stats.categories, icon: LayoutGrid, color: 'text-gold-muted' },
    { label: 'Featured Items', value: stats.featured, icon: Star, color: 'text-blue-600' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'text-red-500' },
  ];

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-olive-dark" /></div>;

  return (
    <div className="space-y-12">
      <SectionHeader 
        title="Atelier Overview" 
        description="A summary of your current inventory and collection performance."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 border border-olive-deep/5 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 bg-cream rounded-lg group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-olive-dark">{stat.value}</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm">
          <h3 className="text-sm font-serif uppercase tracking-widest text-olive-dark mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-start pb-6 border-b border-olive-deep/5 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-olive-deep/40" />
                </div>
                <div>
                  <p className="text-sm text-olive-dark">New product <span className="font-bold">"Vintage Gold Locket"</span> added to <span className="italic">Necklaces</span>.</p>
                  <span className="text-[10px] text-olive-deep/30 uppercase tracking-widest mt-1 block">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-8 border border-olive-deep/5 rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-gold-muted" />
          </div>
          <div>
            <h3 className="text-sm font-serif uppercase tracking-widest text-olive-dark">Quick Action</h3>
            <p className="text-xs text-olive-deep/40 mt-2 max-w-xs mx-auto">Update your seasonal highlights to keep the storefront fresh and inviting.</p>
          </div>
          <Link to="/admin/products" className="px-8 py-3 bg-olive-dark text-cream text-[10px] uppercase tracking-widest font-bold hover:bg-gold-muted transition-all">Manage Highlights</Link>
        </div>
      </div>
    </div>
  );
};

const Slides = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('hero_slides')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setSlides(data || []);
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this hero slide?')) return;

    try {
      const { error } = await getSupabase()
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast('Slide removed', 'success');
      fetchSlides();
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Hero Carousel" 
        description="Manage the cinematic landing experience of your storefront."
        actions={
          <Link to="/admin/slides/add" className="h-10 px-6 bg-olive-dark text-cream flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-muted transition-all">
            <Plus className="w-4 h-4" /> Add Slide
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-olive-dark" /></div>
        ) : slides.length > 0 ? slides.map((slide) => (
          <div key={slide.id} className="bg-white border border-olive-deep/5 rounded-xl shadow-sm overflow-hidden flex flex-col group">
            <div className="aspect-[4/3] relative overflow-hidden bg-cream">
              <img src={slide.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
                <h3 className="text-white text-lg font-serif mb-1 line-clamp-1">{slide.title}</h3>
                <p className="text-white/60 text-[10px] uppercase tracking-widest line-clamp-1">{slide.subtitle}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold border",
                  slide.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                  {slide.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-olive-deep/5">
              <span className="text-[10px] text-olive-deep/40 font-bold uppercase tracking-widest">Order: {slide.order_index}</span>
              <div className="flex items-center gap-2">
                <Link to={`/admin/slides/edit/${slide.id}`} className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"><Edit2 className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(slide.id)} className="p-2 text-olive-deep/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-white p-20 text-center rounded-xl border border-dashed border-olive-deep/10 text-olive-deep/40">
            No hero slides yet. Add one to light up your homepage.
          </div>
        )}
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('categories')
        .select(`
          *,
          products:products(count)
        `)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Warning: Deleting a collection might orphan its products. Continue?')) return;

    try {
      const { error } = await getSupabase()
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast('Collection removed', 'success');
      fetchCategories();
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Collection Architecture" 
        description="Define and organize the groupings of your fine jewellery ateliar."
        actions={
          <Link to="/admin/categories/add" className="h-10 px-6 bg-olive-dark text-cream flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-muted transition-all">
            <Plus className="w-4 h-4" /> Add Collection
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-olive-dark" /></div>
        ) : categories.length > 0 ? categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-olive-deep/5 rounded-xl shadow-sm overflow-hidden group">
            <div className="aspect-[21/9] bg-champagne overflow-hidden relative">
              <img src={cat.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-serif uppercase tracking-widest text-lg">{cat.name}</h3>
                <span className="text-white/60 text-[9px] uppercase tracking-[0.2em]">{cat.products[0].count} Pieces</span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-olive-deep/5">
              <span className="text-[10px] text-olive-deep/40 font-mono">/{cat.slug}</span>
              <div className="flex items-center gap-2">
                <Link
  to={`/admin/categories/${cat.id}/products`}
  className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"
  title="View Products"
>
  <Eye className="w-4 h-4" />
</Link>
                <Link to={`/admin/categories/edit/${cat.id}`} className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"><Edit2 className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-olive-deep/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-white p-20 text-center rounded-xl border border-dashed border-olive-deep/10 text-olive-deep/40">
            No collections defined yet.
          </div>
        )}
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await getSupabase()
      .from('categories')
      .select('id, name')
      .order('name');

    setCategories(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await getSupabase()
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast('Product deleted', 'success');
      fetchProducts();
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || product.category_id === categoryFilter;

    const matchesStock =
      stockFilter === 'all' || product.stock_status === stockFilter;

    const matchesFeatured =
      !featuredOnly || product.is_featured === true;

    return matchesSearch && matchesCategory && matchesStock && matchesFeatured;
  });

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Product Management"
        description="Search, filter, and manage your jewellery catalog."
        actions={
          <Link
            to="/admin/products/add"
            className="h-10 px-6 bg-olive-dark text-cream flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-muted transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        }
      />

      <div className="bg-white border border-olive-deep/5 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-olive-deep/5 space-y-4">
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-olive-deep/30" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-olive-deep/10 rounded-lg px-3 py-2 text-sm bg-white outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-olive-deep/10 rounded-lg px-3 py-2 text-sm bg-white outline-none"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button
              type="button"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={cn(
                "border rounded-lg px-3 py-2 text-sm transition-all",
                featuredOnly
                  ? "bg-olive-dark text-cream border-olive-dark"
                  : "bg-white text-olive-dark border-olive-deep/10"
              )}
            >
              Featured Only
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
                setFeaturedOnly(false);
              }}
              className="border border-olive-deep/10 rounded-lg px-3 py-2 text-sm text-olive-deep/60 hover:text-olive-dark"
            >
              Clear Filters
            </button>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-olive-deep/40">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-olive-dark" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-olive-deep/[0.02] border-b border-olive-deep/5">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Product</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Category</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Stock</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-olive-deep/60">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-olive-deep/5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-olive-deep/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-champagne rounded overflow-hidden">
                            <img
                              src={product.image_url || 'https://via.placeholder.com/100'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-olive-dark">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-olive-deep/40 font-mono">
                              /{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-olive-deep/70">
                        {product.categories?.name || 'Uncategorized'}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        AED {product.sale_price || product.price}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={cn(
                            "font-medium capitalize",
                            product.stock_status === 'in_stock'
                              ? "text-green-600"
                              : "text-red-500"
                          )}
                        >
                          {product.stock_status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                            product.is_active
                              ? "bg-olive-deep/5 text-olive-dark"
                              : "bg-red-50 text-red-700"
                          )}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            title="Edit"
                            className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/product/${product.slug}`}
                            target="_blank"
                            title="View"
                            className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                            className="p-2 text-olive-deep/40 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-olive-deep/40 italic">
                      No products match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      toast(error.message, 'error');
    } else {
      toast('Logged out', 'success');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Hero Carousel', path: '/admin/slides', icon: FileImage },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
  <div className="min-h-screen bg-[#F8F9FA] flex">
    {/* Mobile overlay */}
    {sidebarOpen && (
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
      />
    )}

    {/* Sidebar */}
    <aside
      className={cn(
        "bg-olive-dark text-cream h-screen fixed lg:sticky top-0 left-0 z-50 transition-all duration-300",
        sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          {sidebarOpen && <h1 className="font-serif tracking-widest">ZYVELLE SOUK</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6 mx-auto" />}
          </button>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group relative",
                  isActive ? "bg-white/10 text-cream" : "text-cream/50 hover:bg-white/5 hover:text-cream"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-gold-muted" : "group-hover:text-gold-muted")} />
                {sidebarOpen && <span className="text-sm font-medium tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-cream/50 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-grow w-full lg:ml-0">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-olive-deep/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-olive-dark text-cream"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-serif tracking-widest text-sm text-olive-dark">
          ZYVELLE SOUK
        </span>
      </div>

      <div className="p-4 sm:p-6 md:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="slides" element={<Slides />} />
            <Route path="slides/add" element={<HeroSlideForm />} />
            <Route path="slides/edit/:id" element={<HeroSlideForm />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:id/products" element={<CategoryProductsView />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="settings" element={<div>Settings View Coming Soon</div>} />
          </Routes>
        </div>
      </div>
    </main>
  </div>
);
}
