import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Utensils, Zap, Clock, IndianRupee, 
  Flame, CheckCircle2, RefreshCw, ChevronRight, ShieldAlert, Heart
} from 'lucide-react';
import { UserProfile, RoutineContext, FoodItem, ScheduledMeal, DayPlan } from '../types';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { getFoodImage } from '../utils/foodImageMapper';

interface RealTimeFoodSuggestionsProps {
  userProfile: UserProfile;
  routineContext: RoutineContext;
  currentPlan?: DayPlan;
  onSwapMealDish?: (mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner', newDish: FoodItem) => void;
  onAskAI?: (query: string) => void;
}

// 3D Interactive Card Component
const Food3DCard: React.FC<{
  food: FoodItem;
  badge: { text: string; bg: string };
  onSwapClick: (food: FoodItem) => void;
  canSwap: boolean;
}> = ({ food, badge, onSwapClick, canSwap }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Max 12 deg tilt
    const rotateX = (mouseY / (rect.height / 2)) * -10;
    const rotateY = (mouseX / (rect.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? '12px' : '0px'})`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
        }}
        className={`h-full relative rounded-3xl bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#f5f0e6] p-5 border border-[#e8e2d5] shadow-md transition-all flex flex-col justify-between space-y-3 overflow-hidden ${
          isHovered ? 'shadow-2xl border-[#1b4317]/40 ring-2 ring-[#1b4317]/10' : ''
        }`}
      >
        {/* Dynamic Glowing Accent Light on Hover */}
        <div
          className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#1b4317]/10 blur-2xl pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-100'
          }`}
        />

        <div className="relative z-10 space-y-2.5">
          {/* Food Image Banner Header */}
          <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:shadow-md transition-all">
            <img
              src={food.imageUrl || getFoodImage(food.name)}
              alt={food.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: 'center' }}
            />
            {/* Gradient Overlay for high contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xs ${badge.bg}`}>
                {badge.text}
              </span>
              <span className="text-xs font-extrabold text-amber-300 font-mono px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20">
                ₹{food.estimatedCostINR}
              </span>
            </div>

            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <span className="text-[9px] font-extrabold tracking-wide uppercase text-amber-200 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block mb-0.5 border border-amber-400/30">
                Replaces {food.category === 'breakfast' ? 'Breakfast' : food.category === 'dinner' ? 'Dinner' : food.category === 'snack' ? 'Evening Snack' : 'Lunch'}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white font-serif-heading tracking-tight leading-snug drop-shadow-md">
                {food.name}
              </h3>
            </div>
          </div>

          {/* Macros Chips */}
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
            <span className="px-2.5 py-1 rounded-xl bg-white text-[#1c221a] border border-[#e8e2d5] font-bold shadow-xs">
              🔥 {food.calories} kcal
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#ffdad3] text-[#9f402d] font-bold shadow-xs">
              💪 P: {food.proteinG}g
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#fff4d9] text-[#7a5700] font-bold shadow-xs">
              🌾 C: {food.carbsG}g
            </span>
          </div>

          {/* Benefits Text */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {food.benefits}
          </p>
        </div>

        {/* Action Buttons & Prep Time */}
        <div className="relative z-10 pt-3 border-t border-[#e8e2d5] flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#1b4317]" /> {food.prepTimeMinutes} mins prep
          </span>

          {canSwap && (
            <button
              onClick={() => onSwapClick(food)}
              className="px-3 py-1.5 rounded-xl bg-[#1b4317] hover:bg-[#23501e] text-white text-[11px] font-bold transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1"
              title={`Click to instantly replace your current ${
                food.category === 'breakfast' ? 'Breakfast' : food.category === 'dinner' ? 'Dinner' : food.category === 'snack' ? 'Snack' : 'Lunch'
              } with ${food.name}`}
            >
              <RefreshCw className="w-3 h-3 text-amber-300" />
              <span>Swap into Thali</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const RealTimeFoodSuggestions: React.FC<RealTimeFoodSuggestionsProps> = ({
  userProfile,
  routineContext,
  currentPlan,
  onSwapMealDish,
  onAskAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [swappedFeedback, setSwappedFeedback] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [categoryOffsets, setCategoryOffsets] = useState<Record<string, number>>({});

  // Trigger scanning simulation when profile or routineContext changes
  useEffect(() => {
    setIsScanning(true);
    setVisibleCount(12);
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [userProfile, routineContext, activeCategory]);

  // Handle refreshing/changing dishes for the active section (swaps the entire visible card feed)
  const handleRefreshSectionDishes = () => {
    setIsScanning(true);
    // Shift offset by 3 to 6 items so the entire visible card grid updates with new dishes
    const shiftStep = 3;
    setCategoryOffsets((prev) => ({
      ...prev,
      [activeCategory]: (prev[activeCategory] || 0) + shiftStep,
    }));
    setTimeout(() => {
      setIsScanning(false);
    }, 350);
  };

  // Compute live match score & recommendations from database (English only)
  const matchedFoods = useMemo(() => {
    let pool = INDIAN_FOOD_DATABASE.filter((food) => {
      // Dietary check based on User Profile preference
      if (userProfile.dietType === 'vegetarian') {
        const isVeg = food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
        if (!isVeg) return false;
      } else if (userProfile.dietType === 'jain') {
        if (!food.dietaryType.includes('jain')) return false;
      } else if (userProfile.dietType === 'vegan') {
        if (!food.dietaryType.includes('vegan')) return false;
      } else if (userProfile.dietType === 'eggetarian') {
        const isEggetarian = food.dietaryType.includes('eggetarian') || food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
        if (!isEggetarian) return false;
      } else if (userProfile.dietType === 'halal') {
        if (!food.dietaryType.includes('halal')) return false;
      } else if (userProfile.dietType === 'non_vegetarian') {
        // Allows all foods (veg + non-veg)
      }

      // Budget check
      if (userProfile.budget === 'budget' && food.estimatedCostINR > 80) return false;

      // Search filter (English terms only)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = food.name.toLowerCase().includes(q);
        const matchIng = food.ingredients.some((i) => i.toLowerCase().includes(q));
        const matchTags = food.specialTags.some((t) => t.toLowerCase().includes(q));
        return matchName || matchIng || matchTags;
      }

      return true;
    });

    // Score items based on context & health profile
    const scored = pool.map((food) => {
      let score = 10;

      // Diet Type Preference scoring boosts
      if (userProfile.dietType === 'non_vegetarian' && food.dietaryType.includes('non_vegetarian')) {
        score += 25; // Prioritize chicken/fish for non-vegetarian users
      }
      if (userProfile.dietType === 'eggetarian' && food.dietaryType.includes('eggetarian')) {
        score += 25; // Prioritize egg options for eggetarian users
      }

      // Routine Context weighting
      if (routineContext === 'exam_deadline') {
        if (food.specialTags.includes('exam-fuel') || food.specialTags.includes('quick-digest')) score += 20;
        if (food.glycemicIndex === 'low') score += 15;
      } else if (routineContext === 'high_stress') {
        if (food.specialTags.includes('high-stress') || food.specialTags.includes('gut-friendly')) score += 20;
        if (food.specialTags.includes('probiotic-curd')) score += 15;
      } else if (routineContext === 'travel') {
        if (food.specialTags.includes('travel-ready') || food.specialTags.includes('quick-digest')) score += 20;
      }

      // Lifestyle Risk boosts
      if (userProfile.smokingStatus !== 'non_smoker' && (food.vitC_mg >= 20 || food.specialTags.includes('antioxidant-boost'))) {
        score += 15;
      }
      if (userProfile.alcoholUsage !== 'none' && food.specialTags.includes('liver-support')) {
        score += 15;
      }

      // Health Goal boosts
      if (userProfile.healthGoal === 'muscle_gain' && food.proteinG >= 12) score += 12;
      if (userProfile.healthGoal === 'blood_sugar_control' && food.glycemicIndex === 'low') score += 12;

      // Regional match boost
      if (food.region.includes(userProfile.region) || food.region.includes('pan_india')) score += 10;

      return { food, score };
    });

    scored.sort((a, b) => b.score - a.score);

    let filteredList = scored.map(({ food }) => food);

    // Filter by active category tab if selected
    if (activeCategory !== 'all') {
      filteredList = scored
        .filter(({ food }) => {
          if (activeCategory === 'high_protein') return food.proteinG >= 10;
          if (activeCategory === 'low_gi') return food.glycemicIndex === 'low';
          return food.category === activeCategory;
        })
        .map(({ food }) => food);
    }

    // Apply category rotation offset if user requested new reference dish
    const offset = categoryOffsets[activeCategory] || 0;
    if (filteredList.length > 0 && offset > 0) {
      const rotateIndex = offset % filteredList.length;
      return [...filteredList.slice(rotateIndex), ...filteredList.slice(0, rotateIndex)];
    }

    return filteredList;
  }, [userProfile, routineContext, searchQuery, activeCategory, categoryOffsets]);

  const handleSwapClick = (food: FoodItem) => {
    // Map category to meal type
    let mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner' = 'Lunch';
    if (food.category === 'breakfast') mealType = 'Breakfast';
    else if (food.category === 'snack' || food.category === 'beverage') mealType = 'Evening Snack';
    else if (food.category === 'dinner') mealType = 'Dinner';

    if (onSwapMealDish) {
      onSwapMealDish(mealType, food);
      setSwappedFeedback(`Successfully swapped ${food.name} into ${mealType}!`);
      setTimeout(() => setSwappedFeedback(null), 3000);
    }
  };

  const getContextBadge = (food: FoodItem) => {
    if (routineContext === 'exam_deadline' && (food.specialTags.includes('exam-fuel') || food.glycemicIndex === 'low')) {
      return { text: '⚡ Focus Sustaining', bg: 'bg-amber-500/15 text-amber-800 border-amber-300' };
    }
    if (routineContext === 'high_stress' && food.specialTags.includes('high-stress')) {
      return { text: '😫 Gut Soothing', bg: 'bg-emerald-500/15 text-emerald-800 border-emerald-300' };
    }
    if (routineContext === 'travel' && food.specialTags.includes('travel-ready')) {
      return { text: '✈️ Travel Ready', bg: 'bg-cyan-500/15 text-cyan-800 border-cyan-300' };
    }
    if (food.proteinG >= 12) {
      return { text: '💪 High Protein', bg: 'bg-[#ffdad3] text-[#9f402d] border-[#f5b8ac]' };
    }
    return { text: '🌿 Regional Match', bg: 'bg-[#e2ebe0] text-[#1b4317] border-[#c9d8c5]' };
  };

  return (
    <div className="card-tactile p-6 space-y-6">
      {/* Top Header & Real-time Scan Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e5dc]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1b4317]"></span>
            </span>
            <h2 className="text-base font-bold text-[#1c221a] font-serif-heading">
              Real-Time Food Suggestions
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Dynamically queried from online ICMR & Indian food database based on your health profile & routine.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e2ebe0] text-[#1b4317] border border-[#c9d8c5] text-xs font-semibold shrink-0">
          {isScanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning database...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#1b4317]" /> {matchedFoods.length} Matches Found
            </>
          )}
        </div>
      </div>

      {/* Swapped Feedback Alert */}
      <AnimatePresence>
        {swappedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#e2ebe0] border border-[#c9d8c5] text-[#1b4317] text-xs font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1b4317]" />
              <span>{swappedFeedback}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar & Category Filter Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, ingredients (e.g., Poha, Paneer, Oats, Curd, Sprouts)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fbf9f4] border border-[#e8e5dc] text-xs sm:text-sm focus:ring-2 focus:ring-[#1b4317]/20 focus:border-[#1b4317] transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: '🌙 Dinner' },
            { id: 'snack', label: 'Snacks' },
            { id: 'beverage', label: 'Beverages' },
            { id: 'high_protein', label: '💪 High Protein' },
            { id: 'low_gi', label: '⚡ Low GI Focus' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setVisibleCount(12);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4317] text-white shadow-xs'
                    : 'bg-[#fbf9f4] hover:bg-[#f5f3ee] text-slate-700 border border-[#e8e5dc]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Reference Banner & Change Dish Button */}
      {matchedFoods.length > 0 && (
        <motion.div
          key={activeCategory + (categoryOffsets[activeCategory] || 0)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#1b4317]/10 via-[#e2ebe0]/50 to-[#fdfbf7] border border-[#c9d8c5] shadow-xs"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4317] bg-[#e2ebe0] px-2 py-0.5 rounded-md border border-[#c9d8c5]">
                {activeCategory === 'all'
                  ? 'All Matches'
                  : activeCategory === 'dinner'
                  ? '🌙 Dinner'
                  : activeCategory === 'high_protein'
                  ? '💪 High Protein'
                  : activeCategory === 'low_gi'
                  ? '⚡ Low GI Focus'
                  : activeCategory.toUpperCase()}{' '}
                Section
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ({matchedFoods.length} items available)
              </span>
            </div>
            <p className="text-xs text-slate-700">
              Featured Reference Dish:{' '}
              <strong className="text-[#1b4317] font-serif-heading text-sm">
                {matchedFoods[0]?.name}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRefreshSectionDishes}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-[#f5f0e6] text-[#1b4317] border border-[#1b4317]/30 text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              title="Click to refresh and replace all cards in this section with new dishes"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#1b4317] ${isScanning ? 'animate-spin' : ''}`} />
              <span>Change All Dishes in Section</span>
            </button>

            {onSwapMealDish && matchedFoods[0] && (
              <button
                onClick={() => handleSwapClick(matchedFoods[0])}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#1b4317] hover:bg-[#23501e] text-white text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                title="Swap this featured reference dish directly into your active thali plan"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Swap Reference into Thali</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Grid of Interactive 3D Matched Cards (keyed by category & offset to animate entire feed change) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + '-' + (categoryOffsets[activeCategory] || 0) + '-' + searchQuery}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {matchedFoods.slice(0, visibleCount).map((food) => {
            const badge = getContextBadge(food);
            return (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Food3DCard
                  food={food}
                  badge={badge}
                  onSwapClick={handleSwapClick}
                  canSwap={Boolean(onSwapMealDish)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Show More Button if there are remaining matched dishes */}
      {matchedFoods.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="px-5 py-2 rounded-2xl bg-[#fbf9f4] hover:bg-[#f5f3ee] border border-[#e8e5dc] text-xs font-bold text-[#1b4317] hover:border-[#1b4317] transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1b4317]" />
            <span>Show More Options ({matchedFoods.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
};
