'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore, ALL_TOOLS } from '@/lib/store';
import {
  Bot,
  Sparkles,
  Download,
  Smile,
  Gamepad2,
  Mail,
  Newspaper,
  Trophy,
  Compass,
  Command,
  Key,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'AI Workspace': <Bot className="w-4 h-4 text-emerald-400" />,
  Downloader: <Download className="w-4 h-4 text-cyan-400" />,
  'Creative Studio': <Smile className="w-4 h-4 text-purple-400" />,
  'Stalker & Checker': <Gamepad2 className="w-4 h-4 text-amber-400" />,
  'Utility Tools': <Mail className="w-4 h-4 text-indigo-400" />,
  'News & Portal': <Newspaper className="w-4 h-4 text-rose-400" />,
  Entertainment: <Trophy className="w-4 h-4 text-yellow-400" />,
};

export function Navigation() {
  const pathname = usePathname();
  const {
    apiKey,
    setApiKey,
    toggleCommandPalette,
    sidebarOpen,
    setSidebarOpen,
    addToast,
  } = useAppStore();

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);

  const categories = Array.from(new Set(ALL_TOOLS.map((tool) => tool.category)));

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim() || 'FREE');
    addToast(`API Key berhasil diperbarui: ${inputKey.trim() || 'FREE'}`, 'success');
    setIsKeyModalOpen(false);
  };

  return (
    <>
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 w-full h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  SynoxHub
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v3.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                All-in-One Multi-Tools & AI Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Search Bar Shortcut & API Key */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-all shadow-inner"
          >
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Cari Fitur...</span>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              Ctrl+K
            </span>
          </button>

          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Key:</span>
            <span className="font-mono text-amber-200">{apiKey}</span>
          </button>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-950 border-r border-slate-800/80 pt-16 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {categories.map((category) => {
            const categoryTools = ALL_TOOLS.filter((t) => t.category === category);
            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {CATEGORY_ICONS[category] || <Compass className="w-4 h-4 text-slate-400" />}
                  <span>{category}</span>
                </div>

                <div className="space-y-0.5">
                  {categoryTools.map((tool) => {
                    const isActive = pathname === tool.path;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        <span className="truncate">{tool.name}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> API Status: Active
          </span>
          <span>Free 3.000 req/day</span>
        </div>
      </div>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Pengaturan API Key</h3>
                <p className="text-xs text-slate-400">Masukkan API Key pribadi Anda untuk limit lebih tinggi.</p>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Synox API Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Gunakan 'FREE' atau API Key VIP Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p>💡 Default kunci <code className="text-amber-300">FREE</code> memberikan 3.000 request gratis setiap harinya.</p>
                <p>Hubungi admin Synox Cloud jika ingin upgrade ke tier VIP / Enterprise.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputKey('FREE');
                    setApiKey('FREE');
                    setIsKeyModalOpen(false);
                    addToast('API Key dikembalikan ke FREE', 'info');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Reset to FREE
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors"
                >
                  Simpan Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
