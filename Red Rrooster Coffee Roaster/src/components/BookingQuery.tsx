import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Mail, Phone, User, MessageSquare } from 'lucide-react';

export default function BookingQuery() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'tour') {
      setBookingType('Roastery Tour & Cupping');
    } else if (type === 'class') {
      setBookingType('Home Brewing Masterclass');
    } else {
      setBookingType('General Inquiry');
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    navigate('/learn/confirmation');
  };

  return (
    <div className="bg-[var(--color-rooster-cream)] min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/learn')}
          className="flex items-center gap-2 text-stone-600 hover:text-[var(--color-rooster-red)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-[var(--color-rooster-gold)] font-bold tracking-widest text-xs uppercase mb-3 block">Booking Request</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{bookingType}</h1>
            <p className="text-stone-600">Please fill out the form below to request a booking. Our team will review your request and contact you to confirm availability.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Full Name
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Email Address
                </label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Number of Guests
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Preferred Date
              </label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-rooster-gold)]" /> Special Requests or Questions
              </label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[var(--color-rooster-green)] focus:ring-1 focus:ring-[var(--color-rooster-green)] outline-none transition-all bg-stone-50"
                placeholder="Any dietary restrictions, accessibility needs, or specific questions?"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-[var(--color-rooster-green)] text-white font-bold py-4 rounded-xl hover:bg-[#1e3a30] transition-colors shadow-lg mt-4"
            >
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
