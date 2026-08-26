import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Activity, Target, Utensils, Compass, IndianRupee, 
  Cigarette, Wine, Check, ChevronRight, ChevronLeft, RotateCcw, 
  Edit3, Trash2, Sparkles, ShieldAlert, Heart, Flame, Dumbbell, 
  Scale, Droplets, Zap, Shield, Coffee, MapPin, Home, Building2, 
  ShoppingBag, HelpCircle 
} from 'lucide-react';
import { 
  UserProfile, AgeGroup, Gender, ActivityLevel, HealthGoal, 
  DietType, IndianRegion, SettingType, BudgetLevel, SmokingStatus, AlcoholUsage, DayPlan 
} from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  currentPlan?: DayPlan;
  onUpdatePlan?: (updatedPlan: DayPlan) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  ageGroup: 'student',
  age: 21,
  gender: 'male',
  heightCm: 170,
  weightKg: 65,
  activityLevel: 'light',
  healthGoal: 'maintain',
  dietType: 'vegetarian',
  region: 'pan_india',
  setting: 'home',
  budget: 'balanced',
  smokingStatus: 'non_smoker',
  alcoholUsage: 'none',
};

// Colors per step for 3D card background transitions
const STEP_THEMES = [
  {
    bg: 'from-[#121020] via-[#1f1738] to-[#0d0a17]',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.25)',
    border: 'border-purple-500/30',
    title: 'Identity & Life Stage',
    subtitle: 'Step 1 of 5 • Calibrating basic health identity...',
  },
  {
    bg: 'from-[#091f16] via-[#113828] to-[#06140e]',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    border: 'border-emerald-500/30',
    title: 'Physiology & Body Metrics',
    subtitle: 'Step 2 of 5 • Precision BMI & energy targets...',
  },
  {
    bg: 'from-[#21160a] via-[#35230f] to-[#140c05]',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.25)',
    border: 'border-amber-500/30',
    title: 'Activity & Health Goals',
    subtitle: 'Step 3 of 5 • Defining your lifestyle vector...',
  },
  {
    bg: 'from-[#240e0b] via-[#381611] to-[#140705]',
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, 0.25)',
    border: 'border-orange-500/30',
    title: 'Cultural & Thali Preferences',
    subtitle: 'Step 4 of 5 • Regional flavors & mess alignment...',
  },
  {
    bg: 'from-[#0a1b22] via-[#102d38] to-[#061116]',
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.25)',
    border: 'border-cyan-500/30',
    title: 'Lifestyle Risks & Budget',
    subtitle: 'Step 5 of 5 • Section 7.5 Oxidative stress calibration...',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  currentPlan,
  onUpdatePlan,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'wizard' | 'summary'>(
    profile.name ? 'summary' : 'wizard'
  );
  const [formData, setFormData] = useState<UserProfile>(profile || DEFAULT_PROFILE);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  // Live meal intake metrics
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

  // 3D Mouse Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Max 10 degree tilt
    const rotateX = (mouseY / (rect.height / 2)) * -8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const currentTheme = STEP_THEMES[currentStep] || STEP_THEMES[0];

  // Live BMI Calculation
  const heightM = formData.heightCm / 100;
  const bmi = heightM > 0 ? (formData.weightKg / (heightM * heightM)).toFixed(1) : '22.0';
  const bmiNum = parseFloat(bmi);
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';

  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight (Boost Nourishment)';
    bmiColor = 'text-amber-300 bg-amber-500/20 border-amber-500/40';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Overweight (Calorie Deficit Focus)';
    bmiColor = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
  } else if (bmiNum >= 30) {
    bmiCategory = 'Obese (Low GI & Metabolic Support)';
    bmiColor = 'text-rose-400 bg-rose-500/20 border-rose-500/40';
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save profile
      onSave(formData);
      setViewMode('summary');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDeleteAll = () => {
    setFormData(DEFAULT_PROFILE);
    onSave(DEFAULT_PROFILE);
    setShowConfirmDelete(false);
    setCurrentStep(0);
    setViewMode('wizard');
  };

  const handleEditDetails = () => {
    setViewMode('wizard');
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className="w-full max-w-2xl my-auto perspective-1000 py-1 sm:py-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main 3D Card Container */}
        <div
          ref={cardRef}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out',
            boxShadow: `0 20px 50px -10px ${currentTheme.glow}`,
          }}
          className={`relative rounded-2xl sm:rounded-3xl bg-gradient-to-br ${currentTheme.bg} border ${currentTheme.border} text-white p-3.5 sm:p-8 overflow-hidden transition-colors duration-700 shadow-2xl`}
        >
          {/* Ambient Glowing Background Orb */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: currentTheme.accent, opacity: 0.2 }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: currentTheme.accent, opacity: 0.15 }}
          />

          {/* Top Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-2.5 sm:pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold shadow-lg transition-all shrink-0"
                style={{ backgroundColor: `${currentTheme.accent}33`, color: currentTheme.accent }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold font-serif-heading text-white tracking-tight leading-tight">
                  Indian Health Profile
                </h2>
                <p className="text-[10px] sm:text-xs text-white/70 leading-tight">
                  {viewMode === 'wizard' ? currentTheme.subtitle : 'Summary of calibrated health parameters'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Step Progress Indicators (Only in Wizard mode) */}
          {viewMode === 'wizard' && (
            <div className="relative z-10 my-3 sm:my-5 flex items-center justify-between gap-2">
              {[0, 1, 2, 3, 4].map((stepIdx) => {
                const isActive = currentStep === stepIdx;
                const isPassed = currentStep > stepIdx;
                return (
                  <div key={stepIdx} className="flex-1 flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => setCurrentStep(stepIdx)}
                      className={`w-full h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-white shadow-md'
                          : isPassed
                          ? 'bg-white/50'
                          : 'bg-white/15'
                      }`}
                    />
                    <span className="text-[10px] font-medium text-white/50 hidden sm:inline">
                      Step {stepIdx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content Views */}
          <div className="relative z-10 mt-2.5 sm:mt-4 min-h-0 sm:min-h-[360px] flex flex-col justify-between">
            {viewMode === 'summary' ? (
              /* ================= SUMMARY VIEW ================= */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-2.5 sm:space-y-6"
              >
                <div className="text-center py-0.5 sm:py-2 space-y-0.5 sm:space-y-1">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-semibold border border-emerald-500/30">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Health Identity Calibrated
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold font-serif-heading text-white leading-tight">{formData.name || 'User'}</h3>
                  <p className="text-[10px] sm:text-xs text-white/70">
                    {formData.age} yrs • {formData.gender.toUpperCase()} • {formData.heightCm} cm • {formData.weightKg} kg
                  </p>
                </div>

                {/* Grid of Profile Badges (2x2 on mobile and desktop for compact single-screen view) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  {/* BMI Card */}
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-0.5 sm:space-y-1">
                    <div className="text-white/60 text-[9px] sm:text-[11px] font-medium flex items-center justify-between">
                      <span className="truncate">BMI</span>
                      <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0 ml-1" />
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white">{bmi} <span className="text-[9px] sm:text-xs font-normal text-white/60">kg/m²</span></div>
                    <div className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border truncate max-w-full ${bmiColor}`}>
                      {bmiCategory}
                    </div>
                  </div>

                  {/* Primary Goal */}
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-0.5 sm:space-y-1">
                    <div className="text-white/60 text-[9px] sm:text-[11px] font-medium flex items-center justify-between">
                      <span className="truncate">Primary Goal</span>
                      <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 ml-1" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white capitalize truncate">{formData.healthGoal.replace('_', ' ')}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/60 capitalize truncate">Activity: {formData.activityLevel}</div>
                  </div>

                  {/* Culture & Diet */}
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-0.5 sm:space-y-1">
                    <div className="text-white/60 text-[9px] sm:text-[11px] font-medium flex items-center justify-between">
                      <span className="truncate">Diet & Region</span>
                      <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0 ml-1" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white capitalize truncate">{formData.dietType.replace('_', ' ')}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/60 capitalize truncate">{formData.region} India • {formData.setting}</div>
                  </div>

                  {/* Risk Profile */}
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-0.5 sm:space-y-1">
                    <div className="text-white/60 text-[9px] sm:text-[11px] font-medium flex items-center justify-between">
                      <span className="truncate">Lifestyle & Budget</span>
                      <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0 ml-1" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white capitalize truncate">Budget: {formData.budget}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/60 truncate">
                      Smoke: {formData.smokingStatus.replace('_', ' ')} • Alcohol: {formData.alcoholUsage}
                    </div>
                  </div>
                </div>

                {/* Real-Time Daily Progress & Meal Intake Strip */}
                {totalMeals > 0 && (
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Daily Meal Progress
                      </div>
                      <span className="font-mono font-bold text-white">
                        {takenCount}/{totalMeals} Taken ({adherencePercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${adherencePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-emerald-200/80">
                      <span>Consumed: {consumedCalories} kcal</span>
                      <span>Protein: {consumedProtein}g</span>
                      <span>{takenCount === totalMeals ? '✨ 100% Target Met' : `${totalMeals - takenCount} Pending`}</span>
                    </div>
                  </div>
                )}

                {/* Actions: Edit or Delete/Reset */}
                <div className="pt-2.5 sm:pt-4 border-t border-white/10 flex flex-row items-center justify-between gap-1.5 sm:gap-3">
                  {!showConfirmDelete ? (
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer touch-manipulation"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden xs:inline">Reset All</span>
                      <span className="xs:hidden">Reset</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs text-rose-300 font-bold hidden xs:inline">Reset?</span>
                      <button
                        onClick={handleDeleteAll}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                    <button
                      onClick={handleEditDetails}
                      className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer touch-manipulation"
                    >
                      <Edit3 className="w-3.5 h-3.5 shrink-0" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onSave(formData);
                        onClose();
                      }}
                      className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer touch-manipulation"
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ================= WIZARD STEP-BY-STEP FLOW ================= */
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="mb-2">
                    <h3 className="text-lg font-bold font-serif-heading text-white">{currentTheme.title}</h3>
                    <p className="text-xs text-white/60">Fill in this detail to proceed to the next step.</p>
                  </div>

                  {/* STEP 0: Identity & Demographics */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Age (Years)</label>
                          <input
                            type="number"
                            min="5"
                            max="100"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Gender</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'male', label: 'Male' },
                              { id: 'female', label: 'Female' },
                              { id: 'other', label: 'Other' },
                            ].map((g) => (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: g.id as Gender })}
                                className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  formData.gender === g.id
                                    ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                                    : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                                }`}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Life Stage / Age Group</label>
                        <select
                          value={formData.ageGroup}
                          onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                          className="w-full px-4 py-3 rounded-2xl bg-[#1d1730] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="child">Child (5-12 yrs)</option>
                          <option value="teenager">Teenager (13-17 yrs)</option>
                          <option value="student">College Student / Young Adult (18-24 yrs)</option>
                          <option value="adult">Working Adult (25-59 yrs)</option>
                          <option value="senior">Senior Citizen (60+ yrs)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Physiology & Body Metrics */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Height (cm)</label>
                          <input
                            type="number"
                            min="100"
                            max="220"
                            value={formData.heightCm}
                            onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Weight (kg)</label>
                          <input
                            type="number"
                            min="30"
                            max="200"
                            value={formData.weightKg}
                            onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* Dynamic Live BMI Calculation Box */}
                      <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white/80">Calculated Body Mass Index (BMI)</span>
                          <span className="font-mono font-bold text-emerald-300 text-sm">{bmi} kg/m²</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border text-xs font-medium ${bmiColor}`}>
                          💡 <strong>Clinical Guidance:</strong> {bmiCategory}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Physical Activity & Primary Health Goal */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-2">Primary Objective / Health Goal</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { id: 'maintain', label: 'Maintain Weight', icon: '⚖️', desc: 'Balanced thali nutrition' },
                            { id: 'weight_loss', label: 'Weight Loss / Fat Burn', icon: '⚡', desc: 'Low GI & high fiber focus' },
                            { id: 'muscle_gain', label: 'Muscle Gain & Strength', icon: '💪', desc: 'High protein dal & paneer/egg' },
                            { id: 'blood_sugar_control', label: 'Diabetes Control', icon: '🩸', desc: 'Complex millets & low GI' },
                            { id: 'heart_health', label: 'Heart & BP Support', icon: '❤️', desc: 'Low sodium & omega-3 fats' },
                          ].map((item) => {
                            const isSelected = formData.healthGoal === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, healthGoal: item.id as HealthGoal })}
                                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/25 border-amber-400 text-white shadow-lg'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                                }`}
                              >
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  <span>{item.icon}</span>
                                  <span>{item.label}</span>
                                </div>
                                <p className="text-[11px] text-white/60 mt-0.5">{item.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Physical Activity Level</label>
                        <select
                          value={formData.activityLevel}
                          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                          className="w-full px-4 py-3 rounded-2xl bg-[#2d2110] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="sedentary">Sedentary (Desk job / minimal walking)</option>
                          <option value="light">Lightly Active (1-3 days light exercise)</option>
                          <option value="moderate">Moderately Active (3-5 days workout)</option>
                          <option value="active">Very Active (6-7 days heavy workouts)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Cultural & Regional Thali Preferences */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-2">Diet Type Preference</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'vegetarian', label: 'Pure Veg', icon: '🥗' },
                            { id: 'non_vegetarian', label: 'Non-Veg', icon: '🍗' },
                            { id: 'jain', label: 'Jain (No Onion)', icon: '🥬' },
                            { id: 'eggetarian', label: 'Eggetarian', icon: '🥚' },
                            { id: 'vegan', label: 'Vegan', icon: '🌿' },
                            { id: 'halal', label: 'Halal', icon: '🌙' },
                          ].map((d) => {
                            const isSelected = formData.dietType === d.id;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, dietType: d.id as DietType })}
                                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-orange-500/30 border-orange-400 text-white shadow-md'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
                                }`}
                              >
                                <span className="text-base">{d.icon}</span>
                                <span>{d.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Indian Regional Style</label>
                          <select
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value as IndianRegion })}
                            className="w-full px-4 py-3 rounded-2xl bg-[#331613] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          >
                            <option value="pan_india">Pan-India (Mix of all)</option>
                            <option value="north">North Indian (Roti, Dal, Sabzi)</option>
                            <option value="south">South Indian (Idli, Rice, Sambar)</option>
                            <option value="east">East Indian (Rice, Dal, Mustard Fish)</option>
                            <option value="west">West Indian (Poha, Bajra, Gujarati/Maha)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Eating Setting</label>
                          <select
                            value={formData.setting}
                            onChange={(e) => setFormData({ ...formData, setting: e.target.value as SettingType })}
                            className="w-full px-4 py-3 rounded-2xl bg-[#331613] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          >
                            <option value="home">Home Cooked Meals</option>
                            <option value="hostel">Hostel Mess / College Canteen</option>
                            <option value="restaurant">Restaurant / Tiffin Service</option>
                            <option value="all">Any Setting</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Lifestyle Risk & Budget Calibration */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Daily Budget Tier</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value as BudgetLevel })}
                          className="w-full px-4 py-3 rounded-2xl bg-[#102d38] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <option value="budget">Student / Budget (Under ₹150/day)</option>
                          <option value="balanced">Balanced Family (₹150 - ₹350/day)</option>
                          <option value="premium">Premium Organic (₹350+/day)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Smoking Indicator</label>
                          <select
                            value={formData.smokingStatus}
                            onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value as SmokingStatus })}
                            className="w-full px-4 py-3 rounded-2xl bg-[#102d38] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          >
                            <option value="non_smoker">Non-Smoker</option>
                            <option value="occasional">Occasional Smoker</option>
                            <option value="regular">Regular Smoker (+50mg Vitamin C boost)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Alcohol Usage</label>
                          <select
                            value={formData.alcoholUsage}
                            onChange={(e) => setFormData({ ...formData, alcoholUsage: e.target.value as AlcoholUsage })}
                            className="w-full px-4 py-3 rounded-2xl bg-[#102d38] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          >
                            <option value="none">None / Teetotaler</option>
                            <option value="moderate">Moderate (Socially)</option>
                            <option value="frequent">Frequent (Liver-support nutrients focus)</option>
                          </select>
                        </div>
                      </div>

                      {(formData.smokingStatus !== 'non_smoker' || formData.alcoholUsage !== 'none') && (
                        <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-xs text-cyan-200">
                          💡 <strong>Section 7.5 Risk Calibration Active:</strong> Antioxidant sources (Amla, Guava) & hepatic supportive herbs will be automatically prioritized in your thalis.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Navigation Buttons */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                      className="px-4 py-2.5 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 text-xs font-semibold disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentStep === 4 ? 'Complete & Save' : 'Continue'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
