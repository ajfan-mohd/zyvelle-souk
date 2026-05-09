import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { useSecurity } from '../context/SecurityContext';

export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { csrfToken } = useSecurity();

  const handleWhatsAppEnquiry = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch('/api/order/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken || '',
        },
        body: JSON.stringify({ 
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })) 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate order');
      }

      const { whatsappUrl } = await response.json();
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-olive-deep/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-olive-dark" />
                <h2 className="text-lg font-serif font-medium uppercase tracking-widest text-olive-dark">
                  Your Bag ({totalItems})
                </h2>
              </div>
              <button 
                onClick={() => toggleCart(false)}
                className="p-2 hover:bg-olive-deep/5 rounded-full transition-colors"
                id="close-cart"
              >
                <X className="w-6 h-6 text-olive-dark" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-olive-deep/5 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-olive-deep/20" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-olive-dark">Your bag is empty</h3>
                    <p className="text-xs text-olive-deep/40 uppercase tracking-widest mt-2">
                      Discover our exquisite collection
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleCart(false)}
                    className="mt-4 px-8 py-3 bg-olive-dark text-cream text-[10px] uppercase tracking-widest font-bold hover:bg-olive-deep transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-champagne overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop'} 
                        alt={item.name} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-serif uppercase tracking-wider text-olive-dark">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-olive-deep/60">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-olive-deep/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-olive-deep/10 bg-white">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-olive-deep/5 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-olive-deep/5 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-olive-deep/10 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs uppercase tracking-widest text-olive-deep/40 font-medium">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-serif uppercase tracking-widest text-olive-dark font-bold">Total</span>
                    <span className="text-lg font-serif text-olive-dark font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleWhatsAppEnquiry}
                  className="w-full bg-green-600 text-white flex items-center justify-center gap-3 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-green-700 transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Proceed to WhatsApp Enquiry
                </button>
                
                <p className="text-[9px] text-center text-olive-deep/40 uppercase tracking-[0.1em]">
                  Our collection is exclusive. Enquiries are handled personally.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
