import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';
import { SectionHeader } from './Dashboard';

export default function CategoryProductsView() {
  const { id } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (catError) throw catError;

      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', id)
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      setCategory(catData);
      setProducts(prodData || []);
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const { error } = await getSupabase()
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast('Product deleted', 'success');
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-olive-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title={category?.name || 'Collection'}
        description={`${products.length} products inside this collection`}
        actions={
          <Link
            to="/admin/products/add"
            className="h-10 px-5 bg-olive-dark text-cream flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-muted transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        }
      />

      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-olive-deep/5 rounded-xl p-3 flex items-center gap-4 shadow-sm"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-olive-dark truncate">
                  {product.name}
                </h3>

                <p className="text-sm text-olive-deep/50 mt-1">
                  AED {product.sale_price || product.price}
                </p>

                <span className="text-[10px] uppercase tracking-widest text-olive-deep/40 block mt-2">
                  {product.stock_status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="p-2 text-olive-deep/40 hover:text-olive-dark transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-olive-deep/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-olive-deep/10 text-olive-deep/40">
            No products inside this collection yet.
          </div>
        )}
      </div>
    </div>
  );
}