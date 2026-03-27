import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Learn() {
  return (
    <div className="bg-[var(--color-rooster-cream)] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[var(--color-rooster-dark)] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[var(--color-rooster-gold)] font-bold tracking-widest text-xs uppercase mb-4 block">Education & Experience</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Tours & Classes</h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Go behind the scenes of a working roastery. Learn the art of cupping, brewing, and roasting from our expert team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Roastery Tour Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-stone-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1000" 
                  alt="Roasting Machine" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  $25 / person
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-2xl font-bold">Roastery Tour & Cupping</h3>
                  <span className="flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" /> 60 Mins
                  </span>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Walk through our production facility and learn how green coffee is transformed into the beans you love. Includes a guided tasting (cupping) of 3 distinct coffees.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Users className="w-4 h-4 text-[var(--color-rooster-red)]" />
                    Max 8 people
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="w-4 h-4 text-[var(--color-rooster-red)]" />
                    Saturdays at 10 AM
                  </div>
                </div>
                <Link 
                  to="/learn/book?type=tour"
                  className="block w-full bg-[var(--color-rooster-dark)] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors text-center"
                >
                  Book This Tour
                </Link>
              </div>
            </div>

            {/* Brewing Class Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-stone-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1000" 
                  alt="Pour Over Brewing" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  $45 / person
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-2xl font-bold">Home Brewing Masterclass</h3>
                  <span className="flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" /> 90 Mins
                  </span>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Elevate your morning routine. Learn the science of extraction and master manual brewing methods like V60, Chemex, and French Press.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Users className="w-4 h-4 text-[var(--color-rooster-red)]" />
                    Max 6 people
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="w-4 h-4 text-[var(--color-rooster-red)]" />
                    Sundays at 2 PM
                  </div>
                </div>
                <Link 
                  to="/learn/book?type=class"
                  className="block w-full bg-[var(--color-rooster-dark)] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors text-center"
                >
                  Book This Class
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Info - Addressing Pain Points */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-24">
              <h4 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[var(--color-rooster-red)]" />
                Important Info
              </h4>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
                  <h5 className="font-bold text-[var(--color-rooster-red)] text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Cancellation Policy
                  </h5>
                  <p className="text-sm text-stone-700 leading-relaxed mb-4">
                    <strong>Please Note:</strong> As a small operation, booked educational sessions are vulnerable to cancellations, which waste staff time and resources. We prepare materials specifically for each guest.
                  </p>
                  <ul className="list-disc list-inside text-sm text-stone-700 space-y-2">
                    <li>Cancellations must be made at least <strong>24 hours in advance</strong> for a full refund.</li>
                    <li>No-shows or late cancellations cannot be refunded or rescheduled.</li>
                    <li>Please arrive 10 minutes early to check in. Classes start promptly.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-stone-600">Please arrive 10 minutes early to check in.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-stone-600">Closed-toe shoes required for roastery tours.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-stone-600">All equipment provided for brewing classes.</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 mt-4">
                  <p className="text-sm text-stone-500 text-center">
                    Questions? Email us at<br/>
                    <a href="mailto:info@redroostercoffeeroaster.com" className="text-[var(--color-rooster-red)] font-medium hover:underline">
                      info@redroostercoffeeroaster.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
