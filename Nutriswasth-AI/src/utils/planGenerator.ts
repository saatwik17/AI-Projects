import { UserProfile, DayPlan, RoutineContext, ScheduledMeal, FoodItem } from '../types';

import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { calculateNutritionTargets } from './nutritionCalculator';

export function generateDailyMealPlan(
  profile: UserProfile,
  routineContext: RoutineContext = 'normal',
  dayName: string = 'Today'
): DayPlan {
  const targets = calculateNutritionTargets(profile);

  // Filter foods by dietary compatibility
  const filteredFoods = INDIAN_FOOD_DATABASE.filter((food) => {
    // Dietary check
    if (profile.dietType === 'vegetarian') {
      const isVeg = food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
      if (!isVeg) return false;
    } else if (profile.dietType === 'jain') {
      if (!food.dietaryType.includes('jain')) return false;
    } else if (profile.dietType === 'vegan') {
      if (!food.dietaryType.includes('vegan')) return false;
    } else if (profile.dietType === 'eggetarian') {
      const isEggetarian = food.dietaryType.includes('eggetarian') || food.dietaryType.includes('vegetarian') || food.dietaryType.includes('vegan') || food.dietaryType.includes('jain');
      if (!isEggetarian) return false;
    } else if (profile.dietType === 'halal') {
      if (!food.dietaryType.includes('halal')) return false;
    } else if (profile.dietType === 'non_vegetarian') {
      // Allow all foods
    }

    // Setting check
    if (profile.setting === 'hostel') {
      if (!food.setting.includes('hostel') && !food.setting.includes('all')) return false;
    }

    // Budget check
    if (profile.budget === 'budget' && food.estimatedCostINR > 70) {
      return false;
    }

    return true;
  });

  // Helper to pick best food item for a category
  const pickBestFood = (category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage'): FoodItem => {
    let pool = filteredFoods.filter((f) => f.category === category);
    if (pool.length === 0) {
      // Fallback to any food of that category in database
      pool = INDIAN_FOOD_DATABASE.filter((f) => f.category === category);
    }

    // Routine Context weighting
    let scoredPool = pool.map((food) => {
      let score = 10;

      // Diet Type Preference boosts
      if (profile.dietType === 'non_vegetarian' && food.dietaryType.includes('non_vegetarian')) score += 20;
      if (profile.dietType === 'eggetarian' && food.dietaryType.includes('eggetarian')) score += 20;

      // Routine Context boosts
      if (routineContext === 'exam_deadline') {
        if (food.specialTags.includes('exam-fuel') || food.specialTags.includes('quick-digest')) score += 15;
        if (food.glycemicIndex === 'low') score += 10;
        if (food.prepTimeMinutes <= 15) score += 5;
      } else if (routineContext === 'high_stress') {
        if (food.specialTags.includes('high-stress') || food.specialTags.includes('gut-friendly')) score += 15;
        if (food.specialTags.includes('probiotic-curd')) score += 10;
      } else if (routineContext === 'travel') {
        if (food.specialTags.includes('travel-ready') || food.specialTags.includes('quick-digest')) score += 15;
      }

      // Lifestyle Risk boosts
      if (profile.smokingStatus !== 'non_smoker') {
        if (food.vitC_mg >= 30 || food.specialTags.includes('antioxidant-boost')) score += 12;
      }
      if (profile.alcoholUsage !== 'none') {
        if (food.specialTags.includes('liver-support')) score += 12;
      }

      // Health Goal boosts
      if (profile.healthGoal === 'blood_sugar_control' && food.glycemicIndex === 'low') score += 8;
      if (profile.healthGoal === 'muscle_gain' && food.proteinG >= 12) score += 8;

      // Regional boost
      if (food.region.includes(profile.region) || food.region.includes('pan_india')) score += 5;

      return { food, score };
    });

    scoredPool.sort((a, b) => b.score - a.score);
    return scoredPool[0]?.food || pool[0] || INDIAN_FOOD_DATABASE[0];
  };

  const breakfastItem = pickBestFood('breakfast');
  const lunchItem = pickBestFood('lunch');
  const snackItem = pickBestFood('snack');
  const dinnerItem = pickBestFood('dinner');

  // Portion calculation to align total calories to target
  const rawSumCalories = breakfastItem.calories + lunchItem.calories + snackItem.calories + dinnerItem.calories;
  const targetMultiplier = rawSumCalories > 0 ? targets.targetCalories / rawSumCalories : 1;

  // Context Notes
  const getContextNote = (mealType: string, food: FoodItem): string => {
    if (routineContext === 'exam_deadline') {
      return 'Low-GI item tailored to prevent post-meal drowsiness and sustain concentration.';
    } else if (routineContext === 'high_stress') {
      return 'Warm, easy-to-digest choice designed to protect gut health under stress.';
    } else if (routineContext === 'travel') {
      return 'Mess-free and portable option suitable for travel or hectic days.';
    }
    if (profile.smokingStatus !== 'non_smoker' && food.vitC_mg > 20) {
      return 'Rich in Vitamin C & antioxidants to combat smoking-induced oxidative stress.';
    }
    if (profile.alcoholUsage !== 'none' && food.specialTags.includes('liver-support')) {
      return 'Contains turmeric & liver-supportive nutrients to aid hepatic health.';
    }
    return food.benefits;
  };

  const scheduledMeals: ScheduledMeal[] = [
    {
      id: 'm1',
      mealType: 'Breakfast',
      dish: breakfastItem,
      portionMultiplier: Math.round(targetMultiplier * 10) / 10,
      contextNote: getContextNote('Breakfast', breakfastItem),
    },
    {
      id: 'm2',
      mealType: 'Lunch',
      dish: lunchItem,
      portionMultiplier: Math.round(targetMultiplier * 10) / 10,
      contextNote: getContextNote('Lunch', lunchItem),
    },
    {
      id: 'm3',
      mealType: 'Evening Snack',
      dish: snackItem,
      portionMultiplier: Math.round(targetMultiplier * 10) / 10,
      contextNote: getContextNote('Evening Snack', snackItem),
    },
    {
      id: 'm4',
      mealType: 'Dinner',
      dish: dinnerItem,
      portionMultiplier: Math.round(targetMultiplier * 10) / 10,
      contextNote: getContextNote('Dinner', dinnerItem),
    },
  ];

  const totalCalories = Math.round(
    scheduledMeals.reduce((sum, m) => sum + m.dish.calories * m.portionMultiplier, 0)
  );
  const totalProtein = Math.round(
    scheduledMeals.reduce((sum, m) => sum + m.dish.proteinG * m.portionMultiplier, 0)
  );
  const totalCarbs = Math.round(
    scheduledMeals.reduce((sum, m) => sum + m.dish.carbsG * m.portionMultiplier, 0)
  );
  const totalFat = Math.round(
    scheduledMeals.reduce((sum, m) => sum + m.dish.fatG * m.portionMultiplier, 0)
  );
  const totalCostINR = Math.round(
    scheduledMeals.reduce((sum, m) => sum + m.dish.estimatedCostINR * m.portionMultiplier, 0)
  );

  return {
    dayName,
    routineContext,
    meals: scheduledMeals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalCostINR,
  };
}

export function generateWeeklyPlan(profile: UserProfile, context: RoutineContext = 'normal'): DayPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((dayName, idx) => {
    // Create subtle variety per day
    let dayContext = context;
    if (idx === 2) dayContext = 'high_stress'; // Midweek stress
    if (idx === 4) dayContext = 'exam_deadline'; // Friday submission
    if (idx === 6) dayContext = 'travel'; // Sunday outing
    return generateDailyMealPlan(profile, dayContext, dayName);
  });
}
