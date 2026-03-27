import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (orderId.length > 3) {
        setStatus('found');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="bg-[#F5F2EB] min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-rooster-green)] mb-4">Track Your Order</h1>
          <p className="text-stone-600">Enter your order ID and email to see the status of your shipment.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Order ID</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. RR-12345"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[var(--color-rooster-green)] text-white font-bold py-4 rounded-lg hover:bg-[var(--color-rooster-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'loading' ? 'Searching...' : 'Track Order'}
              {!status.startsWith('load') && <Search className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {status === 'found' && (
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-[var(--color-rooster-green)] animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-stone-800">Order #{orderId}</h3>
                <p className="text-green-600 font-medium">Out for Delivery</p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-stone-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-[var(--color-rooster-green)] border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-sm text-stone-500 mb-1">Today, 8:30 AM</p>
                <p className="font-bold text-stone-800">Out for delivery</p>
                <p className="text-sm text-stone-600">Floyd, VA</p>
              </div>
              <div className="relative opacity-70">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-stone-300 border-4 border-white shadow-sm" />
                <p className="text-sm text-stone-500 mb-1">Yesterday, 4:20 PM</p>
                <p className="font-bold text-stone-800">Arrived at sorting facility</p>
                <p className="text-sm text-stone-600">Roanoke, VA</p>
              </div>
              <div className="relative opacity-50">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-stone-300 border-4 border-white shadow-sm" />
                <p className="text-sm text-stone-500 mb-1">2 days ago</p>
                <p className="font-bold text-stone-800">Order Placed</p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">
            Order not found. Please check your details and try again.
          </div>
        )}
      </div>
    </div>
  );
}
