import React from 'react';
import { TiltCard } from './TiltCard';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-3xl p-12 border border-white/10 relative overflow-hidden">
           {/* Background decoration */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

           <div className="relative z-10 space-y-12">
             <div className="text-center space-y-6">
               <h1 className="text-5xl font-serif font-bold text-white">Our Mission</h1>
               <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
               <p className="text-xl text-gray-300 leading-relaxed">
                 NovaFin was born out of a simple frustration: financial products are complex, but choosing them shouldn't be. 
                 Created for the <span className="text-white font-bold">TCS Hackathon</span>, we aim to bridge the gap between complex banking terms and human needs.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <h2 className="text-2xl font-bold text-white">The Problem</h2>
                   <p className="text-gray-400">
                     With over 100+ credit cards in the Indian market, customers often end up with cards that don't match their spending, missing out on lakhs in potential rewards.
                   </p>
                   
                   <h2 className="text-2xl font-bold text-white">The Solution</h2>
                   <p className="text-gray-400">
                     An intelligent Agent that doesn't just filter database rows, but "thinks" like a financial advisor, weighing pros and cons tailored specifically to your financial DNA.
                   </p>
                </div>
                
                <div className="flex justify-center">
                   <TiltCard className="w-64 h-80" glowColor="#eab308">
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/20 p-6 flex flex-col items-center justify-center text-center space-y-4">
                         <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                            <span className="text-4xl">💡</span>
                         </div>
                         <h3 className="text-xl font-bold text-white">Innovation First</h3>
                         <p className="text-sm text-gray-500">Combining React, 3D CSS, and Gemini AI.</p>
                      </div>
                   </TiltCard>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};