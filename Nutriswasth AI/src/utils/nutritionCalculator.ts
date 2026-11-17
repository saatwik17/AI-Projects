import { UserProfile, CalculatedTargets } from '../types';

export function calculateNutritionTargets(profile: UserProfile): CalculatedTargets {
  const { age, gender, heightCm, weightKg, activityLevel, healthGoal, smokingStatus, alcoholUsage } = profile;

  // Mifflin-St Jeor BMR calculation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // TDEE Multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    heavy: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  // Calorie adjustments based on goals
  let targetCalories = tdee;
  if (healthGoal === 'weight_loss') {
    targetCalories = Math.max(1200, Math.round(tdee * 0.8)); // 20% deficit
  } else if (healthGoal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.15); // 15% surplus
  } else if (healthGoal === 'blood_sugar_control') {
    targetCalories = Math.round(tdee * 0.9); // Moderate deficit / maintenance with low GI
  } else if (healthGoal === 'heart_health') {
    targetCalories = Math.round(tdee * 0.95);
  }

  // Macronutrient Splits
  // Standard Indian diet recommendation: 15-20% Protein, 50-60% Carbs, 20-25% Healthy Fats
  let proteinRatio = 0.18;
  let fatRatio = 0.25;

  if (healthGoal === 'muscle_gain') {
    proteinRatio = 0.25;
    fatRatio = 0.25;
  } else if (healthGoal === 'weight_loss') {
    proteinRatio = 0.22;
    fatRatio = 0.28;
  } else if (healthGoal === 'blood_sugar_control') {
    proteinRatio = 0.22;
    fatRatio = 0.30; // higher healthy fat, lower carb
  }

  const proteinCalories = targetCalories * proteinRatio;
  const fatCalories = targetCalories * fatRatio;
  const carbCalories = targetCalories - (proteinCalories + fatCalories);

  const proteinG = Math.round(proteinCalories / 4);
  const fatG = Math.round(fatCalories / 9);
  const carbsG = Math.round(carbCalories / 4);

  // Fiber (ICMR recommends ~30-40g/day for Indian adults)
  const fiberG = Math.max(30, Math.round((targetCalories / 1000) * 16));

  // Vitamin C baseline (80mg Indian RDA) + smoking boost (+35mg - 50mg for oxidative stress)
  let vitC_mg = 80;
  if (smokingStatus === 'regular') {
    vitC_mg += 50; // Increased antioxidant need
  } else if (smokingStatus === 'occasional') {
    vitC_mg += 25;
  }

  // Water requirement (liters): ~35ml per kg body weight + alcohol compensation
  let waterLiters = Math.round(((weightKg * 35) / 1000) * 10) / 10;
  if (alcoholUsage === 'frequent') {
    waterLiters += 0.8; // Increased hydration requirement to assist liver & kidneys
  } else if (alcoholUsage === 'moderate') {
    waterLiters += 0.4;
  }

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    proteinG,
    carbsG,
    fatG,
    fiberG,
    vitC_mg,
    waterLiters,
  };
}
