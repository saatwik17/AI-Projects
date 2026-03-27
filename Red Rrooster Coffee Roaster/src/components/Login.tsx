import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login or signup
    await login(email, password);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-rooster-cream)] flex items-center justify-center px-4 py-24">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-stone-100">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-500 hover:text-[var(--color-rooster-green)] mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-rooster-green)] rounded-full flex items-center justify-center text-white font-serif font-bold text-3xl mx-auto mb-4 border-4 border-[var(--color-rooster-gold)]">
            R
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--color-rooster-green)]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 mt-2">
            {isLogin ? 'Sign in to manage your subscription and orders.' : 'Join us for exclusive rewards and faster checkout.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[var(--color-rooster-red)] text-white font-bold py-4 rounded-full hover:bg-red-800 transition-colors shadow-lg disabled:opacity-70"
          >
            {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-500">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--color-rooster-green)] font-bold hover:underline"
            >
              {isLogin ? 'Create one' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
