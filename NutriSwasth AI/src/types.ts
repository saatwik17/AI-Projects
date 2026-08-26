export type AgeGroup = 'child' | 'teenager' | 'student' | 'adult' | 'senior';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'heavy';
export type HealthGoal = 'weight_loss' | 'muscle_gain' | 'blood_sugar_control' | 'heart_health' | 'maintain';
export type DietType = 'vegetarian' | 'non_vegetarian' | 'jain' | 'vegan' | 'eggetarian' | 'halal';
export type IndianRegion = 'north' | 'south' | 'east' | 'west' | 'pan_india';
export type SettingType = 'home' | 'hostel' | 'restaurant' | 'all';
export type BudgetLevel = 'budget' | 'balanced' | 'premium';
export type RoutineContext = 'normal' | 'high_stress' | 'exam_deadline' | 'travel';
export type SmokingStatus = 'non_smoker' | 'occasional' | 'regular';
export type AlcoholUsage = 'none' | 'moderate' | 'frequent';

export interface UserProfile {
  name: string;
  ageGroup: AgeGroup;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;
  dietType: DietType;
  region: IndianRegion;
  setting: SettingType;
  budget: BudgetLevel;
  smokingStatus: SmokingStatus;
  alcoholUsage: AlcoholUsage;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  dietaryType: DietType[];
  region: IndianRegion[];
  setting: SettingType[];
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  vitC_mg: number;
  antioxidantRating: number; // 1-5
  glycemicIndex: 'low' | 'medium' | 'high';
  estimatedCostINR: number;
  prepTimeMinutes: number;
  servingUnit: string;
  specialTags: string[]; // e.g. ['antioxidant-boost', 'liver-support', 'quick-digest', 'high-protein', 'exam-fuel']
  ingredients: string[];
  benefits: string;
  imageUrl?: string;
}

export interface ScheduledMeal {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner';
  dish: FoodItem;
  portionMultiplier: number;
  contextNote: string;
  isTaken?: boolean;
}

export interface DayPlan {
  dayName: string; // e.g. "Monday"
  routineContext: RoutineContext;
  meals: ScheduledMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCostINR: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
}

export interface CalculatedTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  vitC_mg: number;
  waterLiters: number;
}
