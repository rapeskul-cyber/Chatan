'use client';

import { useState } from 'react';
import { ShieldCheck, Gamepad2, UserCheck, Sparkles } from 'lucide-react';
import { GameChecker } from '@/components/checker/GameChecker';
import { SocialChecker } from '@/components/checker/SocialChecker';

export default function CheckerPage() {
  const [activeTab, setActiveTab] = useState<'game' | 'social'>('game');

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 border border-amber-800/50 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Profile &amp; Account Checker</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Game &amp; Social Media Inspector
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Inspeksi akun Mobile Legends, Free Fire, Genshin Impact, serta profil media sosial TikTok &amp; Instagram secara akurat.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'game'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Game Checker</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'social'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Social Stalker</span>
          </button>
        </div>
      </div>

      {/* Main Checker Components */}
      {activeTab === 'game' ? <GameChecker /> : <SocialChecker />}
    </div>
  );
}
