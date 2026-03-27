import React from 'react';
import { Link } from 'react-router-dom';
import { TiltCard } from './TiltCard';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2"></span>
              <span className="text-sm text-indigo-200 font-medium tracking-wide">AI-POWERED FINANCE</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-white">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-gold-500">
                Smart Credit
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop guessing. Let our advanced AI agent analyze your financial DNA to find the perfect credit card that maximizes your rewards and fits your lifestyle perfectly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                to="/advisor"
                className="px-8 py-4 rounded-full bg-white text-indigo-950 font-bold text-lg hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2 group"
              >
                Find My Card
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/features"
                className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors text-white font-medium"
              >
                View Features
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 mt-8">
              <div className="flex flex-col items-center lg:items-start">
                <ShieldCheck className="w-6 h-6 text-indigo-400 mb-2" />
                <span className="text-sm text-gray-400">Bank-Grade Security</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Zap className="w-6 h-6 text-indigo-400 mb-2" />
                <span className="text-sm text-gray-400">Instant Analysis</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Globe className="w-6 h-6 text-indigo-400 mb-2" />
                <span className="text-sm text-gray-400">Global Coverage</span>
              </div>
            </div>
          </div>

          {/* 3D Visual */}
          <div className="relative flex justify-center items-center h-[500px]">
             {/* Decorative rings */}
            <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[350px] h-[350px] border border-dashed border-indigo-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

            <div className="relative z-20 animate-float">
              <TiltCard className="w-[340px] h-[220px]" glowColor="#6366f1">
                <div className="w-full h-full rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 shadow-2xl overflow-hidden relative">
                   {/* Card Noise Texture */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
                   
                   <div className="relative z-10 flex justify-between items-start">
                     <div className="w-12 h-8 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-md opacity-80" />
                     <span className="font-serif italic text-white/50 text-xl">NovaFin Elite</span>
                   </div>
                   
                   <div className="relative z-10">
                     <div className="flex gap-4 mb-2">
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-2/3"></div>
                       </div>
                     </div>
                     <div className="flex justify-between items-end">
                       <div className="space-y-1">
                         <div className="text-xs text-gray-400 tracking-widest">CARD HOLDER</div>
                         <div className="text-sm font-mono text-white tracking-widest">ALEXANDER K.</div>
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-white/20 relative">
                         <div className="absolute inset-0 rounded-full border border-white/20 translate-x-3 bg-red-500/20 mix-blend-screen"></div>
                       </div>
                     </div>
                   </div>
                </div>
              </TiltCard>
            </div>

            {/* Background floating card (smaller, blurred) */}
            <div className="absolute right-10 top-20 z-0 opacity-50 blur-[2px] animate-float" style={{ animationDelay: '1s' }}>
               <div className="w-[280px] h-[180px] rounded-2xl bg-slate-800 border border-white/5 transform rotate-12 p-6 flex flex-col justify-between">
                 <div className="w-full h-full bg-gradient-to-tr from-purple-900 to-black opacity-80 rounded-xl" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};