import React from 'react';
import { CreditCardRecommendation } from '../types';
import { Trophy, Crown, CheckCircle2 } from 'lucide-react';

interface ComparisonTableProps {
  cards: CreditCardRecommendation[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  // Find the highest match score numeric value
  const maxScore = Math.max(...cards.map(c => c.matchScore));
  
  // Identify the FIRST card that has this score to avoid double highlighting if there's a tie
  const bestCardIndex = cards.findIndex(c => c.matchScore === maxScore);

  const highlightText = (text: string) => {
    // Keywords that indicate value to the user
    const keywords = [
      'lifetime free', 'unlimited', 'free', 'bonus', 'complementary', '0 joining', '5x', '10x', '12', '25,000', 'priority pass'
    ];
    const lowerText = text.toLowerCase();
    
    const containsKeyword = keywords.some(k => lowerText.includes(k));

    if (containsKeyword) {
      return <span className="text-green-400 font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">{text}</span>;
    }
    return <span className="text-gray-300">{text}</span>;
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl glass-panel border border-white/10 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent shadow-2xl pt-20">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-6 text-gray-400 font-medium w-1/5 bg-white/5 sticky left-0 backdrop-blur-xl z-10 border-r border-white/5">
                <span className="uppercase tracking-widest text-xs font-bold">Parameters</span>
            </th>
            {cards.map((card, idx) => (
              <th key={idx} className={`p-6 w-1/5 relative transition-all duration-300 ${idx === bestCardIndex ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-t-2 border-yellow-500' : ''}`}>
                {idx === bestCardIndex && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(234,179,8,0.5)] z-20 whitespace-nowrap">
                     <Crown className="w-3.5 h-3.5 fill-black" />
                     BEST MATCH
                  </div>
                )}
                <div className={`flex flex-col gap-2 mt-2 transition-transform duration-300 ${idx === bestCardIndex ? 'scale-105 origin-top' : ''}`}>
                    <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase">{card.bankName}</span>
                    <span className={`text-xl font-bold leading-tight ${idx === bestCardIndex ? 'text-yellow-400' : 'text-white'}`}>
                        {card.cardName}
                    </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {/* Annual Fee */}
          <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">Annual Fee</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 text-sm relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                 {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none"></div>}
                 {highlightText(card.annualFee)}
              </td>
            ))}
          </tr>
          
          {/* Match Score */}
          <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">AI Match Score</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                 {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none"></div>}
                 <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border ${
                     idx === bestCardIndex 
                     ? 'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                     : 'bg-white/5 border-white/10 text-gray-300'
                 }`}>
                    {idx === bestCardIndex && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {card.matchScore}%
                 </div>
              </td>
            ))}
          </tr>

          {/* Reward Rate */}
          <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">Reward Rate</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 text-sm leading-relaxed relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                 {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none"></div>}
                 {highlightText(card.rewardRate)}
              </td>
            ))}
          </tr>

          {/* Lounge Access */}
          <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">Lounge Access</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 text-sm leading-relaxed relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                 {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none"></div>}
                 {highlightText(card.loungeAccess)}
              </td>
            ))}
          </tr>

          {/* Welcome Bonus */}
          <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">Welcome Bonus</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 text-sm leading-relaxed relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                 {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none"></div>}
                 {highlightText(card.welcomeBonus)}
              </td>
            ))}
          </tr>
           
           {/* Credit Score Req */}
           <tr className="hover:bg-white/5 transition-colors group">
            <td className="p-6 font-medium text-gray-300 bg-slate-900/50 sticky left-0 backdrop-blur-xl border-r border-white/5 z-10">Min. Credit Score</td>
            {cards.map((card, idx) => (
              <td key={idx} className={`p-6 text-sm font-mono text-gray-300 relative ${idx === bestCardIndex ? 'bg-yellow-500/5' : ''}`}>
                  {idx === bestCardIndex && <div className="absolute inset-0 border-x border-yellow-500/10 pointer-events-none rounded-b-xl"></div>}
                  {card.minCreditScore}
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  );
};