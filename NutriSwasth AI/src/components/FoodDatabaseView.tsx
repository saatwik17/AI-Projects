import React, { useState } from 'react';
import { Search, Utensils, Clock, IndianRupee, Filter, ShieldCheck, Flame, Leaf, Tag } from 'lucide-react';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { FoodItem } from '../types';
import { getFoodImage } from '../utils/foodImageMapper';

export const FoodDatabaseView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage'];
  const diets = ['all', 'vegetarian', 'non_vegetarian', 'jain', 'eggetarian', 'vegan', 'halal'];
  const regions = ['all', 'north', 'south', 'east', 'west', 'pan_india'];
  const specialTags = [
    { id: 'all', label: 'All Features' },
    { id: 'antioxidant-boost', label: '🛡️ Antioxidant Boost' },
    { id: 'liver-support', label: '🌿 Liver Support' },
    { id: 'quick-digest', label: '⚡ Quick Digest' },
    { id: 'high-protein', label: '💪 High Protein' },
    { id: 'budget-friendly', label: '🪙 Budget Friendly' },
    { id: 'exam-fuel', label: '🧠 Exam / Focus Fuel' },
  ];

  const filteredFoods = INDIAN_FOOD_DATABASE.filter((food) => {
    // Search matching
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category matching
    if (selectedCategory !== 'all' && food.category !== selectedCategory) return false;

    // Diet matching
    if (selectedDiet !== 'all' && !food.dietaryType.includes(selectedDiet as any)) return false;

    // Region matching
    if (selectedRegion !== 'all' && !food.region.includes(selectedRegion as any)) return false;

    // Tag matching
    if (selectedTag !== 'all' && !food.specialTags.includes(selectedTag)) return false;

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Indian Food Database & Cultural Adaptation</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Section 7.1: Calibrated nutritional database of authentic Indian dishes with regional, dietary, cost, and prep time metadata.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by dish name, Hindi name, or ingredients (e.g. Rajma, Amla, Moong, Guava)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-3 pt-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Special Feature Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Special Tag:
            </span>
            {specialTags.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedTag === t.id
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'bg-teal-50 text-teal-900 border border-teal-200/60 hover:bg-teal-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Database Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between space-y-4 overflow-hidden group"
          >
            <div className="space-y-3">
              {/* Food Image Background Header Banner */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:shadow-md transition-all">
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
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700/90 backdrop-blur-md text-white font-bold uppercase tracking-wider text-[10px] border border-emerald-500/30">
                    {food.category}
                  </span>
                  <span className="text-white/90 font-semibold capitalize bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] border border-white/20">
                    {food.region.join(', ')} India
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-base font-extrabold text-white font-display drop-shadow-md leading-tight">{food.name}</h3>
                  {food.hindiName && <p className="text-xs text-emerald-300 font-semibold drop-shadow-xs mt-0.5">{food.hindiName}</p>}
                </div>
              </div>

              {/* Portion & Cost */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span>Serving: {food.servingUnit}</span>
                <span className="font-bold text-slate-900">~ ₹{food.estimatedCostINR}</span>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <div className="text-slate-400 text-[9px]">CAL</div>
                  <div className="font-bold text-slate-800">{food.calories}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-teal-50">
                  <div className="text-teal-600 text-[9px]">PROT</div>
                  <div className="font-bold text-teal-800">{food.proteinG}g</div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <div className="text-amber-600 text-[9px]">CARB</div>
                  <div className="font-bold text-amber-800">{food.carbsG}g</div>
                </div>
                <div className="p-1.5 rounded-lg bg-indigo-50">
                  <div className="text-indigo-600 text-[9px]">FAT</div>
                  <div className="font-bold text-indigo-800">{food.fatG}g</div>
                </div>
              </div>

              {/* Health Benefits */}
              <p className="text-xs text-slate-600 leading-relaxed">{food.benefits}</p>

              {/* Special Tag Badges */}
              <div className="flex flex-wrap gap-1">
                {food.specialTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer / Prep Time & Vitamin C */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {food.prepTimeMinutes} min prep
              </span>
              {food.vitC_mg > 0 && (
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 text-[10px]">
                  Vit C: {food.vitC_mg}mg
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500">
          No Indian dishes found matching your search and filter criteria. Try adjusting filters.
        </div>
      )}
    </div>
  );
};
