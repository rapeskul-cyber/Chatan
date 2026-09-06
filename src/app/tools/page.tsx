'use client';

import { useState } from 'react';
import { Wrench, Mail, FileText, Link2, Sparkles } from 'lucide-react';
import { TempMail } from '@/components/tools/TempMail';
import { OcrTool } from '@/components/tools/OcrTool';
import { LinkTool } from '@/components/tools/LinkTool';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'tempmail' | 'ocr' | 'link'>('tempmail');

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 border border-slate-800 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Utility &amp; Disposable Mail Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Peralatan Utilitas Digital Harian
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Buat email sementara instan dengan auto-polling, ekstraksi teks dari gambar (OCR), serta pemendek &amp; pengurai shortlink iklan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
          <button
            onClick={() => setActiveTab('tempmail')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tempmail'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>TempMail</span>
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ocr'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>OCR Image</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'link'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Shortlink</span>
          </button>
        </div>
      </div>

      {/* Main Utility Components */}
      {activeTab === 'tempmail' && <TempMail />}
      {activeTab === 'ocr' && <OcrTool />}
      {activeTab === 'link' && <LinkTool />}
    </div>
  );
}
