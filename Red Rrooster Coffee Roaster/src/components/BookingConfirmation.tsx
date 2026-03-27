import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Calendar } from 'lucide-react';

export default function BookingConfirmation() {
  return (
    <div className="bg-[var(--color-rooster-cream)] min-h-screen flex items-center justify-center px-4 py-24">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 md:p-16 max-w-lg w-full text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-rooster-gold)]"></div>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-[var(--color-rooster-dark)]">Request Received!</h1>
        
        <p className="text-stone-600 text-lg mb-8 leading-relaxed">
          Thank you for your interest in learning with us. We have received your booking request and will be in touch shortly to confirm availability and finalize details.
        </p>
        
        <div className="bg-stone-50 rounded-xl p-6 mb-8 border border-stone-100">
          <h3 className="font-bold text-[var(--color-rooster-dark)] mb-2 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-rooster-gold)]" /> What happens next?
          </h3>
          <p className="text-sm text-stone-500">
            Our team reviews requests within 24 hours. You will receive an email confirmation with payment instructions once your spot is secured.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-[var(--color-rooster-dark)] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Return Home
          </Link>
          <Link 
            to="/learn" 
            className="block w-full text-stone-600 font-medium hover:text-[var(--color-rooster-red)] transition-colors flex items-center justify-center gap-2"
          >
            Browse More Classes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
