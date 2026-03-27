import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate submission
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-rooster-cream)] pt-12 pb-24">
      {/* Header */}
      <div className="bg-[var(--color-rooster-green)] text-white py-20 px-4 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-stone-200 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our coffees, need help with an order, or just want to say hello.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Pain Point 3: After-Hours Handling */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--color-rooster-green)] mb-8">Get in Touch</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-rooster-green)] shadow-sm shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                  <p className="text-stone-600">823 E. Main St, Floyd, VA 24091</p>
                  <p className="text-sm text-stone-500 mt-1">Located in downtown Floyd, near the Blue Ridge Parkway.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-rooster-green)] shadow-sm shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-stone-600">Cafe: +1 540-745-7338 (ext. 1)</p>
                  <p className="text-stone-600">Office/Wholesale: +1 540-745-7338 (ext. 2)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-rooster-green)] shadow-sm shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-stone-600">General: info@redroostercoffeeroaster.com</p>
                  <p className="text-stone-600">Orders: support@redroostercoffeeroaster.com</p>
                </div>
              </div>
            </div>

            {/* Pain Point 3: After-Hours Notice */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-[var(--color-rooster-green)] mb-4">
                <Clock className="w-5 h-5" />
                Response Times & Hours
              </h3>
              <div className="space-y-4 text-stone-600">
                <p>
                  Our team is available to answer your questions during our business hours:
                </p>
                <ul className="bg-stone-50 p-4 rounded-lg text-sm space-y-2">
                  <li className="flex justify-between"><span>Mon - Fri:</span> <span className="font-bold">7AM – 5PM</span></li>
                  <li className="flex justify-between"><span>Saturday:</span> <span className="font-bold">8AM – 3PM</span></li>
                  <li className="flex justify-between"><span>Sunday:</span> <span className="text-[var(--color-rooster-red)] font-bold">Closed</span></li>
                </ul>
                <div className="flex gap-3 items-start bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    <strong>After-Hours Inquiries:</strong> Leads for wholesale, custom roasts, or urgent order issues missed outside cafe hours will be addressed the next business day. Our online shop is always available, but personal queries may be delayed. For urgent wholesale matters, please leave a voicemail on extension 2.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
            <h3 className="font-serif text-2xl font-bold mb-6 text-[var(--color-rooster-green)]">Send a Message</h3>
            
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-stone-800 mb-2">Message Sent!</h4>
                <p className="text-stone-600">
                  Thank you for reaching out. We'll get back to you as soon as possible during our business hours.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-6 text-[var(--color-rooster-green)] font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1">Topic</label>
                  <select 
                    id="subject" 
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Wholesale Inquiry</option>
                    <option>Tours & Classes</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[var(--color-rooster-red)] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Sending...' : (
                    <>Send Message <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
