import React from 'react';
import { 
  ShieldAlert, Cigarette, Wine, Heart, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, Activity, Flame, TrendingUp, Droplets, 
  Scale, Check, Clock, Circle, UtensilsCrossed, ShieldCheck, Zap,
  Award, RefreshCw, Layers
} from 'lucide-react';
import { UserProfile, DayPlan, ScheduledMeal } from '../types';
import { calculateNutritionTargets } from '../utils/nutritionCalculator';

interface LifestyleRiskViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  currentPlan?: DayPlan;
  onUpdatePlan?: (plan: DayPlan) => void;
}

// SVG Circular Progress Ring Component (matching reference design)
interface ProgressRingProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max,
  unit,
  label,
  color,
  trackColor = '#f1f5f9',
  size = 96,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const remaining = Math.max(0, max - value);

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      {/* SVG Progress Ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Stroke Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono leading-none">
            {value}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight mt-0.5 font-mono">
            /{max}{unit}
          </span>
        </div>
      </div>

      {/* Metric Label and Left Caption */}
      <div className="mt-2 text-center">
        <div className="text-xs font-bold text-slate-800">{label}</div>
        <div className="text-[11px] font-medium text-slate-500 font-mono mt-0.5">
          {remaining > 0 ? (
            <span>{remaining}{unit} left</span>
          ) : (
            <span className="text-emerald-600 font-semibold">Goal Met</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const LifestyleRiskView: React.FC<LifestyleRiskViewProps> = ({
  userProfile,
  onUpdateProfile,
  currentPlan,
  onUpdatePlan,
}) => {
  const targets = calculateNutritionTargets(userProfile);

  // Lifestyle Risk & Danger Level Computation
  const smokingLevel = userProfile.smokingStatus; // 'non_smoker' | 'occasional' | 'regular'
  const alcoholLevel = userProfile.alcoholUsage;  // 'none' | 'moderate' | 'frequent'

  // Danger severity scoring
  const smokingRiskScore = smokingLevel === 'regular' ? 2 : smokingLevel === 'occasional' ? 1 : 0;
  const alcoholRiskScore = alcoholLevel === 'frequent' ? 2 : alcoholLevel === 'moderate' ? 1 : 0;
  const totalRiskScore = smokingRiskScore + alcoholRiskScore;

  // Danger status badge config
  const getDangerBadge = () => {
    if (totalRiskScore >= 3) {
      return {
        label: 'High Lifestyle Danger',
        detail: 'Elevated ROS Oxidative & Hepatic Strain',
        bg: 'bg-rose-100 text-rose-900 border-rose-300',
        dot: 'bg-rose-600 animate-pulse',
        icon: AlertTriangle,
        gaugePercent: 90,
        gaugeColor: 'bg-rose-600',
      };
    }
    if (totalRiskScore === 2) {
      return {
        label: 'Elevated Lifestyle Risk',
        detail: smokingRiskScore === 2 ? 'High Free-Radical Oxidative Load' : alcoholRiskScore === 2 ? 'High Hepatic Clearance Load' : 'Combined Dual Lifestyle Load',
        bg: 'bg-amber-100 text-amber-900 border-amber-300',
        dot: 'bg-amber-600',
        icon: ShieldAlert,
        gaugePercent: 65,
        gaugeColor: 'bg-amber-500',
      };
    }
    if (totalRiskScore === 1) {
      return {
        label: 'Mild Lifestyle Risk',
        detail: smokingRiskScore === 1 ? 'Occasional Oxidative Stress' : 'Occasional Hepatic Load',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: ShieldAlert,
        gaugePercent: 35,
        gaugeColor: 'bg-amber-400',
      };
    }
    return {
      label: 'Optimal Low Risk',
      detail: 'Standard ICMR-NIN Baseline Active',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      gaugePercent: 10,
      gaugeColor: 'bg-emerald-500',
    };
  };

  const dangerBadge = getDangerBadge();
  const DangerIcon = dangerBadge.icon;

  // Real-time Meal & Nutrient calculations from currentPlan
  const meals = currentPlan?.meals || [];
  const takenMeals = meals.filter((m) => m.isTaken);
  const takenCount = takenMeals.length;
  const totalMeals = meals.length;
  const adherencePercent = totalMeals > 0 ? Math.round((takenCount / totalMeals) * 100) : 0;

  const consumedCalories = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.calories * m.portionMultiplier),
    0
  );
  const consumedProtein = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.proteinG * m.portionMultiplier),
    0
  );
  const consumedCarbs = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.carbsG * m.portionMultiplier),
    0
  );
  const consumedFat = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.fatG * m.portionMultiplier),
    0
  );
  const consumedVitC = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.vitC_mg * m.portionMultiplier),
    0
  );
  const consumedFiber = takenMeals.reduce(
    (acc, m) => acc + Math.round(m.dish.fiberG * m.portionMultiplier),
    0
  );

  const calProgress = Math.min(100, Math.round((consumedCalories / targets.targetCalories) * 100));
  const proteinProgress = Math.min(100, Math.round((consumedProtein / targets.proteinG) * 100));
  const carbsProgress = Math.min(100, Math.round((consumedCarbs / targets.carbsG) * 100));
  const fatProgress = Math.min(100, Math.round((consumedFat / targets.fatG) * 100));
  const vitCProgress = Math.min(100, Math.round((consumedVitC / targets.vitC_mg) * 100));

  // Handler to toggle meal taken state directly from the profile view
  const handleToggleMeal = (mealId: string) => {
    if (!currentPlan || !onUpdatePlan) return;
    const updatedMeals = currentPlan.meals.map((m) =>
      m.id === mealId ? { ...m, isTaken: !m.isTaken } : m
    );
    onUpdatePlan({
      ...currentPlan,
      meals: updatedMeals,
    });
  };

  // Dynamic real-time health insight message synchronized with smoking & alcohol status
  const getHealthStatusNote = () => {
    // If high combined risk
    if (smokingLevel === 'regular' && alcoholLevel === 'frequent') {
      return {
        title: 'High Danger Level: Critical Antioxidant & Hepatic Countermeasure Protocol Active',
        desc: `Dual risk factors detected. Cigarette smoke accelerates ascorbic acid catabolism (target raised to ${targets.vitC_mg}mg) while frequent alcohol strains liver glutathione and extracellular fluids (target raised to ${targets.waterLiters}L). Prioritize raw Amla/Guava for radical scavenging, plus Haldi Golden Milk and Coconut Water. Live tracking: ${takenCount}/${totalMeals} meals consumed (${calProgress}% calories, ${proteinProgress}% protein).`,
        color: 'border-rose-300 bg-rose-50/85 text-rose-950',
        iconColor: 'text-rose-600',
      };
    }
    // If regular smoker
    if (smokingLevel === 'regular') {
      return {
        title: 'Elevated Oxidative Stress: +50mg Vitamin C Free-Radical Scavenging Active',
        desc: `Regular smoking generates heavy ROS oxidants depleting tissue Vitamin C. Your daily Vitamin C target is elevated to ${targets.vitC_mg}mg (+50mg boost). Scheduled meals prioritize Amla, Guava chaat, and antioxidant-rich greens. Meal adherence: ${takenCount}/${totalMeals} meals taken (${consumedProtein}g/${targets.proteinG}g protein logged).`,
        color: 'border-amber-300 bg-amber-50/85 text-amber-950',
        iconColor: 'text-amber-700',
      };
    }
    // If frequent alcohol
    if (alcoholLevel === 'frequent') {
      return {
        title: 'Elevated Hepatic Load: +0.8L Hydration & Curcumin Liver Protocol Active',
        desc: `Frequent alcohol metabolism exhausts liver glutathione and drains electrolytes. Daily hydration target is calibrated to ${targets.waterLiters}L with emphasis on curcumin (Haldi Golden Milk) and potassium-rich Coconut Water. Meal adherence: ${takenCount}/${totalMeals} meals taken (${consumedCalories}/${targets.targetCalories} kcal logged).`,
        color: 'border-indigo-300 bg-indigo-50/85 text-indigo-950',
        iconColor: 'text-indigo-700',
      };
    }
    // If occasional smoking
    if (smokingLevel === 'occasional') {
      return {
        title: 'Moderate Oxidative Risk: +25mg Vitamin C Antioxidant Boost Active',
        desc: `Occasional smoking increases cellular oxidative load. Vitamin C target is increased to ${targets.vitC_mg}mg (+25mg boost). Include fresh citrus, amla, and greens in your scheduled thali. Meal adherence: ${takenCount}/${totalMeals} meals logged.`,
        color: 'border-amber-200 bg-amber-50/75 text-amber-900',
        iconColor: 'text-amber-600',
      };
    }
    // If moderate alcohol
    if (alcoholLevel === 'moderate') {
      return {
        title: 'Moderate Hepatic Load: +0.4L Fluid Flush & Electrolyte Balance Active',
        desc: `Moderate alcohol usage triggers mild dehydration and antioxidant demand. Hydration target is set to ${targets.waterLiters}L (+0.4L flush). Meal adherence: ${takenCount}/${totalMeals} meals logged.`,
        color: 'border-indigo-200 bg-indigo-50/75 text-indigo-900',
        iconColor: 'text-indigo-600',
      };
    }
    // Non-smoker, no alcohol
    if (takenCount === 0) {
      return {
        title: 'Optimal Low Lifestyle Risk — Ready for Daily Meal Intake',
        desc: `Zero smoking or alcohol risk factors detected. Standard ICMR-NIN baseline active (Vitamin C: 80mg, Hydration: ${targets.waterLiters}L). Log your thali meals as you consume them to monitor real-time nutrient distribution.`,
        color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
        iconColor: 'text-emerald-600',
      };
    }
    if (takenCount < totalMeals) {
      return {
        title: `${takenCount} of ${totalMeals} Meals Consumed • Optimal Low Risk Lifestyle`,
        desc: `Standard nutritional targets active (${consumedCalories}/${targets.targetCalories} kcal, ${consumedProtein}g/${targets.proteinG}g protein). Healthy baseline with zero oxidative or hepatic risk elevations.`,
        color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
        iconColor: 'text-emerald-600',
      };
    }
    return {
      title: 'Daily Nutrition Complete • 100% Adherence (Optimal Health)',
      desc: 'All scheduled Indian thali meals have been taken today! Caloric balance, dietary fiber, and Ayurvedic rasas are successfully calibrated with low lifestyle risk profile.',
      color: 'border-teal-200 bg-teal-50/80 text-teal-950',
      iconColor: 'text-teal-600',
    };
  };

  const healthNote = getHealthStatusNote();

  // Calculated Caloric Macro Percentages for Visual Bar Graph
  const totalMacroGrams = consumedCarbs + consumedProtein + consumedFat;
  const carbCalPct = totalMacroGrams > 0 ? Math.round(((consumedCarbs * 4) / Math.max(1, consumedCalories)) * 100) : 55;
  const proteinCalPct = totalMacroGrams > 0 ? Math.round(((consumedProtein * 4) / Math.max(1, consumedCalories)) * 100) : 20;
  const fatCalPct = totalMacroGrams > 0 ? Math.round(((consumedFat * 9) / Math.max(1, consumedCalories)) * 100) : 25;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" /> Section 7.5: Original Academic Contribution
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Lifestyle Risk-Aware Nutrition Module
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Standard diet apps ignore smoking and alcohol usage. NutriSwasth AI uses evidence-based dietary countermeasures (antioxidant boosts & liver support) while emphasizing long-term cessation.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Health & Meal Progress Update Section (Modern Graphical Dashboard) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-7">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Health Sync
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${dangerBadge.bg}`}>
                <div className={`w-2 h-2 rounded-full ${dangerBadge.dot}`} />
                <DangerIcon className="w-3 h-3" />
                <span>{dangerBadge.label}</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
              Real-Time Daily Health & Meal Tracker
            </h2>
            <p className="text-xs text-slate-500">
              Graphical biometric progress synchronized with scheduled Indian thali meals and active lifestyle factors for {currentPlan?.dayName || 'Today'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/80">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">
                Adherence: <strong className="text-slate-950 font-mono">{adherencePercent}%</strong> ({takenCount}/{totalMeals} meals)
              </span>
            </div>
          </div>
        </div>

        {/* 1. GRAPHICAL PROGRESS RINGS DASHBOARD (Matching User Reference Image) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Daily Nutrient & Caloric Progress Rings
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Live updates upon meal logging
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50/70 to-white border border-slate-200/80 shadow-2xs">
            {/* Ring 1: Carbohydrates (Teal) */}
            <ProgressRing
              value={consumedCarbs}
              max={targets.carbsG}
              unit="g"
              label="Carbs"
              color="#0d9488"
              trackColor="#e2e8f0"
            />

            {/* Ring 2: Protein (Purple) */}
            <ProgressRing
              value={consumedProtein}
              max={targets.proteinG}
              unit="g"
              label="Protein"
              color="#7c3aed"
              trackColor="#e2e8f0"
            />

            {/* Ring 3: Fats (Amber/Orange) */}
            <ProgressRing
              value={consumedFat}
              max={targets.fatG}
              unit="g"
              label="Fats"
              color="#f59e0b"
              trackColor="#e2e8f0"
            />

            {/* Ring 4: Calories (Rose/Flame) */}
            <ProgressRing
              value={consumedCalories}
              max={targets.targetCalories}
              unit=" kcal"
              label="Calories"
              color="#ea580c"
              trackColor="#e2e8f0"
            />

            {/* Ring 5: Vitamin C (Emerald / ROS Defense) */}
            <ProgressRing
              value={consumedVitC}
              max={targets.vitC_mg}
              unit="mg"
              label="Vit C (ROS Shield)"
              color="#10b981"
              trackColor="#e2e8f0"
            />

            {/* Ring 6: Fiber (Indigo / Digestive Health) */}
            <ProgressRing
              value={consumedFiber}
              max={30}
              unit="g"
              label="Dietary Fiber"
              color="#6366f1"
              trackColor="#e2e8f0"
            />
          </div>
        </div>

        {/* 2. COMPARATIVE MACRO & CALORIC DISTRIBUTION BAR GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Caloric Breakdown Stacked Bar Chart */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                Caloric Macro Energy Split
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {consumedCalories} of {targets.targetCalories} kcal logged
              </span>
            </div>

            {/* Stacked Macro Distribution Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-4 rounded-full bg-slate-200 flex overflow-hidden p-0.5 gap-0.5 shadow-inner">
                <div
                  style={{ width: `${consumedCalories > 0 ? carbCalPct : 55}%` }}
                  className="bg-teal-500 h-full rounded-l-full transition-all duration-500"
                  title={`Carbs: ${consumedCarbs}g (${carbCalPct}%)`}
                />
                <div
                  style={{ width: `${consumedCalories > 0 ? proteinCalPct : 20}%` }}
                  className="bg-purple-600 h-full transition-all duration-500"
                  title={`Protein: ${consumedProtein}g (${proteinCalPct}%)`}
                />
                <div
                  style={{ width: `${consumedCalories > 0 ? fatCalPct : 25}%` }}
                  className="bg-amber-500 h-full rounded-r-full transition-all duration-500"
                  title={`Fats: ${consumedFat}g (${fatCalPct}%)`}
                />
              </div>

              {/* Bar Legend */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Carbs: <strong className="font-mono text-slate-800">{carbCalPct}%</strong> ({consumedCarbs * 4} kcal)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>Protein: <strong className="font-mono text-slate-800">{proteinCalPct}%</strong> ({consumedProtein * 4} kcal)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Fats: <strong className="font-mono text-slate-800">{fatCalPct}%</strong> ({consumedFat * 9} kcal)</span>
                </div>
              </div>
            </div>

            {/* Individual Macro Progress Bars */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Carbs</span>
                  <span className="font-mono font-bold text-teal-700">{carbsProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${carbsProgress}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Protein</span>
                  <span className="font-mono font-bold text-purple-700">{proteinProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${proteinProgress}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Fats</span>
                  <span className="font-mono font-bold text-amber-700">{fatProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${fatProgress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Daily Hydration & Fluid Target Graphic */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-indigo-600" />
                Target Daily Hydration
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                alcoholLevel === 'frequent' ? 'bg-rose-100 text-rose-800' :
                alcoholLevel === 'moderate' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {alcoholLevel === 'frequent' ? '+0.8L Hepatic Flush' : alcoholLevel === 'moderate' ? '+0.4L Flush' : 'ICMR Baseline'}
              </span>
            </div>

            <div className="flex items-center gap-4 py-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-sm shrink-0">
                <span className="text-lg font-black font-mono leading-none">{targets.waterLiters}</span>
                <span className="text-[10px] uppercase font-bold opacity-80 mt-0.5">Liters</span>
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-bold text-slate-800">
                  {alcoholLevel !== 'none' ? 'Ethanol Clearance Fluid Protocol' : 'Daily Metabolic Water Intake'}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {alcoholLevel === 'frequent'
                    ? 'Target expanded to 3.6L to support hepatic glutathione synthesis and eliminate dehydration-induced headache toxins.'
                    : alcoholLevel === 'moderate'
                    ? 'Target expanded to 3.2L to maintain cellular electrolyte balance and support kidney clearance.'
                    : 'Standard baseline active to support digestion, nutrient transport, and thermoregulation.'}
                </p>
              </div>
            </div>

            {/* Quick Electrolyte Source Recommendation */}
            <div className="text-[11px] bg-white/80 p-2.5 rounded-xl border border-indigo-100/80 text-indigo-900 flex items-center justify-between">
              <span className="font-semibold">Recommended Fluid Sources:</span>
              <span className="font-medium text-slate-700">Coconut Water • Buttermilk • Water</span>
            </div>
          </div>
        </div>

        {/* 3. GRAPHICAL LIFESTYLE RISK DANGER & BIO-INDICATOR GAUGES */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Synchronized Lifestyle Danger & Bio-Indicator Meters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Oxidative Stress & ROS Gauge (Smoking) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border border-amber-200/80 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Cigarette className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">ROS Oxidative Stress Meter</h4>
                    <p className="text-[10px] text-slate-500">Smoking Status: <strong className="capitalize text-slate-800">{smokingLevel.replace('_', ' ')}</strong></p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                  smokingLevel === 'regular' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  smokingLevel === 'occasional' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {smokingLevel === 'regular' ? 'High Oxidative Load' : smokingLevel === 'occasional' ? 'Moderate Load' : 'Minimal / Baseline'}
                </span>
              </div>

              {/* Segmented Risk Gauge Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Antioxidant Balance</span>
                  <span className="font-mono">Vit C Target: {targets.vitC_mg} mg</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-2.5">
                  <div className={`rounded-full transition-all duration-500 ${
                    smokingLevel === 'non_smoker' ? 'bg-emerald-500' : 'bg-emerald-200'
                  }`} title="Optimal" />
                  <div className={`rounded-full transition-all duration-500 ${
                    smokingLevel === 'occasional' ? 'bg-amber-500' : smokingLevel === 'regular' ? 'bg-amber-300' : 'bg-slate-200'
                  }`} title="Elevated" />
                  <div className={`rounded-full transition-all duration-500 ${
                    smokingLevel === 'regular' ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'
                  }`} title="Danger" />
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-xl border border-amber-100 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-amber-900 font-bold">Countermeasure Intake:</span>
                  <span className="text-emerald-700 font-mono font-bold">{consumedVitC}mg / {targets.vitC_mg}mg Logged</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {smokingLevel !== 'non_smoker'
                    ? 'Free radicals actively deplete ascorbic acid. Consume raw Amla or Guava to replenish intracellular defense.'
                    : 'Normal cellular antioxidant homeostasis. Standard 80mg RDA adequate.'}
                </p>
              </div>
            </div>

            {/* Hepatic Strain & Clearance Gauge (Alcohol) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-200/80 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                    <Wine className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Hepatic Clearance & Liver Load</h4>
                    <p className="text-[10px] text-slate-500">Alcohol Usage: <strong className="capitalize text-slate-800">{alcoholLevel}</strong></p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                  alcoholLevel === 'frequent' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  alcoholLevel === 'moderate' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {alcoholLevel === 'frequent' ? 'High Hepatic Strain' : alcoholLevel === 'moderate' ? 'Moderate Strain' : 'Healthy Baseline'}
                </span>
              </div>

              {/* Segmented Risk Gauge Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Glutathione Clearance</span>
                  <span className="font-mono">Hydration: {targets.waterLiters} L</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-2.5">
                  <div className={`rounded-full transition-all duration-500 ${
                    alcoholLevel === 'none' ? 'bg-emerald-500' : 'bg-emerald-200'
                  }`} title="Optimal" />
                  <div className={`rounded-full transition-all duration-500 ${
                    alcoholLevel === 'moderate' ? 'bg-amber-500' : alcoholLevel === 'frequent' ? 'bg-amber-300' : 'bg-slate-200'
                  }`} title="Elevated" />
                  <div className={`rounded-full transition-all duration-500 ${
                    alcoholLevel === 'frequent' ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'
                  }`} title="Danger" />
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-xl border border-indigo-100 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-indigo-900 font-bold">Protective Spices:</span>
                  <span className="text-indigo-800 font-medium">Curcumin (Haldi) & Cruciferous</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {alcoholLevel !== 'none'
                    ? 'Ethanol metabolism produces acetaldehyde. Ensure Haldi milk and hydration to protect hepatocytes.'
                    : 'Normal liver clearance and lipid homeostasis with zero excess metabolic burden.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. GRAPHICAL MEAL STATUS TIMELINE & LOGGING CARDS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
              Today's Scheduled Thali Meals ({takenCount}/{totalMeals} Taken)
            </div>
            <span className="text-[11px] text-slate-400">
              Click buttons below to log intake
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {meals.map((meal) => {
              const mealCal = Math.round(meal.dish.calories * meal.portionMultiplier);
              const mealProt = Math.round(meal.dish.proteinG * meal.portionMultiplier);
              const mealCarb = Math.round(meal.dish.carbsG * meal.portionMultiplier);
              const mealFat = Math.round(meal.dish.fatG * meal.portionMultiplier);
              const mealVitC = Math.round(meal.dish.vitC_mg * meal.portionMultiplier);

              return (
                <div
                  key={meal.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                    meal.isTaken
                      ? 'bg-emerald-50/50 border-emerald-200/90 shadow-2xs ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {meal.mealType}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {mealCal} kcal
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                        {meal.dish.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 font-serif">
                        {meal.dish.hindiName}
                      </p>
                    </div>

                    {/* Macro Pill Indicators */}
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center pt-1 border-t border-slate-100">
                      <div className="bg-slate-100/80 py-0.5 rounded text-slate-700">
                        P: <strong className="text-purple-700">{mealProt}g</strong>
                      </div>
                      <div className="bg-slate-100/80 py-0.5 rounded text-slate-700">
                        C: <strong className="text-teal-700">{mealCarb}g</strong>
                      </div>
                      <div className="bg-slate-100/80 py-0.5 rounded text-slate-700">
                        F: <strong className="text-amber-700">{mealFat}g</strong>
                      </div>
                    </div>

                    {/* Antioxidant Tag if rich */}
                    {mealVitC > 15 && (
                      <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>+{mealVitC}mg Vit C Antioxidant</span>
                      </div>
                    )}
                  </div>

                  {/* Log Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleMeal(meal.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      meal.isTaken
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                    title={meal.isTaken ? 'Click to mark as Not Taken' : 'Click to mark as Taken'}
                  >
                    {meal.isTaken ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Taken (Logged)</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Mark as Taken</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. DYNAMIC BIO-FEEDBACK & HEALTH GUIDANCE CARD */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${healthNote.color} flex items-start gap-3.5 shadow-2xs`}>
          <Sparkles className={`w-5 h-5 ${healthNote.iconColor} shrink-0 mt-0.5`} />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm leading-snug">{healthNote.title}</div>
            <p className="leading-relaxed opacity-95">{healthNote.desc}</p>
          </div>
        </div>
      </div>

      {/* Interactive Status Toggle Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smoking Indicator Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Cigarette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Smoking Indicator</h3>
                <p className="text-xs text-slate-500">Triggers Vitamin C & free radical scavenging</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select Status:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['non_smoker', 'occasional', 'regular'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateProfile({ ...userProfile, smokingStatus: status })}
                  className={`p-2.5 rounded-xl border text-center font-medium capitalize transition-all cursor-pointer ${
                    userProfile.smokingStatus === status
                      ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" /> Scientific Rationale (Smoking)
            </div>
            <p className="leading-relaxed">
              Cigarette smoke generates reactive oxygen species (ROS) that deplete tissue Vitamin C levels by up to 40%. NutriSwasth AI automatically increases Vitamin C target to <strong>130mg+</strong> and prioritizes Indian superfoods like <strong>Amla</strong> (Gooseberry) and <strong>Fresh Guava</strong>.
            </p>
          </div>
        </div>

        {/* Alcohol Usage Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Wine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Alcohol Usage</h3>
                <p className="text-xs text-slate-500">Triggers hepatic & hydration support</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select Status:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['none', 'moderate', 'frequent'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateProfile({ ...userProfile, alcoholUsage: status })}
                  className={`p-2.5 rounded-xl border text-center font-medium capitalize transition-all cursor-pointer ${
                    userProfile.alcoholUsage === status
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/60 text-xs text-indigo-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-700" /> Scientific Rationale (Alcohol)
            </div>
            <p className="leading-relaxed">
              Alcohol metabolism depletes hepatic glutathione and B-vitamins while causing dehydration. The system boosts liver-protective curcumin (<strong>Haldi Milk</strong>), sulforaphane (<strong>Cruciferous Veggies</strong>), and electrolyte rich <strong>Coconut Water</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Countermeasure Food Showcase Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Indian Countermeasure Food Portfolio</h2>
          <p className="text-xs text-slate-500">Culturally accessible Indian staples with validated restorative biochemical profiles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900">Amla (Indian Gooseberry)</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-bold">180mg+ Vit C</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Highest natural Vitamin C concentration. Neutralizes smoke free-radicals and restores vascular antioxidant enzyme capacity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900">Guava (Amrood) Chaat</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-bold">120mg+ Vit C</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inexpensive Indian fruit providing 2x more Vitamin C than oranges, plus dietary pectin for healthy digestion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-900">Haldi Golden Milk (Curcumin)</span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-md font-bold">Hepatic Protect</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curcumin inhibits liver fat accumulation, reduces inflammatory cytokines, and aids alcohol toxicant clearance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-900">Palak & Mustard Greens</span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-md font-bold">Folate & Chlorophyll</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rich in natural folates and lipophilic antioxidants that protect hepatic cellular membranes from ethanol oxidative injury.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-900">Fresh Coconut Water</span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-bold">Electrolyte Balance</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Natural bio-available potassium and sodium to rehydrate extracellular fluids and prevent alcohol-induced headaches.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-900">Green Tea (EGCG)</span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-bold">Polyphenol Power</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Epigallocatechin gallate (EGCG) catechins cross cellular membranes to scavenge lipid peroxides caused by environmental oxidative stress.
            </p>
          </div>
        </div>
      </div>

      {/* Cessation Warning Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" /> Medical & Behavioral Health Note
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          While dietary countermeasures mitigate specific micronutrient deficits and oxidative stress, <strong>quitting smoking and reducing alcohol intake remain the single most effective actions</strong> to protect long-term cardiovascular, pulmonary, and liver health.
        </p>
      </div>
    </div>
  );
};
