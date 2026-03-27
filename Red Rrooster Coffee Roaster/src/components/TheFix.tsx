import { motion } from 'motion/react';
import { ArrowRight, Disc } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TheFix() {
  const [selectedPlan, setSelectedPlan] = useState<'Monthly' | '1 Year' | '2 Year'>('2 Year');
  const navigate = useNavigate();

  const scrollToSubscription = () => {
    document.getElementById('get-your-fix')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    // Redirect to shop with the selected plan preference
    navigate('/shop', { state: { selectedPlan } });
  };

  return (
    <div className="bg-[#2D4F43] min-h-screen text-white overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop" 
            alt="Pouring Coffee" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[#2D4F43]/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-[15vw] md:text-[12rem] leading-none text-[#EDE8E1] mb-8"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, letterSpacing: '-0.05em' }}
          >
            The Fix
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-serif text-2xl md:text-4xl text-[#EDE8E1] max-w-4xl mx-auto leading-tight mb-12">
              ALL OUR COFFEES ARE EXQUISITE. <br/>
              <span className="italic">THESE ARE TRULY EXCEPTIONAL.</span>
            </p>
            
            <button 
              onClick={scrollToSubscription}
              className="px-10 py-5 bg-[#EDE8E1] text-[#2D4F43] font-bold text-lg rounded-full hover:bg-white transition-colors shadow-xl"
            >
              Subscribe to The Fix
            </button>
          </motion.div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-24 px-4 bg-[#2D4F43] text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-serif text-3xl md:text-5xl leading-tight text-[#EDE8E1]">
            Unique small-lot coffees from our globe-spanning network of artisan producers, roasted to perfection and delivered to you each month.
          </p>
        </div>
      </section>

      {/* Gear Section */}
      <section className="py-24 px-4 bg-[#2D4F43]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl text-[#EDE8E1] mb-16 text-center max-w-4xl mx-auto">
            We’ll fix you up with some free equipment too.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#3A5F52] rounded-3xl p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-serif text-2xl text-[#EDE8E1] mb-2">Fellow Stagg X Dripper</h3>
              <p className="font-mono text-[#EDE8E1]/80 text-lg">$60 Value</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#3A5F52] rounded-3xl p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-serif text-2xl text-[#EDE8E1] mb-2">Stagg EKG Pro Kettle</h3>
              <p className="font-mono text-[#EDE8E1]/80 text-lg">$195 Value</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#3A5F52] rounded-3xl p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-serif text-2xl text-[#EDE8E1] mb-2">Fellow Ode Grinder Gen 2</h3>
              <p className="font-mono text-[#EDE8E1]/80 text-lg">$345 Value</p>
            </div>
          </div>
          
          <p className="text-center mt-12 text-[#EDE8E1]/80 max-w-2xl mx-auto font-light">
            We’ll send you amazing brew gear like the Fellow Stagg EKG Pro kettle or a Fellow Ode GEN 2 grinder with your first annual subscription, for free! (up to a $365 value)
          </p>
        </div>
      </section>

      {/* Subscription Section (Get Your Fix) */}
      <section id="get-your-fix" className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Form */}
        <div className="lg:w-1/2 bg-[#EDE8E1] text-[#2D4F43] p-8 lg:p-24 flex flex-col justify-center">
          <h2 className="font-serif text-5xl md:text-6xl mb-8">GET YOUR FIX</h2>
          
          <p className="text-lg leading-relaxed mb-8 font-light">
            Welcome to a new kind of coffee experience! Each month offers a taste of the most rare and delicious coffees on the planet, specially curated for you by our team of coffee pros. Plus, if you choose an annual plan*, we’ll send you amazing brew gear like the Fellow Stagg EKG kettle or an Ode 2 Grinder brewer for free.
          </p>
          
          <div className="mb-12">
            <p className="font-mono text-sm mb-2">*First annual plan only</p>
          </div>

          <div className="mb-8">
            <p className="font-mono mb-6">Step 1. <span className="ml-8">Choose your payment frequency:</span></p>
            
            <div className="space-y-4">
              {/* Monthly Option */}
              <button 
                onClick={() => setSelectedPlan('Monthly')}
                className={`w-full flex items-center p-6 rounded-full border transition-all ${selectedPlan === 'Monthly' ? 'border-[#2D4F43] bg-white shadow-lg' : 'border-[#2D4F43]/20 hover:border-[#2D4F43]/50'}`}
              >
                <div className="w-16 h-16 rounded-full border border-[#2D4F43]/20 flex items-center justify-center mr-6">
                  <span className="font-serif text-2xl">♩</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold font-mono text-lg text-[#2D4F43]">Monthly</h4>
                  <p className="font-mono text-sm text-[#2D4F43]/70">Pay as you go. Cancel anytime.</p>
                </div>
              </button>

              {/* 1 Year Option */}
              <button 
                onClick={() => setSelectedPlan('1 Year')}
                className={`w-full flex items-center p-6 rounded-full border transition-all ${selectedPlan === '1 Year' ? 'border-[#2D4F43] bg-white shadow-lg' : 'border-[#2D4F43]/20 hover:border-[#2D4F43]/50'}`}
              >
                <div className="w-16 h-16 rounded-full border border-[#2D4F43]/20 flex items-center justify-center mr-6">
                  <span className="font-serif text-2xl">♪</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold font-mono text-lg text-[#2D4F43]">Prepay 1 Year</h4>
                  <p className="font-mono text-sm text-[#2D4F43]/70">Save 20% + Free Gifts ($195 value)</p>
                </div>
              </button>

              {/* 2 Year Option */}
              <button 
                onClick={() => setSelectedPlan('2 Year')}
                className={`w-full flex items-center p-6 rounded-full border transition-all ${selectedPlan === '2 Year' ? 'border-[#2D4F43] bg-white shadow-lg' : 'border-[#2D4F43]/20 hover:border-[#2D4F43]/50'}`}
              >
                <div className="w-16 h-16 rounded-full border border-[#2D4F43]/20 flex items-center justify-center mr-6">
                  <span className="font-serif text-2xl">♫</span>
                </div>
                <div className="text-left flex-grow">
                  <h4 className="font-bold font-mono text-lg text-[#2D4F43]">Prepay 2 Years</h4>
                  <p className="font-mono text-sm text-[#2D4F43]/70">Save 25% + Free Gifts ($365 value)</p>
                </div>
                <span className="bg-[#9D7B48] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Best Value!</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full bg-[#2D4F43] text-white font-bold font-mono text-lg py-4 rounded-full hover:bg-[#1A332B] transition-colors shadow-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Step 2: Choose Your Coffee <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side - Pattern */}
        <div className="lg:w-1/2 bg-[#2D4F43] relative overflow-hidden">
           {/* Pattern Overlay using CSS Grid of Icons */}
           <div className="absolute inset-0 opacity-20 grid grid-cols-6 gap-8 p-8 transform -rotate-12 scale-110">
             {Array.from({ length: 48 }).map((_, i) => (
               <div key={i} className="flex flex-col items-center gap-4">
                 <Disc className="w-12 h-12 text-[#EDE8E1]" />
                 <div className="w-16 h-12 border-2 border-[#EDE8E1] rounded-lg"></div>
               </div>
             ))}
           </div>
           
           {/* Gradient Overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F43] via-transparent to-transparent"></div>
        </div>
      </section>
    </div>
  );
}
