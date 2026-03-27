import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Coffee, MapPin, BookOpen, User, Phone, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen, user, logout } = useStore();

  const links = [
    { name: 'Shop', path: '/shop', icon: Coffee },
    { name: 'The Fix', path: '/the-fix', icon: Coffee },
    { name: 'Visit', path: '/visit', icon: MapPin },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Wholesale', path: '/wholesale', icon: User },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav className={clsx(
      "z-50 text-white transition-all duration-300",
      isHome ? "absolute top-0 w-full bg-transparent border-b border-white/10" : "sticky top-0 bg-[#2C241B] shadow-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center gap-3">
               {/* Red Dot */}
               <div className="w-1.5 h-1.5 bg-[var(--color-rooster-red)] rounded-full"></div>
               
               <div className="relative w-14 h-14 bg-[#EAE7DE] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-[#C5A065]/30">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   {/* Top Left R */}
                   <text 
                     x="10" 
                     y="60" 
                     fontFamily='"Playfair Display", serif' 
                     fontSize="70" 
                     fill="#8B6E4E" 
                     fontWeight="900"
                   >
                     R
                   </text>
                   {/* Bottom Right R */}
                   <text 
                     x="35" 
                     y="85" 
                     fontFamily='"Playfair Display", serif' 
                     fontSize="70" 
                     fill="#8B6E4E" 
                     fontWeight="900"
                   >
                     R
                   </text>
                 </svg>
               </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-wide leading-none text-white uppercase">
                Red Rooster
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-rooster-gold)]">Coffee Roaster</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "text-sm font-serif font-medium tracking-wide hover:text-[var(--color-rooster-gold)] transition-colors relative group py-2",
                  location.pathname === link.path ? "text-[var(--color-rooster-gold)]" : "text-stone-200"
                )}
              >
                {link.name}
                <span className={clsx(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-rooster-gold)] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                  location.pathname === link.path && "scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-serif font-bold text-[var(--color-rooster-gold)]">Hi, {user.name}</span>
                <button onClick={logout} className="text-stone-200 hover:text-white font-serif" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="text-stone-200 hover:text-[var(--color-rooster-gold)] transition-colors text-sm font-serif font-medium"
              >
                Log In
              </button>
            )}
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-200 hover:text-[var(--color-rooster-gold)] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-rooster-red)] text-white text-[10px] flex items-center justify-center rounded-full font-bold border border-[var(--color-rooster-green)]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-200 hover:text-[var(--color-rooster-gold)] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#2C241B] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-stone-100 font-serif font-medium transition-colors"
                >
                  <link.icon className="w-5 h-5 text-[var(--color-rooster-gold)]" />
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 my-2 pt-2">
                {user ? (
                  <div className="px-4 py-3 flex justify-between items-center text-stone-200">
                    <span>Hi, {user.name}</span>
                    <button onClick={logout} className="text-sm underline">Logout</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { navigate('/login'); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 text-stone-200 font-serif font-medium hover:text-[var(--color-rooster-gold)]"
                  >
                    Log In
                  </button>
                )}
                <button 
                  onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                  className="w-full text-left px-4 py-3 text-stone-200 font-medium hover:text-[var(--color-rooster-gold)] flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Cart ({cartCount})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
