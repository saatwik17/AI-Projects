import React from 'react';
import { TiltCard } from './TiltCard';
import { Cpu, Shield, Zap, Database, BarChart3, Lock, Hexagon, Circle, Triangle } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-indigo-400" />,
      title: "Neural Engine",
      description: "Our proprietary AI models process thousands of financial data points to find hidden correlations in your spending habits."
    },
    {
      icon: <Database className="w-8 h-8 text-purple-400" />,
      title: "Real-Time RBI Data",
      description: "Directly connected to the latest RBI regulations and bank offers, ensuring you never see an expired deal."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption for all your financial data. We analyze locally where possible and never store sensitive PII."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-pink-400" />,
      title: "Smart Comparison",
      description: "Automatically generates side-by-side matrices comparing APR, lounge access, and reward points."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Instant Approval Odds",
      description: "Pre-qualified probability scores help you apply with confidence and avoid hard inquiries."
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-400" />,
      title: "Privacy First",
      description: "Your data belongs to you. Delete your profile at any time with a single click."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden bg-nova-dark">
      
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] opacity-20 animate-float" style={{ animationDuration: '8s' }}>
             <Hexagon className="w-32 h-32 text-indigo-500" strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-40 right-[5%] opacity-10 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>
             <Circle className="w-48 h-48 text-purple-500" strokeWidth={0.5} />
          </div>
          <div className="absolute top-1/3 right-[20%] opacity-10 animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}>
             <Triangle className="w-24 h-24 text-yellow-500" strokeWidth={0.5} />
          </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-serif font-bold text-white">Advanced Features</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for the modern financial landscape using cutting-edge Generative AI.
          </p>
        </div>

        {/* 3D Showcase */}
        <div className="flex justify-center py-10 perspective-1000">
           <div className="transform-gpu hover:scale-105 transition-transform duration-500">
             <TiltCard className="w-full max-w-4xl h-[400px] group" glowColor="#8b5cf6">
                <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900 border border-white/10 flex items-center justify-center">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-purple-900/50"></div>
                   
                   {/* Animated Grid Lines */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

                   <div className="relative z-10 grid grid-cols-3 gap-8 p-8 w-full">
                      <div className="text-center space-y-2 group-hover:-translate-y-2 transition-transform duration-300">
                         <div className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">50+</div>
                         <div className="text-sm text-indigo-300 font-medium">Banks Integrated</div>
                      </div>
                      <div className="text-center space-y-2 border-x border-white/10 group-hover:-translate-y-2 transition-transform duration-300 delay-100">
                         <div className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">98%</div>
                         <div className="text-sm text-indigo-300 font-medium">Match Accuracy</div>
                      </div>
                      <div className="text-center space-y-2 group-hover:-translate-y-2 transition-transform duration-300 delay-200">
                         <div className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">24/7</div>
                         <div className="text-sm text-indigo-300 font-medium">AI Availability</div>
                      </div>
                   </div>
                </div>
             </TiltCard>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="relative group perspective-1000">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
               <div className="glass-panel p-8 rounded-2xl h-full relative transition-all duration-300 hover:translate-y-[-5px] hover:border-white/20 transform-gpu">
                  <div className="mb-6 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                    {feature.description}
                  </p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};