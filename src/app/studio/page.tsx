'use client';

import { useState } from 'react';
import { Palette, Sparkles, Type, CreditCard, Image as ImageIcon } from 'lucide-react';
import { MemeMaker } from '@/components/studio/MemeMaker';
import { TextMaker } from '@/components/studio/TextMaker';
import { CardMaker } from '@/components/studio/CardMaker';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'meme' | 'text' | 'card'>('meme');

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-pink-950 to-slate-900 border border-purple-800/50 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Creative Graphic &amp; Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Meme &amp; Visual Graphic Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Buat meme interaktif, desain teks 3D/Neon glow, serta kartu banner ucapan komunitas langsung di browser Anda.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
          <button
            onClick={() => setActiveTab('meme')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'meme'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Meme Maker</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>3D &amp; Neon Text</span>
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'card'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Banner Card</span>
          </button>
        </div>
      </div>

      {/* Main Studio Tools */}
      {activeTab === 'meme' && <MemeMaker />}
      {activeTab === 'text' && <TextMaker />}
      {activeTab === 'card' && <CardMaker />}
    </div>
  );
}
