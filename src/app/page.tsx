'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore, ALL_TOOLS } from '@/lib/store';
import {
  Sparkles,
  Search,
  ArrowRight,
  Bot,
  Download,
  Smile,
  Gamepad2,
  Mail,
  Newspaper,
  Trophy,
  Zap,
  Flame,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const CATEGORY_MAP: Record<string, { icon: React.ReactNode; color: string; desc: string }> = {
  'AI Workspace': {
    icon: <Bot className="w-6 h-6 text-emerald-400" />,
    color: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400',
    desc: 'Multi-Model Chatbot & AI Image Generator',
  },
  Downloader: {
    icon: <Download className="w-6 h-6 text-cyan-400" />,
    color: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20 text-cyan-400',
    desc: 'Downloader TikTok, IG, YouTube & Spotify',
  },
  'Creative Studio': {
    icon: <Smile className="w-6 h-6 text-purple-400" />,
    color: 'from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400',
    desc: 'Meme Maker & Efek Teks 3D Neon',
  },
  'Stalker & Checker': {
    icon: <Gamepad2 className="w-6 h-6 text-amber-400" />,
    color: 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-400',
    desc: 'Cek Akun MLBB, Genshin & Profil TikTok/IG',
  },
  'Utility Tools': {
    icon: <Mail className="w-6 h-6 text-indigo-400" />,
    color: 'from-indigo-500/10 to-violet-500/5 border-indigo-500/20 text-indigo-400',
    desc: 'Email Sementara, OCR Gambar & Shortlink',
  },
  'News & Portal': {
    icon: <Newspaper className="w-6 h-6 text-rose-400" />,
    color: 'from-rose-500/10 to-red-500/5 border-rose-500/20 text-rose-400',
    desc: 'Berita Detik, CNN, Kompas & Antara',
  },
  Entertainment: {
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    color: 'from-yellow-500/10 to-amber-500/5 border-yellow-500/20 text-yellow-400',
    desc: 'Kuis Tebak Gambar & Primbon Zodiak',
  },
};

export default function Home() {
  const { toggleCommandPalette, sidebarOpen } = useAppStore();
  const popularTools = ALL_TOOLS.filter((t) => t.popular);
  const categories = Array.from(new Set(ALL_TOOLS.map((t) => t.category)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navigation />
      <CommandPalette />
      <ToastContainer />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 py-16 px-4 sm:px-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>SYNOX CLOUD API SUPER HUB v3.5</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Satu Platform Serbaguna Untuk Semua{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kebutuhan AI & Tools
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Eksplorasi puluhan fitur instan gratis: AI Assistant Multi-Model, Social Media Downloader HD, Meme Studio, Game Stalker, TempMail, & Berita Terkini.
            </p>

            {/* Quick Search Trigger */}
            <div className="pt-2 max-w-xl mx-auto">
              <button
                onClick={toggleCommandPalette}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-xl group"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-300">
                    Ketik apa saja untuk cari fitur...
                  </span>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700/50">
                  Ctrl + K
                </span>
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
                <div className="text-xl sm:text-2xl font-black text-indigo-400">15+</div>
                <div className="text-[11px] text-slate-400">Modul Tools Instant</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">3.000</div>
                <div className="text-[11px] text-slate-400">Req Gratis/Hari</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
                <div className="text-xl sm:text-2xl font-black text-purple-400">&lt;150ms</div>
                <div className="text-[11px] text-slate-400">Latensi Respon</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                <div className="text-[11px] text-slate-400">PWA & Mobile Ready</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Fitur Terpopuler</h2>
                <p className="text-xs text-slate-400">Paling sering digunakan oleh pengguna setiap hari</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                      {tool.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      HOT
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Buka Fitur Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Explorer Section */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Kategori Multi-Tools</h2>
              <p className="text-xs text-slate-400">Pilih kategori modul yang ingin Anda gunakan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((catName) => {
              const meta = CATEGORY_MAP[catName] || {
                icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
                color: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/20 text-indigo-400',
                desc: 'Modul fitur serbaguna SynoxHub',
              };

              const toolsInCat = ALL_TOOLS.filter((t) => t.category === catName);

              return (
                <div
                  key={catName}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${meta.color} border shadow-xl space-y-4`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{catName}</h3>
                      <p className="text-xs text-slate-400">{meta.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {toolsInCat.map((t) => (
                      <Link
                        key={t.id}
                        href={t.path}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 text-xs font-medium text-slate-300 hover:text-slate-100 transition-colors"
                      >
                        <span className="truncate">{t.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-8 bg-slate-950 text-slate-500 text-xs text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> SynoxHub Platform v3.5
          </div>
          <p>© {new Date().getFullYear()} Synox Cloud. All-in-One Multi-Tools & AI Super Hub for Consumer Web Users.</p>
        </footer>
      </main>
    </div>
  );
}
