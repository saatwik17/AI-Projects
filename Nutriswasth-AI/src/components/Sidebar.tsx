import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Calendar, Utensils, MessageSquareText, ShieldAlert, BookOpen, Sparkles, Settings, Leaf, X } from 'lucide-react';
import { NutriSwasthLogo } from './NutriSwasthLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'lifestyle', label: 'My Health Profile', icon: ShieldAlert },
    { id: 'database', label: 'Food Database', icon: Utensils },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#ffffff] border-r border-[#e8e5dc] w-64 p-5">
      {/* Top Section: Logo & Navigation */}
      <div className="space-y-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between pb-2">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center cursor-pointer group hover:opacity-95 transition-opacity"
          >
            <NutriSwasthLogo size={42} showText layout="horizontal" subtitle="AI Nutrition Expert" />
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 hover:text-[#1c221a] hover:bg-[#f5f3ee]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-[#1b4317] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`relative z-10 w-4 h-4 transition-colors ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Ask AI CTA & Settings */}
      <div className="space-y-3 pt-4 border-t border-[#e8e5dc]">
        {/* Primary Terracotta CTA Button */}
        <button
          onClick={() => handleNavClick('chatbot')}
          className="w-full py-3 px-4 rounded-xl bg-[#9f402d] hover:bg-[#bd4d36] active:scale-[0.98] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-red-900/10"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Ask NutriSwasth</span>
        </button>

        {/* User Profile / Settings Shortcut */}
        <button
          onClick={() => {
            onOpenProfile();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-[#f5f3ee] active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Profile Settings</span>
          </div>
          <span className="text-[10px] text-[#1b4317] font-semibold bg-[#e2ebe0] px-1.5 py-0.5 rounded">
            Edit
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 max-w-full h-full shadow-2xl animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
