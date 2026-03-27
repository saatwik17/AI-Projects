import { useStore } from '../context/StoreContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[var(--color-rooster-cream)]">
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rooster-green)]">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <p className="text-lg">Your cart is empty.</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                    className="mt-4 text-[var(--color-rooster-red)] font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#EAE7DE] rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-[var(--color-rooster-green)] leading-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-stone-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {item.selectedSize} • {item.selectedGrind}
                        {item.purchaseType === 'subscription' && <span className="block text-[var(--color-rooster-red)] font-bold">{item.frequency}</span>}
                      </p>
                      
                      <div className="flex justify-between items-end mt-3">
                        <div className="flex items-center gap-3 bg-stone-100 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 hover:text-[var(--color-rooster-red)]">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 hover:text-[var(--color-rooster-red)]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-stone-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-stone-100 bg-[var(--color-rooster-cream)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-[var(--color-rooster-green)]">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-stone-500 mb-6 text-center">Shipping & taxes calculated at checkout.</p>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-[var(--color-rooster-red)] text-white font-bold py-4 rounded-full hover:bg-red-800 transition-colors shadow-lg"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
