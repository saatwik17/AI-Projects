import React, { useState } from 'react';
import { Search, Bell, Menu, Sparkles, User, Check, Utensils } from 'lucide-react';
import { NutriSwasthLogo } from './NutriSwasthLogo';
import { UserProfile } from '../types';

interface TopHeaderProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onToggleMobileMenu: () => void;
  onNavigateTab: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userProfile,
  onOpenProfile,
  onToggleMobileMenu,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Thali Calibration Complete', desc: 'Your South Indian lunch thali has been optimized for low GI.', time: '10m ago' },
    { id: 2, title: 'Vitamin C Target Boosted', desc: 'Added Antioxidant boost for oxidative protection.', time: '1h ago' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigateTab('database');
  };

  return (
    <header className="sticky top-0 z-20 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e8e5dc] px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button + Logo + Search Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-lg">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#f5f3ee] hover:bg-[#e8e5dc] text-slate-700 transition-all cursor-pointer shrink-0"
            title="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Brand Icon */}
          <div
            onClick={() => onNavigateTab('dashboard')}
            className="lg:hidden cursor-pointer shrink-0 flex items-center"
          >
            <NutriSwasthLogo size={32} layout="icon-only" />
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals, recipes, nutrients or ingredients..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#fbf9f4] border border-[#e8e5dc] text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4317]/20 focus:border-[#1b4317] transition-all"
            />
          </form>
        </div>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-[#fbf9f4] hover:bg-[#f5f3ee] border border-[#e8e5dc] text-slate-700 transition-all relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9f402d]" />
            </button>

            {/* Notifications Dropdown Popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#e8e5dc] p-4 z-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#e8e5dc] pb-2">
                  <h4 className="text-xs font-bold text-[#1c221a] font-serif-heading">NutriSwasth Alerts</h4>
                  <span className="text-[10px] text-[#1b4317] font-semibold bg-[#e2ebe0] px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>

                <div className="space-y-2">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#fbf9f4] border border-[#e8e5dc] text-xs">
                      <div className="font-bold text-[#1c221a] flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#fbf9f4] hover:bg-[#f5f3ee] border border-[#e8e5dc] transition-all cursor-pointer"
            title="Open Health Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#1b4317] text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs">
              {userProfile.name ? userProfile.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#1c221a] leading-tight">
                {userProfile.name || 'Aarav Sharma'}
              </div>
              <div className="text-[10px] text-[#1b4317] font-semibold capitalize">
                {userProfile.dietType.replace('_', ' ')} • {userProfile.region}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
