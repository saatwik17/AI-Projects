import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, Utensils, Zap, ShieldCheck, HeartPulse, 
  RefreshCw, MessageSquareText, ChevronRight, Clock, IndianRupee, 
  Droplets, ArrowUpRight, ShieldAlert, AlertTriangle, Cigarette, Wine 
} from 'lucide-react';
import { UserProfile, DayPlan, RoutineContext, ScheduledMeal, FoodItem } from '../types';
import { calculateNutritionTargets } from '../utils/nutritionCalculator';
import { getFoodImage } from '../utils/foodImageMapper';
import { RealTimeFoodSuggestions } from './RealTimeFoodSuggestions';

interface DashboardViewProps {
  userProfile: UserProfile;
  currentPlan: DayPlan;
  onNavigateTab: (tab: string) => void;
  onSelectContext: (context: RoutineContext) => void;
  onOpenProfile: () => void;
  onSwapMealDish?: (mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner', newDish: FoodItem) => void;
}

const BANNER_SLIDES = [
  {
    id: 1,
    title: 'Authentic Ayurvedic Thali',
    subtitle: 'Calibrated for 6-dosha balance & optimal macro ratio',
    badge: 'Ayurvedic Thali',
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Yellow Dal Tadka & Whole Wheat Rotis',
    subtitle: 'Rich in bioavailable plant proteins & gut-friendly spices',
    badge: 'High Fiber & Protein',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Steamed Idli with Sambar & Coconut Chutney',
    subtitle: 'Fermented probiotic superfood for digestive health',
    badge: 'Probiotic Goodness',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Moong Sprouts & Vegetable Poha',
    subtitle: 'Low-GI morning energizer for sustained focus',
    badge: 'Morning Superfood',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Palak Paneer with Gram Flour Missi Roti',
    subtitle: 'Iron-dense spinach saag with high-protein fresh paneer',
    badge: 'Sattvic Balance',
    imageUrl: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Traditional Ayurvedic Herbal Spices',
    subtitle: 'Turmeric, cumin, ginger & pepper to kindle digestive fire (Agni)',
    badge: 'Herbal Science',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  currentPlan,
  onNavigateTab,
  onSelectContext,
  onOpenProfile,
  onSwapMealDish,
}) => {
  const targets = calculateNutritionTargets(userProfile);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Pick first main meal for Spotlight feature
  const featuredMeal: ScheduledMeal | undefined = currentPlan.meals.find(
    (m) => m.mealType === 'Lunch' || m.mealType === 'Breakfast'
  ) || currentPlan.meals[0];

  const moodItems: { id: RoutineContext; label: string; icon: string; desc: string }[] = [
    { id: 'normal', label: 'Balanced Day', icon: '😊', desc: 'Classic nutritious Indian thali' },
    { id: 'high_stress', label: 'High Stress', icon: '😫', desc: 'Gut-soothing, gut-brain support' },
    { id: 'exam_deadline', label: 'Exam Sprint', icon: '📚', desc: 'Non-drowsy, high-focus meals' },
    { id: 'travel', label: 'Travel / Mess', icon: '✈️', desc: 'Portable & budget-friendly' },
  ];

  // Calculate percentages for radial chart
  const calPercent = Math.min(100, Math.round((currentPlan.totalCalories / targets.targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((currentPlan.totalProtein / targets.proteinG) * 100));
  const carbsPercent = Math.min(100, Math.round((currentPlan.totalCarbs / targets.carbsG) * 100));
  const fatPercent = Math.min(100, Math.round((currentPlan.totalFat / targets.fatG) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Full-Card Moving Image Slide Banner */}
      <div className="relative rounded-3xl sm:rounded-[2.25rem] p-6 sm:p-10 lg:p-12 text-white shadow-2xl overflow-hidden border border-white/20 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between group">
        {/* Full-size Background Image Slides */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {BANNER_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                />
              </div>
            );
          })}
          {/* Gradient Overlay for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 z-10" />
        </div>

        {/* Top edge active autoplay straight white line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20 z-30">
          <div
            key={activeSlide}
            className="h-full bg-white transition-all duration-[3800ms] ease-linear"
            style={{ width: '100%' }}
          />
        </div>

        {/* Top Header Content */}
        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-amber-200 text-xs font-semibold border border-white/20 backdrop-blur-md shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Ayurvedic & Science-Backed Thali Planner</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Namaste, {userProfile.name || 'Friend'}!
            </h1>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow">
              Your thali is calibrated for <strong className="text-white capitalize">{userProfile.dietType.replace('_', ' ')}</strong> diet in <strong className="text-white capitalize">{userProfile.region} India</strong>. Goal: <span className="text-amber-300 capitalize font-bold">{userProfile.healthGoal.replace('_', ' ')}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-6 py-3.5 rounded-2xl bg-[#9f402d] hover:bg-[#bd4d36] text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Utensils className="w-4 h-4" />
              View Today's Meal Plan
            </button>
            <button
              onClick={onOpenProfile}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/25 transition-all cursor-pointer backdrop-blur-md shadow-md"
            >
              Adjust Profile
            </button>
          </div>
        </div>

        {/* Straight White Horizontal Divider Line */}
        <div className="relative z-20 w-full h-px bg-white/30 my-4 sm:my-5" />

        {/* Bottom Slide Info & Slide Indicator Lines */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-md">
                {BANNER_SLIDES[activeSlide].badge}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-serif-heading text-white drop-shadow-md">
              {BANNER_SLIDES[activeSlide].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow">
              {BANNER_SLIDES[activeSlide].subtitle}
            </p>
          </div>

          {/* Carousel Slide Indicators - Straight White Lines */}
          <div className="flex items-center gap-2 shrink-0">
            {BANNER_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'w-8 bg-white shadow-sm' : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Routine & Mood Quick Switcher */}
      <div className="card-tactile p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1c221a] font-serif-heading flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1b4317]" />
              Today's Routine & Mindset Context
            </h2>
            <p className="text-xs text-slate-500">Adapts your meal recommendations in real-time</p>
          </div>
          <span className="text-[11px] font-semibold text-[#1b4317] bg-[#e2ebe0] px-2.5 py-1 rounded-full border border-[#c9d8c5]">
            Active: {currentPlan.routineContext.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {moodItems.map((item) => {
            const isActive = currentPlan.routineContext === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectContext(item.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4317] text-white border-[#1b4317] shadow-md'
                    : 'bg-[#fbf9f4] hover:bg-[#f0eee7] text-[#1c221a] border-[#e8e5dc]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{item.icon}</span>
                  {isActive && <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">ACTIVE</span>}
                </div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#1c221a]'}`}>{item.label}</div>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Indian Food Database Suggestions */}
      <RealTimeFoodSuggestions
        userProfile={userProfile}
        routineContext={currentPlan.routineContext}
        currentPlan={currentPlan}
        onSwapMealDish={onSwapMealDish}
        onAskAI={() => onNavigateTab('chatbot')}
      />

      {/* Main Grid: Thali Balance Wheel + Featured Dish */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Thali Balance Wheel (7 Columns) */}
        <div className="lg:col-span-7 card-tactile p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e8e5dc]">
            <div>
              <h2 className="text-base font-bold text-[#1c221a] font-serif-heading">Daily Thali Nutrition Wheel</h2>
              <p className="text-xs text-slate-500">Target Calorie & Macro distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1b4317] bg-[#e2ebe0] px-3 py-1 rounded-full border border-[#c9d8c5]">
                {currentPlan.totalCalories} / {targets.targetCalories} kcal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Visual SVG Ring */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle cx="60" cy="60" r="50" stroke="#f0eee7" strokeWidth="10" fill="transparent" />
                
                {/* Calories Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#1b4317"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * calPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                
                {/* Inner Protein Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="38"
                  stroke="#9f402d"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="238"
                  strokeDashoffset={238 - (238 * proteinPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Inner Carbs Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="28"
                  stroke="#e5a823"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="175"
                  strokeDashoffset={175 - (175 * carbsPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-bold font-display text-[#1c221a]">{calPercent}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Thali Balance</span>
              </div>
            </div>

            {/* Macro Breakdown List */}
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e5dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1b4317]" />
                  <div>
                    <div className="text-xs font-bold text-[#1c221a]">Calories</div>
                    <div className="text-[11px] text-slate-500">{currentPlan.totalCalories} / {targets.targetCalories} kcal</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1b4317] font-mono">{calPercent}%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e5dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9f402d]" />
                  <div>
                    <div className="text-xs font-bold text-[#1c221a]">Protein</div>
                    <div className="text-[11px] text-slate-500">{currentPlan.totalProtein}g / {targets.proteinG}g target</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#9f402d] font-mono">{proteinPercent}%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e5dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e5a823]" />
                  <div>
                    <div className="text-xs font-bold text-[#1c221a]">Carbohydrates</div>
                    <div className="text-[11px] text-slate-500">{currentPlan.totalCarbs}g / {targets.carbsG}g target</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#b8800a] font-mono">{carbsPercent}%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e5dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div>
                    <div className="text-xs font-bold text-[#1c221a]">Healthy Fats</div>
                    <div className="text-[11px] text-slate-500">{currentPlan.totalFat}g / {targets.fatG}g target</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 font-mono">{fatPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Thali Dish Spotlight (5 Columns) */}
        <div className="lg:col-span-5 card-tactile p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e5dc]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9f402d] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Spotlight Meal
              </span>
              <span className="text-xs text-slate-500">{featuredMeal?.mealType || 'Lunch'}</span>
            </div>

            {featuredMeal && (
              <div className="mt-4 space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-40 bg-slate-100 border border-[#e8e5dc]">
                  <img
                    src={featuredMeal.dish.imageUrl || getFoodImage(featuredMeal.dish.name)}
                    alt={featuredMeal.dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredMeal.dish.prepTimeMinutes} mins
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#1c221a] font-serif-heading">{featuredMeal.dish.name}</h3>
                  {featuredMeal.dish.hindiName && (
                    <p className="text-xs font-semibold text-[#1b4317]">{featuredMeal.dish.hindiName}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#e2ebe0] text-[#1b4317] font-semibold">
                    {featuredMeal.dish.calories} kcal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#ffdad3] text-[#9f402d] font-semibold">
                    P: {featuredMeal.dish.proteinG}g
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#fff4d9] text-[#8a6000] font-semibold">
                    Est: ₹{featuredMeal.dish.estimatedCostINR}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-[#fbf9f4] p-3 rounded-xl border border-[#e8e5dc] leading-relaxed">
                  <strong className="text-[#1b4317]">Why Recommended: </strong>
                  {featuredMeal.contextNote}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#e8e5dc] flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('planner')}
              className="text-xs font-bold text-[#1b4317] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Day Menu <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('chatbot')}
              className="px-3.5 py-1.5 rounded-xl bg-[#e2ebe0] text-[#1b4317] hover:bg-[#c9d8c5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Ask AI about recipe
            </button>
          </div>
        </div>
      </div>

      {/* Quick Helper Widget & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Section 7.5 Risk Status */}
        <div className="card-tactile p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              userProfile.smokingStatus === 'regular' || userProfile.alcoholUsage === 'frequent'
                ? 'bg-rose-100 text-rose-700'
                : userProfile.smokingStatus === 'occasional' || userProfile.alcoholUsage === 'moderate'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-[#e2ebe0] text-[#1b4317]'
            }`}>
              {userProfile.smokingStatus === 'regular' || userProfile.alcoholUsage === 'frequent' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : userProfile.smokingStatus !== 'non_smoker' || userProfile.alcoholUsage !== 'none' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
              userProfile.smokingStatus === 'regular' || userProfile.alcoholUsage === 'frequent'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : userProfile.smokingStatus !== 'non_smoker' || userProfile.alcoholUsage !== 'none'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {userProfile.smokingStatus === 'regular' && userProfile.alcoholUsage === 'frequent'
                ? 'High Danger'
                : userProfile.smokingStatus !== 'non_smoker' || userProfile.alcoholUsage !== 'none'
                ? 'Risk Active'
                : 'Optimal Low Risk'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1c221a] font-serif-heading">Section 7.5 Risk Mitigation</h3>
            
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                userProfile.smokingStatus !== 'non_smoker' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}>
                <Cigarette className="w-3 h-3" />
                {userProfile.smokingStatus.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                userProfile.alcoholUsage !== 'none' ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-600'
              }`}>
                <Wine className="w-3 h-3" />
                {userProfile.alcoholUsage} alcohol
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {userProfile.smokingStatus === 'regular' && userProfile.alcoholUsage === 'frequent'
                ? `High danger load: Vitamin C raised to ${targets.vitC_mg}mg (ROS defense) & Hydration raised to ${targets.waterLiters}L (liver clearance).`
                : userProfile.smokingStatus === 'regular'
                ? `High oxidative load: Vitamin C raised to ${targets.vitC_mg}mg (+50mg boost) with Amla & Guava countermeasures.`
                : userProfile.alcoholUsage === 'frequent'
                ? `Elevated hepatic strain: Hydration raised to ${targets.waterLiters}L (+0.8L flush) with Haldi curcumin protection.`
                : userProfile.smokingStatus === 'occasional' || userProfile.alcoholUsage === 'moderate'
                ? `Moderate lifestyle load: Vitamin C (${targets.vitC_mg}mg) and hydration (${targets.waterLiters}L) calibrated to mitigate mild stress.`
                : 'Optimal low lifestyle risk. Baseline antioxidant and standard metabolic homeostasis active.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('lifestyle')}
            className="text-xs font-bold text-[#9f402d] hover:underline flex items-center gap-1 cursor-pointer pt-2"
          >
            Manage Risk Factors <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Grocery Budget Estimate */}
        <div className="card-tactile p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#fff4d9] text-[#7a5700] flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Daily Budget</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1c221a] font-serif-heading">Est. ₹{currentPlan.totalCostINR} / Day</h3>
            <p className="text-xs text-slate-500 mt-1">
              Affordable Indian pulses, seasonal vegetables and grains optimized for your student/budget tier.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('grocery')}
            className="text-xs font-bold text-[#7a5700] hover:underline flex items-center gap-1 cursor-pointer pt-2"
          >
            View Grocery Checklist <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: AI Assistant Banner */}
        <div className="card-tactile p-5 bg-gradient-to-br from-[#1b4317] to-[#2d5a27] text-white flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-200 uppercase">Voice AI Assistant</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white font-serif-heading">Ask Dr. NutriSwasth</h3>
            <p className="text-xs text-emerald-100/80 mt-1">
              Have questions about Indian food substitutes or mess options? Speech & text assistant ready.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('chatbot')}
            className="w-full py-2.5 rounded-xl bg-[#9f402d] hover:bg-[#bd4d36] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
