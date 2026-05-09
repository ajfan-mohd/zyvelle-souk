import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { formatCurrency, generateWhatsAppLink } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  is_new_arrival?: boolean;
  sale_price?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  image_url, 
  slug,
  is_new_arrival,
  sale_price
}) => {
  const { addToCart } = useCart();

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price: sale_price || price, image_url, slug });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EFEEEC] mb-5 group">
        <Link to={`/product/${slug}`} className="block h-full">
          <img
            src={image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop'}
            alt={name}
            crossOrigin="anonymous"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {is_new_arrival && (
            <span className="bg-white px-3 py-1 text-[8px] uppercase tracking-widest font-bold text-olive-dark shadow-sm">
              New
            </span>
          )}
          {sale_price && (
            <span className="bg-gold-muted px-3 py-1 text-[8px] uppercase tracking-widest font-bold text-white shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full lg:translate-y-10 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 flex gap-2 z-10 lg:block hidden">
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToBag}
              className="flex-1 bg-olive-dark text-cream text-[9px] uppercase tracking-[0.2em] font-medium py-3 hover:bg-olive-deep transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3 h-3" /> Add to Bag
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={generateWhatsAppLink(name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 bg-white text-olive-dark hover:text-green-600 transition-colors flex items-center justify-center shadow-sm"
              title="Enquire on WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Mobile Action Buttons (Visible by default on mobile) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 p-2 flex gap-1 z-10">
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleAddToBag}
            className="flex-1 bg-olive-dark/90 backdrop-blur-sm text-cream text-[8px] uppercase tracking-widest font-bold py-2.5 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" /> Bag
          </motion.button>
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            href={generateWhatsAppLink(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 bg-white/90 backdrop-blur-sm text-olive-dark flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </div>

      <div className="text-center px-2">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-olive-deep/40 font-medium">Fine Jewellery</span>
        </div>
        <Link to={`/product/${slug}`} className="block mb-1 group-hover:text-gold-muted transition-colors">
          <h3 className="text-sm font-serif tracking-[0.05em] uppercase border-b border-transparent group-hover:border-gold-muted inline-block">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-3">
          {sale_price ? (
            <>
              <span className="text-xs text-olive-deep/40 line-through">{formatCurrency(price)}</span>
              <span className="text-xs font-semibold text-olive-dark">{formatCurrency(sale_price)}</span>
            </>
          ) : (
            <span className="text-xs font-semibold text-olive-dark">{formatCurrency(price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
