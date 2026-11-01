import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { UserProfileModal } from './components/UserProfileModal';
import { MealPlannerView } from './components/MealPlannerView';
import { FoodDatabaseView } from './components/FoodDatabaseView';
import { AIChatbotView } from './components/AIChatbotView';
import { LifestyleRiskView } from './components/LifestyleRiskView';
import { NutriSwasthLogo } from './components/NutriSwasthLogo';

import { UserProfile, DayPlan, RoutineContext, FoodItem } from './types';
import { generateDailyMealPlan } from './utils/planGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Initial Indian User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Aarav Sharma',
    ageGroup: 'student',
    age: 21,
    gender: 'male',
    heightCm: 172,
    weightKg: 68,
    activityLevel: 'light',
    healthGoal: 'maintain',
    dietType: 'vegetarian',
    region: 'north',
    setting: 'hostel',
    budget: 'budget',
    smokingStatus: 'non_smoker',
    alcoholUsage: 'none',
  });

  // Current Active Day Plan
  const [currentPlan, setCurrentPlan] = useState<DayPlan>(() =>
    generateDailyMealPlan(userProfile, 'normal', 'Today')
  );

  // Handle Profile Update & Recalculate Plan
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    const newPlan = generateDailyMealPlan(updatedProfile, currentPlan.routineContext, currentPlan.dayName);
    const mergedMeals = newPlan.meals.map((meal, idx) => {
      const existingMeal = currentPlan.meals[idx];
      return {
        ...meal,
        isTaken: existingMeal?.isTaken ?? false,
      };
    });
    setCurrentPlan({
      ...newPlan,
      meals: mergedMeals,
    });
  };

  // Handle Routine Context Switch
  const handleSelectContext = (context: RoutineContext) => {
    const newPlan = generateDailyMealPlan(userProfile, context, currentPlan.dayName);
    const mergedMeals = newPlan.meals.map((meal, idx) => {
      const existingMeal = currentPlan.meals[idx];
      return {
        ...meal,
        isTaken: existingMeal?.isTaken ?? false,
      };
    });
    setCurrentPlan({
      ...newPlan,
      meals: mergedMeals,
    });
  };

  // Handle Swapping single dish into active currentPlan
  const handleSwapMealDish = (mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner', newDish: FoodItem) => {
    const updatedMeals = currentPlan.meals.map((m) => {
      if (m.mealType === mealType) {
        return {
          ...m,
          dish: newDish,
          contextNote: `Swapped to ${newDish.name}. ${newDish.benefits}`,
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

    setCurrentPlan(updatedPlan);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1c221a] antialiased selection:bg-[#1b4317] selection:text-white flex">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navigation Header */}
        <TopHeader
          userProfile={userProfile}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigateTab={setActiveTab}
        />

        {/* View Component Container */}
        <main
          className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${
            activeTab === 'chatbot' ? 'py-2 sm:py-3' : 'py-6 sm:py-8'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  userProfile={userProfile}
                  currentPlan={currentPlan}
                  onNavigateTab={setActiveTab}
                  onSelectContext={handleSelectContext}
                  onOpenProfile={() => setIsProfileOpen(true)}
                  onSwapMealDish={handleSwapMealDish}
                />
              )}

              {activeTab === 'planner' && (
                <MealPlannerView
                  userProfile={userProfile}
                  currentPlan={currentPlan}
                  onUpdatePlan={setCurrentPlan}
                  onSelectContext={handleSelectContext}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {activeTab === 'database' && <FoodDatabaseView />}

              {activeTab === 'chatbot' && (
                <AIChatbotView userProfile={userProfile} currentPlan={currentPlan} />
              )}

              {activeTab === 'lifestyle' && (
                <LifestyleRiskView
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  currentPlan={currentPlan}
                  onUpdatePlan={setCurrentPlan}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        {activeTab !== 'chatbot' && (
          <footer className="bg-white border-t border-[#e8e5dc] py-6 text-xs text-slate-500 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <NutriSwasthLogo size={24} layout="icon-only" />
                <span className="font-bold text-[#1c221a] font-serif-heading">NutriSwasth AI</span>
                <span>• AI-Based Science & Ayurvedic Nutrition Planner for Indian Population</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <button onClick={() => setActiveTab('lifestyle')} className="hover:text-[#1b4317] cursor-pointer">
                  Section 7.5 Risk Module
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* User Profile Drawer/Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSave={handleUpdateProfile}
        currentPlan={currentPlan}
        onUpdatePlan={setCurrentPlan}
      />
    </div>
  );
}

