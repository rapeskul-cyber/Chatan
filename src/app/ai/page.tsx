'use client';

import { useState } from 'react';
import { Sparkles, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { ImageGenerator } from '@/components/ai/ImageGenerator';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-800/50 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Workspace &amp; Creative Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Multi-Model AI Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Pilih model obrolan seperti ChatGPT, Claude, Gemini &amp; AI Coder, atau buat karya visual gambar dengan AI Image Generator.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI Image Generator</span>
          </button>
        </div>
      </div>

      {/* Main Feature Workspace */}
      {activeTab === 'chat' ? (
        <ChatAssistant />
      ) : (
        <div className="max-w-3xl mx-auto">
          <ImageGenerator />
        </div>
      )}
    </div>
  );
}
