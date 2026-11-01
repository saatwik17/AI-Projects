import React from 'react';
import { Leaf, Calendar, Utensils, MessageSquareText, ShieldAlert, ShoppingBag, BookOpen, User, Sparkles } from 'lucide-react';
import { NutriSwasthLogo } from './NutriSwasthLogo';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'database', label: 'Indian Foods', icon: Utensils },
    { id: 'lifestyle', label: 'Lifestyle Risks', icon: ShieldAlert },
    { id: 'grocery', label: 'Grocery Budget', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('planner')}>
            <NutriSwasthLogo size={40} showText layout="horizontal" subtitle="Indian Diet AI" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Profile Quick Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 text-xs font-medium transition-all"
              title="Edit User Profile"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline font-semibold">{userProfile.name || 'Profile'}</span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded-md font-mono">
                {userProfile.dietType.replace('_', ' ')}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
