import React, { useState } from 'react';
import { UserProfile, CreditCardRecommendation } from '../types';
import { getRecommendations } from '../services/ai';
import { TiltCard } from './TiltCard';
import { ComparisonTable } from './ComparisonTable';
import { Check, PieChart, TrendingUp, ChevronRight, Wallet, User, Target, RotateCcw, ExternalLink, IndianRupee } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  annualIncome: 500000,
  creditScore: 750,
  monthlySpend: 25000,
  topCategories: [],
  primaryGoal: 'cashback'
};

const CATEGORIES = ['Dining', 'Travel', 'Groceries', 'Fuel', 'Shopping', 'Movies', 'Utilities'];

export const RecommendationEngine: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CreditCardRecommendation[]>([]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setProfile(prev => {
      const current = prev.topCategories;
      if (current.includes(cat)) {
        return { ...prev, topCategories: current.filter(c => c !== cat) };
      }
      if (current.length < 3) {
        return { ...prev, topCategories: [...current, cat] };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStep(3); // Loading State
    try {
      // Small delay to simulate processing + allow animations to play
      const [recs] = await Promise.all([
        getRecommendations(profile),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      setResults(recs);
      setStep(4); // Results State
    } catch (e) {
      console.error(e);
      setStep(1); 
    } finally {
      setLoading(false);
    }
  };

  // --- Step 1: 3D Form Design ---
  const renderStep1 = () => (
    <div className="animate-float">
        <div className="relative group">
            {/* 3D Layer Effects behind the form */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative glass-panel rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg z-10">
                    <User className="w-6 h-6 text-white" />
                </div>

                <div className="text-center mb-8 mt-4">
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">Identity & Score</h2>
                    <p className="text-indigo-200/60 text-sm mt-2 font-light">Calibrating financial DNA...</p>
                </div>

                <div className="space-y-6">
                    <div className="group/input relative">
                        <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                        <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                            <input 
                                type="text" 
                                value={profile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full bg-transparent px-5 py-4 text-white outline-none placeholder-gray-600"
                                placeholder="e.g. Rahul Sharma"
                            />
                            <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0 group-focus-within/input:w-full transition-all duration-500"></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group/input relative">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1.5 block ml-1">Annual Income</label>
                            <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                                <span className="absolute left-5 top-4 text-gray-500 font-serif italic">₹</span>
                                <input 
                                    type="number" 
                                    value={profile.annualIncome}
                                    onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value))}
                                    className="w-full bg-transparent pl-10 pr-5 py-4 text-white outline-none"
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0 group-focus-within/input:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                         <div className="group/input relative">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1.5 block ml-1">Monthly Spend</label>
                            <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                                <span className="absolute left-5 top-4 text-gray-500 font-serif italic">₹</span>
                                <input 
                                    type="number" 
                                    value={profile.monthlySpend}
                                    onChange={(e) => handleInputChange('monthlySpend', parseInt(e.target.value))}
                                    className="w-full bg-transparent pl-10 pr-5 py-4 text-white outline-none"
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0 group-focus-within/input:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="group/input relative">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1.5 block ml-1">Credit Score</label>
                            <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                                <TrendingUp className="absolute left-5 top-4 w-5 h-5 text-gray-500" />
                                <input 
                                    type="number" 
                                    value={profile.creditScore}
                                    max={900}
                                    onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value))}
                                    className="w-full bg-transparent pl-12 pr-5 py-4 text-white outline-none"
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0 group-focus-within/input:w-full transition-all duration-500"></div>
                            </div>
                    </div>

                    <button 
                        onClick={() => setStep(2)}
                        disabled={!profile.name}
                        className="w-full group/btn relative overflow-hidden rounded-xl bg-white py-4 mt-4 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-2 text-indigo-950 font-bold tracking-wide">
                            Continue Analysis <ChevronRight className="w-5 h-5" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  // --- Step 2: 3D Form Design ---
  const renderStep2 = () => (
    <div className="animate-float">
        <div className="relative group">
            {/* 3D Layer Effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative glass-panel rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg z-10">
                    <Target className="w-6 h-6 text-black" />
                </div>

                <div className="text-center mb-8 mt-4">
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">Spend & Goals</h2>
                    <p className="text-yellow-200/60 text-sm mt-2 font-light">Defining your lifestyle vector...</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Top Spending (Select 3)</label>
                             <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">{profile.topCategories.length}/3 selected</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border ${
                                profile.topCategories.includes(cat)
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
                                    : 'bg-slate-800/50 border-white/5 text-gray-400 hover:bg-slate-700 hover:border-white/20'
                                }`}
                            >
                                {cat}
                            </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 block">Primary Objective</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                            { id: 'cashback', label: 'Max Cashback', icon: '💰' },
                            { id: 'travel', label: 'Travel Rewards', icon: '✈️' },
                            { id: 'luxury', label: 'Luxury Perks', icon: '💎' },
                            { id: 'balance_transfer', label: 'Credit Builder', icon: '📈' }
                            ].map((goal) => (
                            <button
                                key={goal.id}
                                onClick={() => handleInputChange('primaryGoal', goal.id)}
                                className={`relative overflow-hidden p-4 rounded-xl border text-left transition-all duration-300 group ${
                                profile.primaryGoal === goal.id
                                    ? 'border-gold-500 bg-gold-500/10 text-white shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]'
                                    : 'border-white/10 bg-slate-800/30 text-gray-400 hover:border-white/20 hover:bg-slate-800/50'
                                }`}
                            >
                                <div className="relative z-10 flex flex-col gap-1">
                                    <span className="text-2xl mb-1 filter grayscale group-hover:grayscale-0 transition-all">{goal.icon}</span>
                                    <span className="font-semibold text-sm">{goal.label}</span>
                                </div>
                                {profile.primaryGoal === goal.id && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent pointer-events-none"></div>
                                )}
                            </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button 
                            onClick={() => setStep(1)}
                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-800/50 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold tracking-wide shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Generate Strategy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // Step 3: Loading (Futuristic)
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-fadeIn">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-4 border-purple-500 border-b-transparent rounded-full animate-spin-reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
             <Wallet className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">Processing...</h3>
        <div className="flex flex-col gap-2 text-indigo-200/60 font-mono text-sm">
             <span className="animate-pulse">Accessing RBI Database... [OK]</span>
             <span className="animate-pulse delay-75">Analyzing {profile.topCategories.join(', ')} vectors... [OK]</span>
             <span className="animate-pulse delay-150">Calculating Approval Odds... [OK]</span>
        </div>
      </div>
    </div>
  );

  // Step 4: Results
  const renderResults = () => (
    <div className="space-y-16 animate-fadeIn w-full max-w-7xl">
       <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 mb-4 backdrop-blur-md">
            <Check className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm text-green-200">Wallet Optimized</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-white mb-4 drop-shadow-xl">Your Curated Wallet</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Based on your monthly spend of <span className="text-white font-bold">₹{profile.monthlySpend.toLocaleString()}</span>, these 4 cards offer maximum value.
          </p>
       </div>

       {/* Cards Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
         {results.map((card, idx) => (
           <div key={idx} className="flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
             <TiltCard className="w-full aspect-[1.586] mb-6 group" glowColor={card.colorTheme}>
               <div 
                className="w-full h-full rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-2xl transition-transform duration-300"
                style={{ background: card.colorTheme || '#1e293b' }}
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/40 pointer-events-none"></div>
                  {/* Chip */}
                  <div className="relative z-10 flex justify-between items-start">
                     <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-90 backdrop-blur-sm shadow-md" />
                     <span className="font-mono text-[10px] uppercase text-white/80 tracking-widest">{card.bankName}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-serif font-bold text-white mb-1 shadow-black drop-shadow-md leading-tight">{card.cardName}</h3>
                    <div className="flex justify-between items-end">
                         <div className="text-[10px] text-white/70 font-mono tracking-widest">•••• 4289</div>
                         <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-red-500/80"></div>
                            <div className="w-4 h-4 rounded-full bg-yellow-500/80 -ml-2 mix-blend-screen"></div>
                         </div>
                    </div>
                  </div>
               </div>
             </TiltCard>
             
             <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col border-t border-t-indigo-500/50 hover:border-indigo-500 transition-all duration-300 hover:translate-y-[-5px]">
               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-1">
                   <div className="px-2.5 py-1 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-xs shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                     {card.matchScore}% Match
                   </div>
                 </div>
                 <span className="text-white font-bold text-xs bg-white/10 px-2 py-1 rounded">{card.annualFee}</span>
               </div>
               
               <p className="text-indigo-200 text-xs mb-6 italic leading-relaxed min-h-[40px] border-l-2 border-indigo-500/30 pl-3">
                 "{card.reasoning}"
               </p>
               
               <ul className="space-y-3 mb-6 flex-1">
                 {card.features.slice(0, 3).map((feat, i) => (
                   <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                     <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                     <span className="leading-tight">{feat}</span>
                   </li>
                 ))}
               </ul>
               
               <a 
                 href={card.applyLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full py-3 rounded-xl bg-white text-indigo-950 text-sm font-bold hover:bg-indigo-50 transition-colors text-center flex items-center justify-center gap-2 group shadow-lg"
               >
                 Apply Now
                 <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-indigo-600" />
               </a>
             </div>
           </div>
         ))}
       </div>

       {/* Comparison Section */}
       <div className="space-y-8 pt-10">
         <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-white mb-2">Detailed Comparison</h3>
            <p className="text-gray-400">Technical breakdown of your top options.</p>
         </div>
         <ComparisonTable cards={results} />
       </div>

       <div className="flex justify-center pt-8 pb-20">
         <button 
           onClick={() => { setStep(1); setResults([]); }}
           className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-3 font-medium tracking-wide"
         >
           <RotateCcw className="w-4 h-4" />
           Reset Analysis
         </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center bg-nova-dark relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {step < 4 ? (
          <div className="w-full max-w-lg relative z-10 my-10">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderLoading()}
          </div>
      ) : (
          renderResults()
      )}
    </div>
  );
};