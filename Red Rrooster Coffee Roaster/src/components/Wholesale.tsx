import { Store, Coffee, GraduationCap, Settings, Leaf, Recycle, ArrowRight, Mail, Phone, User } from 'lucide-react';

export default function Wholesale() {
  return (
    <div className="bg-[var(--color-rooster-green)] min-h-screen text-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Hero Image */}
        <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-12 relative shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000" 
            alt="Coffee Roasting" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-4xl md:text-6xl text-white text-center drop-shadow-lg px-4">
              Wholesale Partners
            </h1>
          </div>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-16">
          Different ways to do Wholesale with us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-2 flex flex-col items-center text-center space-y-12 pt-8">
            <div className="space-y-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-rooster-gold)] shadow-lg mx-auto transition-transform group-hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1581683705068-ca8f49fc7f45?auto=format&fit=crop&q=80&w=200" 
                  alt="Grocery" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold tracking-wider uppercase text-sm group-hover:text-[var(--color-rooster-gold)] transition-colors">Grocery</h3>
            </div>

            <div className="space-y-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-rooster-gold)] shadow-lg mx-auto transition-transform group-hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200" 
                  alt="Cafe" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold tracking-wider uppercase text-sm group-hover:text-[var(--color-rooster-gold)] transition-colors">Cafe & Restaurants</h3>
            </div>

            <div className="text-sm text-stone-400 space-y-2 font-medium pt-4 border-t border-white/10 w-full">
              <p>Barista Training</p>
              <p>Equipment Sales</p>
              <p>Consulting Services</p>
            </div>
          </div>

          {/* Center Card */}
          <div className="lg:col-span-6 relative z-10">
            <div className="bg-[var(--color-rooster-cream)] text-stone-800 rounded-3xl p-8 md:p-12 shadow-2xl">
              <p className="text-lg leading-relaxed mb-8 text-stone-700">
                We love coffee and we love sharing coffee with people. One of our great joys at Red Rooster is building relationships with our wholesale partners. We offer a full spectrum of award winning, transparently traded, expertly processed coffees, that are roasted with care. Need bright, lively and fruit forward coffees? We've got you covered. Need approachable, chocolatey and nutty coffees? We've got those too.
              </p>

              <div className="mb-12">
                <h3 className="font-serif text-2xl font-bold mb-6 text-[var(--color-rooster-green)]">Perks</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: GraduationCap, label: "SCA Certified Training" },
                    { icon: Settings, label: "High End Equipment Sales" },
                    { icon: Leaf, label: "Certified Organic Offerings" },
                    { icon: Recycle, label: "Sustainable Packaging" }
                  ].map((perk, i) => (
                    <div key={i} className="bg-[#EAE7DE] rounded-xl p-4 flex flex-col items-center text-center border border-stone-200 h-full justify-center">
                      <perk.icon className="w-8 h-8 text-[var(--color-rooster-green)] mb-3" strokeWidth={1.5} />
                      <span className="text-xs font-bold uppercase tracking-wide text-stone-600 leading-tight">{perk.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href="https://redroosterwholesale.com/pages/advanced-registration" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-[var(--color-rooster-red)] text-white font-bold text-center py-4 rounded-xl hover:bg-red-800 transition-colors shadow-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                Become a Wholesale Partner <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* OR Circle Badge - Absolute positioned on desktop */}
            <div className="hidden lg:flex absolute top-1/2 -right-10 -translate-y-1/2 w-20 h-20 bg-[#966F33] rounded-full items-center justify-center z-20 shadow-xl border-4 border-[var(--color-rooster-green)]">
              <span className="font-serif text-2xl text-white italic">OR</span>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6 relative">
             {/* Background Rooster Watermark */}
             <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current transform scale-150 translate-x-1/4 translate-y-1/4">
                  <path d="M100 20c-10 0-20 5-25 15 ..."/> {/* Simplified placeholder path */}
                  {/* Using a simple circle as placeholder if SVG path is too complex, but let's try to make it look like a watermark */}
                  <circle cx="100" cy="100" r="80" />
                </svg>
             </div>

            {/* Decorative Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-400/30 h-48 relative group">
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600" 
                alt="Coffee Atmosphere" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-serif italic text-lg">"Quality in every cup"</p>
              </div>
            </div>

            <div className="border border-stone-400/30 rounded-2xl p-8 text-center relative z-10 bg-[var(--color-rooster-green)]/50 backdrop-blur-sm">
              <h3 className="font-serif text-2xl text-white mb-4">Contact us directly</h3>
              <div className="space-y-2 text-sm text-stone-300">
                <a href="mailto:partners@redroostercoffeeroaster.com" className="block hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> partners@redroostercoffeeroaster.com
                </a>
                <a href="tel:5407457338" className="block hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> 540-745-7338
                </a>
                <div className="flex items-center justify-center gap-2 text-[var(--color-rooster-gold)] pt-2">
                  <User className="w-4 h-4" /> Ask for Haden
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
