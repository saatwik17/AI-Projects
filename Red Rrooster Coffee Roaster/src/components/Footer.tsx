import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-rooster-green)] text-stone-200 pt-16 pb-8 border-t border-[var(--color-rooster-gold)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group mb-4">
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
               <div className="flex flex-col">
                 <span className="font-serif text-xl font-bold tracking-wide leading-none text-white uppercase">
                   Red Rooster
                 </span>
                 <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-rooster-gold)]">Coffee Roaster</span>
               </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-300">
              Coffee with a Conscience. Roasting organic, fair trade, and direct trade coffees in the heart of the Blue Ridge Mountains since 2010.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/redroostercoffeeroaster" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-rooster-red)] flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/RedRoosterCoffee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-rooster-red)] flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-white text-lg mb-6 border-b border-[var(--color-rooster-gold)]/30 pb-2 inline-block">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-[var(--color-rooster-gold)] transition-colors">Shop Coffee</Link></li>
              <li><Link to="/quiz" className="hover:text-[var(--color-rooster-gold)] transition-colors font-bold text-[var(--color-rooster-gold)]">Find Your Coffee Quiz</Link></li>
              <li><Link to="/learn" className="hover:text-[var(--color-rooster-gold)] transition-colors">Tours & Classes</Link></li>
              <li><Link to="/wholesale" className="hover:text-[var(--color-rooster-gold)] transition-colors">Wholesale</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--color-rooster-gold)] transition-colors">FAQ & Guides</Link></li>
              <li><Link to="/track-order" className="hover:text-[var(--color-rooster-gold)] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-white text-lg mb-6 border-b border-[var(--color-rooster-gold)]/30 pb-2 inline-block">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=823+E.+Main+St,+Floyd,+VA+24091" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-white transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-[var(--color-rooster-gold)] shrink-0 group-hover:text-white transition-colors" />
                  <span>823 E. Main St,<br />Floyd, VA 24091</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-rooster-gold)] shrink-0" />
                <a href="tel:+15407457338" className="hover:text-white transition-colors">+1 540-745-7338</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-rooster-gold)] shrink-0" />
                <a href="mailto:info@redroostercoffeeroaster.com" className="hover:text-white transition-colors">info@redroostercoffeeroaster.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-white text-lg mb-6 border-b border-[var(--color-rooster-gold)]/30 pb-2 inline-block">Cafe Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Mon - Fri</span>
                <span className="text-white">7AM – 5PM</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Saturday</span>
                <span className="text-white">8AM – 3PM</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Sunday</span>
                <span className="text-[var(--color-rooster-red)] font-bold">Closed</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-rooster-gold)]">
              <Clock className="w-3 h-3" />
              <span>Online shop open 24/7</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} Red Rooster Coffee Roaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
