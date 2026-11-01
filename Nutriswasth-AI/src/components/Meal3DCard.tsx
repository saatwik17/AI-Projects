import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, RefreshCw, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { ScheduledMeal } from '../types';
import { getFoodImage } from '../utils/foodImageMapper';

interface Meal3DCardProps {
  meal: ScheduledMeal;
  onSwapMeal: (meal: ScheduledMeal) => void;
  onToggleTaken?: (meal: ScheduledMeal) => void;
  index: number;
}

export const Meal3DCard: React.FC<Meal3DCardProps> = ({ meal, onSwapMeal, onToggleTaken, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -8 : [0, -4, 0],
        }}
        transition={{
          opacity: { duration: 0.4, delay: index * 0.1 },
          y: isHovered
            ? { type: 'spring', stiffness: 350, damping: 22 }
            : { repeat: Infinity, duration: 3.5 + index * 0.5, ease: 'easeInOut' },
          rotateX: { type: 'spring', stiffness: 350, damping: 22 },
          rotateY: { type: 'spring', stiffness: 350, damping: 22 },
          scale: { type: 'spring', stiffness: 350, damping: 22 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 rounded-3xl p-5 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-emerald-300 transition-shadow duration-300 flex flex-col justify-between space-y-4 overflow-hidden group cursor-pointer"
      >
        {/* Dynamic 3D Glare Light Reflection Effect */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-70 transition-opacity duration-300 z-20"
            style={{
              background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.18), transparent 50%)`,
            }}
          />
        )}

        {/* Floating background accent ball */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-300/30 transition-all duration-500" />

        <div className="space-y-3 relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {/* Food Item Background Image Header */}
          <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:shadow-md transition-all">
            <img
              src={meal.dish.imageUrl || getFoodImage(meal.dish.name)}
              alt={meal.dish.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: 'center' }}
            />
            {/* Dark Gradient Overlay to ensure maximum contrast and text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

            {/* Header Badges over Image */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5" style={{ transform: 'translateZ(15px)' }}>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-emerald-700/90 text-white shadow-xs backdrop-blur-md border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  {meal.mealType}
                </span>
                {meal.isTaken && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow-xs border border-emerald-400/40">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    Taken
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/20 shadow-2xs">
                <Clock className="w-3 h-3 text-emerald-400" />
                {meal.dish.prepTimeMinutes}m
                <span className="text-white/40">•</span>
                <span className="text-amber-300">₹{Math.round(meal.dish.estimatedCostINR * meal.portionMultiplier)}</span>
              </div>
            </div>

            {/* Dish Name overlayed on the image bottom */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5" style={{ transform: 'translateZ(25px)' }}>
              <h3 className="text-base font-extrabold text-white font-display leading-tight drop-shadow-md">
                {meal.dish.name}
              </h3>
              {meal.dish.hindiName && (
                <p className="text-[11px] text-emerald-300 font-semibold mt-0.5 tracking-wide drop-shadow-xs">
                  {meal.dish.hindiName}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">Portion: {meal.dish.servingUnit}</p>

          {/* Macro Pills with 3D Depth */}
          <div className="flex flex-wrap gap-2 text-[11px] font-mono" style={{ transform: 'translateZ(20px)' }}>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-semibold shadow-xs">
              {Math.round(meal.dish.calories * meal.portionMultiplier)} kcal
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-950 font-bold border border-teal-200/80">
              P: {Math.round(meal.dish.proteinG * meal.portionMultiplier)}g
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-950 font-bold border border-amber-200/80">
              C: {Math.round(meal.dish.carbsG * meal.portionMultiplier)}g
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-950 font-bold border border-indigo-200/80">
              F: {Math.round(meal.dish.fatG * meal.portionMultiplier)}g
            </span>
          </div>

          {/* Context Note / Health Highlight */}
          <div
            className="p-3 rounded-2xl bg-white/90 backdrop-blur-xs text-xs text-slate-700 leading-relaxed border border-slate-200/80 shadow-2xs group-hover:border-emerald-300 transition-colors"
            style={{ transform: 'translateZ(15px)' }}
          >
            <span className="font-bold text-emerald-800">Why recommended: </span>
            {meal.contextNote}
          </div>

          {/* Ingredients Badges */}
          <div className="flex flex-wrap gap-1.5" style={{ transform: 'translateZ(10px)' }}>
            {meal.dish.ingredients.slice(0, 4).map((ing, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/60">
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Action: Mark as Taken / Not Taken Button & Swap Dish */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10" style={{ transform: 'translateZ(25px)' }}>
          {/* Taken / Not Taken Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleTaken) {
                onToggleTaken(meal);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
              meal.isTaken
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300/90 hover:border-slate-400'
            }`}
            title={meal.isTaken ? 'Click to mark as Not Taken' : 'Click to mark as Taken'}
          >
            {meal.isTaken ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Taken</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Not Taken</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60">
              {meal.dish.specialTags?.includes('exam-fuel') ? '⚡ Focus Sustaining' : '🌿 Authentic'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwapMeal(meal);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-emerald-600/30 transition-all duration-300 flex items-center gap-1.5 group/btn cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-500" /> Swap Dish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
