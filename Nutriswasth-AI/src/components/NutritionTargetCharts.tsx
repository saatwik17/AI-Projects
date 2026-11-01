import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DayPlan, CalculatedTargets } from '../types';
import { PieChart as PieIcon, BarChart3, Activity, Flame, Award, Scale } from 'lucide-react';

interface NutritionTargetChartsProps {
  currentPlan: DayPlan;
  targets: CalculatedTargets;
}

export const NutritionTargetCharts: React.FC<NutritionTargetChartsProps> = ({ currentPlan, targets }) => {
  const [activeTab, setActiveTab] = useState<'macros' | 'comparison' | 'meals'>('macros');

  // Macro distribution for Donut Chart (in grams converted to calories or grams)
  const macroData = [
    { name: 'Protein', value: currentPlan.totalProtein * 4, grams: currentPlan.totalProtein, targetGrams: targets.proteinG, color: '#0d9488' }, // Teal
    { name: 'Carbs', value: currentPlan.totalCarbs * 4, grams: currentPlan.totalCarbs, targetGrams: targets.carbsG, color: '#f59e0b' },     // Amber
    { name: 'Healthy Fats', value: currentPlan.totalFat * 9, grams: currentPlan.totalFat, targetGrams: targets.fatG, color: '#6366f1' },  // Indigo
  ];

  // Target vs Actual Comparison Data
  const comparisonData = [
    {
      metric: 'Calories (kcal)',
      Target: targets.targetCalories,
      Scheduled: currentPlan.totalCalories,
      unit: 'kcal',
    },
    {
      metric: 'Protein (g)',
      Target: targets.proteinG,
      Scheduled: currentPlan.totalProtein,
      unit: 'g',
    },
    {
      metric: 'Carbs (g)',
      Target: targets.carbsG,
      Scheduled: currentPlan.totalCarbs,
      unit: 'g',
    },
    {
      metric: 'Fats (g)',
      Target: targets.fatG,
      Scheduled: currentPlan.totalFat,
      unit: 'g',
    },
  ];

  // Meal breakdown contribution data
  const mealBreakdownData = currentPlan.meals.map((m) => ({
    name: m.mealType,
    Calories: Math.round(m.dish.calories * m.portionMultiplier),
    Protein: Math.round(m.dish.proteinG * m.portionMultiplier),
    Carbs: Math.round(m.dish.carbsG * m.portionMultiplier),
    Fat: Math.round(m.dish.fatG * m.portionMultiplier),
  }));

  // Calorie Completion %
  const caloriePct = Math.round((currentPlan.totalCalories / targets.targetCalories) * 100);
  const proteinPct = Math.round((currentPlan.totalProtein / targets.proteinG) * 100);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-xl space-y-6 overflow-hidden">
      {/* Header with Navigation Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-display">Graphical Nutrition Calibration Visualizer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time analytical representation of planned meals vs calibrated RDA targets</p>
        </div>

        {/* Chart View Selection Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('macros')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'macros'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" /> Macro Ratio
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'comparison'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Target vs Planned
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'meals'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Meal Breakdown
          </button>
        </div>
      </div>

      {/* Main Graphical Canvas Area */}
      {activeTab === 'macros' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Donut Chart */}
          <div className="lg:col-span-7 h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [`${Math.round(value)} kcal`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Gauge Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">{currentPlan.totalCalories}</span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">/ {targets.targetCalories} kcal</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{caloriePct}% Achieved</span>
            </div>
          </div>

          {/* Right Stats Summary Badges */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-400" /> Macro Split Breakdown
            </h4>

            {macroData.map((item) => {
              const pct = Math.round((item.grams / item.targetGrams) * 100);
              return (
                <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div>
                      <span className="text-xs font-bold text-white block">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.grams}g <span className="text-slate-500">/ {item.targetGrams}g</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-400">{pct}%</span>
                    <span className="text-[10px] text-slate-500 block">of RDA target</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Target" fill="#334155" radius={[8, 8, 0, 0]} name="Calibrated Target" />
              <Bar dataKey="Scheduled" fill="#10b981" radius={[8, 8, 0, 0]} name="Scheduled Meals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'meals' && (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mealBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Calories" fill="#10b981" radius={[8, 8, 0, 0]} name="Calories (kcal)" />
              <Bar dataKey="Protein" fill="#0d9488" radius={[8, 8, 0, 0]} name="Protein (g)" />
              <Bar dataKey="Carbs" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Carbs (g)" />
              <Bar dataKey="Fat" fill="#6366f1" radius={[8, 8, 0, 0]} name="Fat (g)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Graphical Highlight Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <Award className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Calorie Sync</span>
            <span className="font-bold text-white">{caloriePct}% Match</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Protein Goal</span>
            <span className="font-bold text-white">{proteinPct}% Achieved</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily BMR</span>
            <span className="font-bold text-white">{targets.bmr} kcal</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active TDEE</span>
            <span className="font-bold text-white">{targets.tdee} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
