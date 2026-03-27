import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Coffee, Truck, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQItem = ({ question, children }: { question: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[var(--color-rooster-green)] transition-colors"
      >
        <span className="font-serif text-lg font-bold text-[var(--color-rooster-dark)]">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-stone-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  return (
    <div className="bg-[#F5F2EB] min-h-screen pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--color-rooster-green)] mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-stone-600 text-center mb-16 max-w-2xl mx-auto">
          Everything you need to know about our coffee, shipping, and cafe.
        </p>

        <div className="space-y-12">
          
          {/* Flavor Profiles */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-6 h-6 text-[var(--color-rooster-gold)]" />
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rooster-dark)]">Flavor Profiles & Roasts</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-4">Roast Level Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="font-bold text-amber-800 mb-2">Light Roast</div>
                  <p className="text-xs text-stone-600">Bright, acidic, floral, fruity. Highlights origin characteristics.</p>
                </div>
                <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
                  <div className="font-bold text-amber-900 mb-2">Medium Roast</div>
                  <p className="text-xs text-stone-600">Balanced, sweet, nutty, chocolatey. The crowd pleaser.</p>
                </div>
                <div className="p-4 bg-stone-200 rounded-lg border border-stone-300">
                  <div className="font-bold text-stone-900 mb-2">Dark Roast</div>
                  <p className="text-xs text-stone-600">Bold, rich, smoky, full-bodied. Low acidity.</p>
                </div>
              </div>
            </div>
            <FAQItem question="What defines a 'flavor profile'?">
              Flavor profile refers to the dominant tastes and aromas in the coffee. We categorize ours generally into:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Fruity & Floral:</strong> Often light roasts, tasting of berries, citrus, or jasmine.</li>
                <li><strong>Sweet & Nutty:</strong> Often medium roasts, tasting of caramel, almonds, or brown sugar.</li>
                <li><strong>Chocolatey & Rich:</strong> Often medium-dark to dark roasts, tasting of cocoa, molasses, or spice.</li>
              </ul>
            </FAQItem>
          </section>

          {/* Brewing Guides */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Thermometer className="w-6 h-6 text-[var(--color-rooster-gold)]" />
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rooster-dark)]">Brewing Guides</h2>
            </div>
            <FAQItem question="General Brewing Ratios">
              A good starting point is a <strong>1:16 ratio</strong> (1 part coffee to 16 parts water).
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Pour Over:</strong> 25g coffee to 400g water.</li>
                <li><strong>French Press:</strong> 1:15 ratio (coarser grind).</li>
                <li><strong>Espresso:</strong> 1:2 ratio (18g in, 36g out).</li>
              </ul>
            </FAQItem>
            <FAQItem question="Water Temperature">
              We recommend water between <strong>195°F and 205°F</strong> (90°C - 96°C). If you don't have a thermometer, let boiling water sit for 30 seconds before pouring.
            </FAQItem>
          </section>

          {/* Cafe Info */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-[var(--color-rooster-gold)]" />
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rooster-dark)]">Cafe & Location</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Hours
                </h3>
                <ul className="text-sm space-y-1 text-stone-600">
                  <li className="flex justify-between"><span>Mon - Fri</span> <span>7AM – 5PM</span></li>
                  <li className="flex justify-between"><span>Saturday</span> <span>8AM – 3PM</span></li>
                  <li className="flex justify-between"><span className="text-red-600">Sunday</span> <span>Closed</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location & Parking
                </h3>
                <p className="text-sm text-stone-600 mb-2">
                  823 E. Main St, Floyd, VA 24091
                </p>
                <p className="text-xs text-stone-500">
                  We have a dedicated parking lot behind the building. Street parking is also available on Main St.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-[var(--color-rooster-gold)]" />
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rooster-dark)]">Shipping & Orders</h2>
            </div>
            <FAQItem question="How do I track my order?">
              You can track your order by visiting our <a href="/track-order" className="text-[var(--color-rooster-green)] underline font-bold">Order Tracking Page</a>. You'll need your order ID and email address.
            </FAQItem>
            <FAQItem question="When will my coffee ship?">
              We roast to order Monday through Friday. Most orders ship within 24 hours of roasting to ensure maximum freshness.
            </FAQItem>
          </section>

        </div>
      </div>
    </div>
  );
}
