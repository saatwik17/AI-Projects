import { motion } from 'motion/react';
import { ArrowRight, Star, Coffee, Truck, Users, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center bg-stone-200 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop" 
            alt="Coffee Scene" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="font-mono text-white text-sm tracking-[0.2em] mb-4 uppercase shadow-sm">
                Red Rooster Coffee
              </h3>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-[0.9] tracking-tight drop-shadow-sm">
                FREE SHIPPING <br/> ORDERS $50 <br/> AND UP
              </h1>
              
              <div className="inline-block bg-[#F5F2EB] text-[#2D4F43] px-6 py-3 font-mono text-sm tracking-widest lowercase rounded-sm shadow-lg">
                no code needed
              </div>
            </motion.div>
          </div>

          {/* Bottom Right Card */}
          <div className="absolute bottom-12 right-4 md:right-8 lg:right-12 max-w-sm w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-[#F9F9F7] p-8 rounded-xl shadow-2xl"
            >
              <div className="mb-8">
                <h3 className="text-[#2D4F43] text-lg font-medium mb-2">Orders $50 and up ship free!</h3>
                <Link to="/shop" className="text-sm text-stone-500 hover:text-[#2D4F43] flex items-center gap-2 transition-colors font-mono">
                  No code needed <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div>
                <h3 className="text-[#2D4F43] text-lg font-medium mb-2">Gifts that always fit</h3>
                <div className="flex justify-between items-center">
                  <Link to="/shop" className="text-sm text-stone-500 hover:text-[#2D4F43] flex items-center gap-2 transition-colors font-mono">
                    Shop Gift Cards <ArrowRight className="w-3 h-3" />
                  </Link>

                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Left Tab */}
          <div className="absolute bottom-0 left-4 md:left-8 lg:left-12">
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white px-6 py-4 rounded-t-lg shadow-lg cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[#2D4F43] font-medium">Save with 15% off</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / Value Props */}
      <section className="py-20 bg-[var(--color-rooster-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[var(--color-rooster-red)]">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Award Winning Quality</h3>
              <p className="text-stone-600 leading-relaxed">
                Over 100 coffees scored 90+ on Coffee Review. Consistently ranked in the Top 30 lists from 2015–2023.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[var(--color-rooster-red)]">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Ethical Sourcing</h3>
              <p className="text-stone-600 leading-relaxed">
                Direct trade relationships and organic/fair trade certifications. We prioritize impact at origin and racial equality.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[var(--color-rooster-red)]">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Fresh to Your Door</h3>
              <p className="text-stone-600 leading-relaxed">
                Roasted fresh in Floyd, VA. Free shipping on orders over $50. Join "The Fix" for monthly small-lot deliveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[var(--color-rooster-red)] font-bold tracking-widest text-xs uppercase mb-2 block">Fresh Roasts</span>
              <h2 className="font-serif text-4xl font-bold text-[var(--color-rooster-dark)]">Customer Favorites</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-[var(--color-rooster-red)] font-medium hover:text-red-700 transition-colors">
              View All Coffees <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Funky Chicken", type: "Signature Blend", price: "$19.00", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800", badge: "Best Seller" },
              { name: "Lovebirds", type: "Medium Roast", price: "$18.50", image: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=800", badge: "Staff Pick" },
              { name: "Ethiopia Yirgacheffe", type: "Single Origin", price: "$24.00", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800", badge: "94 Points" },
              { name: "Floyd Farmhouse", type: "Breakfast Blend", price: "$17.00", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800", badge: null },
            ].map((product, i) => (
              <Link key={i} to="/shop" className="group cursor-pointer block">
                <div className="relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden mb-4">
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full z-10 shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <button className="absolute bottom-4 right-4 bg-white text-[var(--color-rooster-dark)] p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--color-rooster-red)] hover:text-white">
                    <Coffee className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-serif text-xl font-bold mb-1 group-hover:text-[var(--color-rooster-red)] transition-colors">{product.name}</h3>
                <p className="text-stone-500 text-sm mb-2">{product.type}</p>
                <p className="font-medium text-[var(--color-rooster-dark)]">{product.price}</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-[var(--color-rooster-red)] font-medium hover:text-red-700 transition-colors">
              View All Coffees <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[var(--color-rooster-gold)] font-bold tracking-widest text-xs uppercase mb-4 block">Visit Us in Floyd, VA</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">Experience the Rooster <br/>in Person</h2>
              <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                Located in downtown Floyd near the Blue Ridge Parkway. Enjoy our full espresso bar, pour-overs, and fresh pastries in a community-focused setting.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-stone-300">
                  <Clock className="w-5 h-5 text-[var(--color-rooster-red)]" />
                  <span>Open Daily (Closed Sundays)</span>
                </li>
                <li className="flex items-center gap-3 text-stone-300">
                  <a 
                    href="https://www.google.com/maps/place/Red+Rooster+Coffee/@36.910508,-80.322336,17z/data=!3m1!4b1!4m6!3m5!1s0x884d9a636901617d:0x933618768018f62!8m2!3d36.910508!4d-80.3197611!16s%2Fg%2F1tfw601y?entry=ttu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-[var(--color-rooster-gold)] transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-[var(--color-rooster-red)]" />
                    <span>823 E. Main St, Floyd, VA 24091</span>
                  </a>
                </li>
              </ul>
              <Link 
                to="/visit" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-200 transition-colors"
              >
                Plan Your Visit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden border-8 border-white/5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" 
                  alt="Cafe Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[var(--color-rooster-red)] rounded-full flex items-center justify-center p-6 text-center shadow-xl hidden md:flex">
                <p className="font-serif font-bold text-xl leading-tight">
                  "Best coffee stop on the Parkway!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
