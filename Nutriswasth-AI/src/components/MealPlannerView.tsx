import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Activity, Zap, RefreshCw, Sparkles, IndianRupee, Clock, ShieldCheck, HeartPulse, Droplets, ChevronRight, Edit3, CheckCircle2, AlertCircle, Utensils, Filter, Shield } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, DayPlan, RoutineContext, ScheduledMeal, FoodItem, DietType } from '../types';

import { calculateNutritionTargets } from '../utils/nutritionCalculator';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { getFoodImage } from '../utils/foodImageMapper';
import { Meal3DCard } from './Meal3DCard';
import { NutritionTargetCharts } from './NutritionTargetCharts';

const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

interface MealPlannerViewProps {
  userProfile: UserProfile;
  currentPlan: DayPlan;
  onUpdatePlan: (newPlan: DayPlan) => void;
  onSelectContext: (context: RoutineContext) => void;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  onSwapMealDish?: (mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner', newDish: FoodItem) => void;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  userProfile,
  currentPlan,
  onUpdatePlan,
  onSelectContext,
  onUpdateProfile,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [swappingMeal, setSwappingMeal] = useState<ScheduledMeal | null>(null);

  const targets = calculateNutritionTargets(userProfile);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const contextTabs: { id: RoutineContext; label: string; desc: string; icon: string }[] = [
    { id: 'normal', label: 'Normal Day', desc: 'Balanced Indian variety & classic thali', icon: '😊' },
    { id: 'high_stress', label: 'High Stress', desc: 'Gut-calming, warm & easy-digestive', icon: '😫' },
    { id: 'exam_deadline', label: 'Exam Deadline', desc: 'Low-GI, focus sustaining, non-drowsy', icon: '📚' },
    { id: 'travel', label: 'Travel Day', desc: 'Portable, mess-free & non-perishable', icon: '✈️' },
  ];

  // AI Plan Generation via client-side Gemini AI
  const handleGenerateAiPlan = async () => {
    setIsGeneratingAI(true);
    try {
      const ai = getGeminiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured.');
      }

      const prompt = `Generate a customized 1-day Indian Meal Plan with 4 meals (Breakfast, Lunch, Evening Snack, Dinner) for an Indian user with the following profile:
- Age Group: ${userProfile?.ageGroup || "Adult"} (${userProfile?.age || 25} yrs)
- Gender: ${userProfile?.gender || "Female"}
- Height: ${userProfile?.height || 165} cm, Weight: ${userProfile?.weight || 62} kg
- Goal: ${userProfile?.healthGoal || "Weight Maintenance"}
- Dietary Preference: ${userProfile?.dietType || "Vegetarian"}
- Region Preference: ${userProfile?.region || "North"}
- Routine / Day Context: ${currentPlan.routineContext || "Normal Day"}
- Special Lifestyle Flags: ${userProfile?.isSmoker ? "Smoker (Boost Antioxidants & Vitamin C)" : ""}, ${userProfile?.alcoholUsage !== "none" ? "Alcohol Consumer (Include Liver Support & Electrolytes)" : ""}
- Additional User Request: ${aiCustomPrompt || "None"}

Please output valid JSON matching this schema:
{
  "daySummary": "Short explanation of why this menu fits today's context",
  "targetCalories": 2000,
  "targetProteinG": 70,
  "targetCarbsG": 250,
  "targetFatG": 55,
  "meals": [
    {
      "mealType": "Breakfast" | "Lunch" | "Snack" | "Dinner",
      "dishName": "Name of Indian Dish",
      "hindiName": "Dish Name in Hindi / Local language",
      "portion": "1 plate / 2 pieces / 1 bowl",
      "calories": 350,
      "proteinG": 12,
      "carbsG": 50,
      "fatG": 10,
      "estimatedCostINR": 40,
      "prepTimeMinutes": 15,
      "healthHighlight": "Why this is great for today's context",
      "keyIngredients": ["Ingredient 1", "Ingredient 2"]
    }
  ],
  "lifestyleTips": ["Tip 1", "Tip 2"]
}`;

      const aiRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = aiRes.text || '{}';
      const data = JSON.parse(text);

      // Convert AI response to DayPlan structure
      if (data && data.meals && Array.isArray(data.meals)) {
        const newMeals: ScheduledMeal[] = data.meals.map((m: any, idx: number) => {
          // Find matching dish or construct dynamic
          const matched = INDIAN_FOOD_DATABASE.find(
            (f) => f.name.toLowerCase().includes(m.dishName?.toLowerCase() || '')
          );

          const dishObj: FoodItem = matched || {
            id: `ai_${idx}`,
            name: m.dishName || 'Custom Indian Dish',
            hindiName: m.hindiName || '',
            category: (m.mealType?.toLowerCase().includes('snack') ? 'snack' : m.mealType?.toLowerCase()) || 'lunch',
            dietaryType: [userProfile.dietType],
            region: [userProfile.region],
            setting: [userProfile.setting],
            calories: m.calories || 350,
            proteinG: m.proteinG || 12,
            carbsG: m.carbsG || 45,
            fatG: m.fatG || 10,
            fiberG: 6,
            vitC_mg: 20,
            antioxidantRating: 4,
            glycemicIndex: 'low',
            estimatedCostINR: m.estimatedCostINR || 40,
            prepTimeMinutes: m.prepTimeMinutes || 15,
            servingUnit: m.portion || '1 serving',
            specialTags: ['ai-recommended'],
            ingredients: m.keyIngredients || ['Indian Spices'],
            benefits: m.healthHighlight || 'Custom AI calibrated recommendation.',
            imageUrl: getFoodImage(m.dishName || 'Custom Indian Dish'),
          };

          return {
            id: `sm_${idx}_${Date.now()}`,
            mealType: m.mealType || ['Breakfast', 'Lunch', 'Evening Snack', 'Dinner'][idx],
            dish: dishObj,
            portionMultiplier: 1,
            contextNote: m.healthHighlight || 'AI Tailored for your daily context.',
          };
        });

        const newDayPlan: DayPlan = {
          dayName: currentPlan.dayName,
          routineContext: currentPlan.routineContext,
          meals: newMeals,
          totalCalories: newMeals.reduce((sum, m) => sum + m.dish.calories, 0),
          totalProtein: newMeals.reduce((sum, m) => sum + m.dish.proteinG, 0),
          totalCarbs: newMeals.reduce((sum, m) => sum + m.dish.carbsG, 0),
          totalFat: newMeals.reduce((sum, m) => sum + m.dish.fatG, 0),
          totalCostINR: newMeals.reduce((sum, m) => sum + m.dish.estimatedCostINR, 0),
        };

        onUpdatePlan(newDayPlan);
      }
      setShowAiModal(false);
      setAiCustomPrompt('');
    } catch (err) {
      console.error('Error generating AI plan:', err);
      alert('Could not generate AI plan right now. Falling back to rule-based planner.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Swap dish handler
  const handleSwapDish = (newFood: FoodItem) => {
    if (!swappingMeal) return;

    const updatedMeals = currentPlan.meals.map((m) => {
      if (m.id === swappingMeal.id) {
        return {
          ...m,
          dish: newFood,
          contextNote: `Swapped to ${newFood.name}. ${newFood.benefits}`,
        };
      }
      return m;
    });

    const updatedPlan: DayPlan = {
      ...currentPlan,
      meals: updatedMeals,
      totalCalories: Math.round(updatedMeals.reduce((sum, m) => sum + m.dish.calories * m.portionMultiplier, 0)),
      totalProtein: Math.round(updatedMeals.reduce((sum, m) => sum + m.dish.proteinG * m.portionMultiplier, 0)),
      totalCarbs: Math.round(updatedMeals.reduce((sum, m) => sum + m.dish.carbsG * m.portionMultiplier, 0)),
      totalFat: Math.round(updatedMeals.reduce((sum, m) => sum + m.dish.fatG * m.portionMultiplier, 0)),
      totalCostINR: Math.round(updatedMeals.reduce((sum, m) => sum + m.dish.estimatedCostINR * m.portionMultiplier, 0)),
    };

    onUpdatePlan(updatedPlan);
    setSwappingMeal(null);
  };

  // Toggle whether a meal has been taken or not
  const handleToggleMealTaken = (mealToToggle: ScheduledMeal) => {
    const updatedMeals = currentPlan.meals.map((m) => {
      if (m.id === mealToToggle.id) {
        return {
          ...m,
          isTaken: !m.isTaken,
        };
      }
      return m;
    });

    const updatedPlan: DayPlan = {
      ...currentPlan,
      meals: updatedMeals,
    };

    onUpdatePlan(updatedPlan);
  };

  return (
    <div className="space-y-8">
      {/* Banner / Header Title */}
      <div className="bg-gradient-to-r from-[#1b4317] via-[#23501e] to-[#154212] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Section 7.3: Mood & Routine Aware Nutrition Logic</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading tracking-tight text-white">
              Personalized Indian Nourishment Plan
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Tailored for <strong className="text-white">{userProfile.name || 'User'}</strong> ({userProfile.dietType.replace('_', ' ')} • {userProfile.region} India) with calorie and macro targets calibrated for Indian body composition.
            </p>
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-[#9f402d] hover:bg-[#bd4d36] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            Synthesize AI Plan
          </button>
        </div>
      </div>

      {/* Day Selector & Dietary Preference Filters */}
      <div className="card-tactile p-4 sm:p-5 space-y-4">
        {/* Day Selector Bar */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-2 border-b border-[#e8e5dc]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1c221a] font-serif-heading shrink-0">
            <Calendar className="w-4 h-4 text-[#1b4317]" />
            <span>Schedule Day:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {daysOfWeek.map((day) => {
              const isActive = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1b4317] text-white font-bold shadow-xs'
                      : 'bg-[#fbf9f4] hover:bg-[#f5f3ee] text-slate-700 border border-[#e8e5dc]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calibrated Dietary Preference from Indian Health Profile (Fixed & Authoritative) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1c221a] font-serif-heading">
            <Utensils className="w-4 h-4 text-[#9f402d]" />
            <span>Calibrated Dietary Preference:</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fdf8f4] border border-[#e8d5c4] text-[#9f402d] text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#9f402d]" />
              <span className="capitalize">{userProfile.dietType.replace('_', ' ')}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced with Indian Health Profile</span>
            </span>
          </div>
        </div>
      </div>

      {/* Routine / Mood Context Display */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" /> Today's Routine & Mood Context
          </h2>
          <span className="text-xs text-emerald-700 font-medium">Selected in Dashboard</span>
        </div>

        {(() => {
          const activeTab = contextTabs.find((tab) => tab.id === currentPlan.routineContext) || contextTabs[0];
          return (
            <div className="p-4 rounded-2xl border bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeTab.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900">{activeTab.label}</span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{activeTab.desc}</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          );
        })()}
      </div>

      {/* Daily Nutrition Targets & Progress Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Daily Nutritional Calibration Target</h3>
            <p className="text-xs text-slate-500">Based on BMR ({targets.bmr} kcal) & TDEE ({targets.tdee} kcal)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" /> Est. Cost: ₹{currentPlan.totalCostINR} / day
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/60 font-semibold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Water: {targets.waterLiters}L / day
            </span>
          </div>
        </div>

        {/* Calorie & Macro Target Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Calories</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {currentPlan.totalCalories} <span className="text-xs text-slate-400 font-normal">/ {targets.targetCalories} kcal</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentPlan.totalCalories / targets.targetCalories) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Protein</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {currentPlan.totalProtein}g <span className="text-xs text-slate-400 font-normal">/ {targets.proteinG}g</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentPlan.totalProtein / targets.proteinG) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Carbohydrates</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {currentPlan.totalCarbs}g <span className="text-xs text-slate-400 font-normal">/ {targets.carbsG}g</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentPlan.totalCarbs / targets.carbsG) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-1">Healthy Fats</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {currentPlan.totalFat}g <span className="text-xs text-slate-400 font-normal">/ {targets.fatG}g</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentPlan.totalFat / targets.fatG) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Special Lifestyle Booster Notification */}
        {(userProfile.smokingStatus !== 'non_smoker' || userProfile.alcoholUsage !== 'none') && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lifestyle Countermeasure Active:</span> Target Vitamin C boost set to{' '}
              <strong className="font-mono text-amber-900">{targets.vitC_mg} mg</strong> (RDA + Oxidative Compensation) with antioxidant-dense Indian food recommendations.
            </div>
          </div>
        )}

        {/* Graphical / Visual Representation Chart Component */}
        <NutritionTargetCharts currentPlan={currentPlan} targets={targets} />
      </div>

      {/* Scheduled Meal List Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 font-display">Scheduled Meals for {currentPlan.dayName}</h2>
            {currentPlan.meals.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentPlan.meals.filter((m) => m.isTaken).length}/{currentPlan.meals.length} Taken
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">Click meal button to toggle Taken / Not Taken status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentPlan.meals.map((meal, index) => (
            <Meal3DCard
              key={meal.id}
              meal={meal}
              index={index}
              onSwapMeal={(selectedMeal) => setSwappingMeal(selectedMeal)}
              onToggleTaken={handleToggleMealTaken}
            />
          ))}
        </div>
      </div>

      {/* Modal: AI Plan Generation Prompt */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">Generate AI Meal Plan</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Gemini AI will synthesize a unique Indian meal plan matching your profile (<strong>{userProfile.dietType}</strong>, <strong>{userProfile.region}</strong> India, <strong>{currentPlan.routineContext}</strong> context).
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Optional custom instructions (e.g. "I want extra paneer and no oats", "Include South Indian breakfast under ₹100")
              </label>
              <textarea
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                rows={3}
                placeholder="Type any specific craving or dietary constraint..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiPlan}
                disabled={isGeneratingAI}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating AI Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Synthesize AI Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Swap Dish Selector */}
      {swappingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Swap {swappingMeal.mealType}
                </h3>
                <p className="text-xs text-slate-500">Pick an alternative Indian dish from our database</p>
              </div>
              <button onClick={() => setSwappingMeal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {INDIAN_FOOD_DATABASE.filter((food) => {
                // Category matching
                const mealCatMap: Record<string, string> = {
                  'Breakfast': 'breakfast',
                  'Lunch': 'lunch',
                  'Dinner': 'dinner',
                  'Evening Snack': 'snack',
                };
                const targetCat = mealCatMap[swappingMeal.mealType];
                if (targetCat && food.category !== targetCat) return false;

                // Diet type filter based on userProfile
                if (userProfile.dietType === 'vegetarian') {
                  return food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
                } else if (userProfile.dietType === 'jain') {
                  return food.dietaryType.includes('jain');
                } else if (userProfile.dietType === 'vegan') {
                  return food.dietaryType.includes('vegan');
                } else if (userProfile.dietType === 'eggetarian') {
                  return food.dietaryType.includes('eggetarian') || food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
                } else if (userProfile.dietType === 'halal') {
                  return food.dietaryType.includes('halal');
                }
                return true;
              }).map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSwapDish(food)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200">
                    <img
                      src={food.imageUrl || getFoodImage(food.name)}
                      alt={food.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 truncate">{food.name}</span>
                      {food.hindiName && <span className="text-xs text-emerald-700 shrink-0">({food.hindiName})</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{food.calories} kcal</span>
                      <span>P: {food.proteinG}g</span>
                      <span>₹{food.estimatedCostINR}</span>
                      <span className="capitalize text-slate-400">{food.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
