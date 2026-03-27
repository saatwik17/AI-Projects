import { MapPin, Clock, Phone, Calendar, ArrowRight, Info } from 'lucide-react';

export default function Visit() {
  return (
    <div className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-[var(--color-rooster-dark)] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Visit The Roastery</h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Located in the heart of downtown Floyd, VA. A community gathering place for coffee lovers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Map / Image */}
            <div className="h-[400px] lg:h-auto bg-stone-200 relative">
              <img 
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000" 
                alt="Cafe Exterior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <a 
                  href="https://maps.google.com/?q=823+E.+Main+St,+Floyd,+VA+24091" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-sm hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-[var(--color-rooster-red)]" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Info */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-bold mb-4 text-[var(--color-rooster-dark)]">
                    <Clock className="w-6 h-6 text-[var(--color-rooster-red)]" />
                    Hours of Operation
                  </h3>
                  <ul className="space-y-3 text-stone-600 ml-9">
                    <li className="flex justify-between border-b border-stone-100 pb-2">
                      <span className="font-medium">Monday - Friday</span>
                      <span>7:00 AM – 5:00 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 pb-2">
                      <span className="font-medium">Saturday</span>
                      <span>8:00 AM – 3:00 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 pb-2">
                      <span className="font-medium">Sunday</span>
                      <span className="text-[var(--color-rooster-red)] font-bold">Closed</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-bold mb-4 text-[var(--color-rooster-dark)]">
                    <MapPin className="w-6 h-6 text-[var(--color-rooster-red)]" />
                    Location
                  </h3>
                  <address className="not-italic text-stone-600 ml-9 leading-relaxed">
                    823 E. Main St<br/>
                    Floyd, VA 24091<br/>
                    <span className="text-sm text-stone-500 mt-2 block">
                      (Near Floyd County Store and Blue Ridge Parkway)
                    </span>
                  </address>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-bold mb-4 text-[var(--color-rooster-dark)]">
                    <Phone className="w-6 h-6 text-[var(--color-rooster-red)]" />
                    Contact
                  </h3>
                  <div className="ml-9 space-y-2">
                    <p className="text-stone-600">
                      <span className="font-medium text-[var(--color-rooster-dark)]">Cafe:</span> +1 540-745-7338 (ext. 1)
                    </p>
                    <p className="text-stone-600">
                      <span className="font-medium text-[var(--color-rooster-dark)]">Office:</span> +1 540-745-7338 (ext. 2)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ / Common Questions - Pain Point 2: High-Frequency Queries */}
      <div className="max-w-4xl mx-auto px-4 mt-24">
        <h2 className="font-serif text-3xl font-bold text-center mb-4 text-[var(--color-rooster-green)]">Plan Your Visit</h2>
        <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">Everything you need to know before you arrive at our Floyd roastery and cafe.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Where can I park?", a: "We have a dedicated parking lot directly adjacent to our building. Additional free street parking is available along E. Main St and in the municipal lot one block west." },
            { q: "What are your hours?", a: "We are open Monday-Friday 7AM–5PM, Saturday 8AM–3PM, and closed on Sundays." },
            { q: "Do you offer food?", a: "Yes! We offer a selection of locally made pastries, bagels, and light breakfast items daily. We also have gluten-free options available." },
            { q: "Can I order ahead?", a: "Absolutely. Use our online ordering system for curbside pickup. Call us upon arrival and we'll run it out to you." },
            { q: "How do I check my online order status?", a: "You can check the status of your order by logging into your account on our website. You'll also receive email notifications when your order ships." },
            { q: "What is your sourcing ethics?", a: "We are committed to transparent, ethical sourcing. We use Organic and Fair Trade certified coffees for our blends, and Direct Trade relationships for many of our single-origin offerings, ensuring farmers are paid above fair trade minimums." },
            { q: "What do the roast levels mean?", a: "Our Light roasts highlight the bean's natural acidity and fruit notes. Medium roasts balance acidity with body and sweetness (chocolate/caramel). Dark roasts feature bold, smoky, and rich flavors with lower acidity." },
            { q: "Are you dog friendly?", a: "We love dogs! Well-behaved pets are welcome on our outdoor patio. Service animals are permitted inside the cafe." },
            { q: "Do you have Wi-Fi?", a: "Yes, we offer free high-speed Wi-Fi (Network: RedRoosterGuest) and plenty of outlets, making it a great spot to work." },
            { q: "Is the roastery open to the public?", a: "The cafe is open daily (except Sunday). The production floor is only accessible via our guided tours (Saturdays at 10 AM)." },
            { q: "Do you sell beans at the cafe?", a: "Yes, we have our full lineup of fresh roasts available for purchase, including some cafe-exclusive limited releases." },
            { q: "Is there accessible seating?", a: "Yes, our cafe and restrooms are fully ADA compliant with ramp access from the parking lot." },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:border-[var(--color-rooster-green)]/30 transition-colors">
              <h4 className="font-bold text-lg mb-2 flex items-start gap-3 text-[var(--color-rooster-dark)]">
                <Info className="w-5 h-5 text-[var(--color-rooster-gold)] mt-1 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-stone-600 ml-8 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
