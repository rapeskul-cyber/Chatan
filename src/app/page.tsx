'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Download,
  Palette,
  ShieldCheck,
  Wrench,
  Newspaper,
  Gamepad2,
  Search,
  ArrowRight,
  Zap,
  Flame,
  CheckCircle2,
  Terminal,
  Grid,
} from 'lucide-react';
import { SynoxCategory, SynoxItem } from '@/types/synox';

export default function HomePage() {
  const [categories, setCategories] = useState<SynoxCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/synox/endpoints')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.endpoints) {
          setCategories(data.endpoints);
          let count = 0;
          data.endpoints.forEach((cat: SynoxCategory) => {
            count += cat.items ? cat.items.length : 0;
          });
          setTotalCount(count);
        }
      })
      .catch((err) => console.error('Failed to fetch catalog:', err))
      .finally(() => setLoading(false));
  }, []);

  const quickHubCards = [
    {
      title: 'AI Workspace',
      desc: 'Obrolan multi-model ChatGPT, Claude, Gemini & Coder',
      icon: Bot,
      href: '/ai',
      badge: 'Popular',
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'Downloader Hub',
      desc: 'Unduh video & MP3 TikTok, Instagram, YouTube, Spotify',
      icon: Download,
      href: '/downloader',
      badge: 'HD Quality',
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      title: 'Creative Studio',
      desc: 'Meme maker, teks 3D/Neon, Discord banner & Rank card',
      icon: Palette,
      href: '/studio',
      badge: 'Interactive',
      color: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/20',
    },
    {
      title: 'Game & Profile Checker',
      desc: 'Cek nickname MLBB, Free Fire, Genshin & profil medsos',
      icon: ShieldCheck,
      href: '/checker',
      badge: 'Instant Lookup',
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
    {
      title: 'Disposable TempMail',
      desc: 'Email sementara 1-klik dengan kotak masuk auto-polling',
      icon: Wrench,
      href: '/tools',
      badge: 'Privacy First',
      color: 'from-rose-600 to-red-600',
      shadow: 'shadow-rose-500/20',
    },
    {
      title: 'News Feed & Games',
      desc: 'Berita nasional terkini, kuis Tebak Gambar & Primbon',
      icon: Newspaper,
      href: '/news',
      badge: 'Updated Daily',
      color: 'from-cyan-600 to-blue-600',
      shadow: 'shadow-cyan-500/20',
    },
  ];

  // Group items by category / filter
  const allItems: { item: SynoxItem; categoryName: string }[] = [];
  categories.forEach((cat) => {
    if (cat.items && Array.isArray(cat.items)) {
      cat.items.forEach((it) => {
        allItems.push({ item: it, categoryName: cat.name });
      });
    }
  });

  const filteredItems = allItems.filter(({ item, categoryName }) => {
    const matchesTab =
      activeTab === 'All' ||
      categoryName.toLowerCase().includes(activeTab.toLowerCase()) ||
      (item.subfolder && item.subfolder.toLowerCase().includes(activeTab.toLowerCase()));

    const matchesQuery =
      filterQuery.trim() === '' ||
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(filterQuery.toLowerCase()));

    return matchesTab && matchesQuery;
  });

  const categoryTabList = ['All', 'Tools', 'Ai-chat', 'Download', 'Canvas', 'Ephoto', 'Berita', 'Games', 'Stalker', 'Tempmail'];

  const getTargetRoute = (item: SynoxItem) => {
    const sub = (item.subfolder || '').toLowerCase();
    if (sub.includes('ai')) return `/ai?tool=${item.id}`;
    if (sub.includes('download')) return `/downloader?tool=${item.id}`;
    if (sub.includes('canvas') || sub.includes('ephoto') || sub.includes('maker') || sub.includes('edit')) return `/studio?tool=${item.id}`;
    if (sub.includes('stalker') || sub.includes('check')) return `/checker?tool=${item.id}`;
    if (sub.includes('tempmail') || sub.includes('bypass') || sub.includes('tool')) return `/tools?tool=${item.id}`;
    if (sub.includes('berita')) return `/news`;
    if (sub.includes('game') || sub.includes('primbon')) return `/games?tool=${item.id}`;
    return `/tools?tool=${item.id}`;
  };

  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 sm:p-12 md:p-16 text-white border border-indigo-900/50 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Pusat Layanan AI &amp; Multi-Tools Produksi Lengkap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Satu Platform untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Semua AI &amp; Kebutuhan Digital
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Akses langsung tanpa syarat rumit ke lebih dari {totalCount || 400}+ peralatan AI, downloader media tanpa watermark, studio pembuat meme &amp; teks 3D, hingga pengecek akun game interaktif.
          </p>

          {/* Global Search Input */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Cari fitur instan (contoh: TikTok, Claude, Meme, MLBB)..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md text-sm font-medium shadow-xl"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200">
                Instan Filter
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>400+ Active Endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bebas CORS &amp; Server Cached</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Antarmuka End-User Bersih</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HUB CARDS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" /> Modul Fitur Unggulan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pilih kategori modul langsung untuk mulai berinteraksi secara mudah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickHubCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg ${card.shadow}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Buka Modul</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DYNAMIC CATALOG GRID SECTION */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Grid className="w-6 h-6 text-indigo-500" /> Katalog Fitur Dinamis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Menampilkan {filteredItems.length} dari {allItems.length} endpoint yang siap digunakan secara langsung.
            </p>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categoryTabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Items */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-semibold">Tidak ada fitur yang cocok dengan pencarian Anda.</p>
            <p className="text-xs mt-1">Coba bersihkan filter atau kata kunci di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.slice(0, 36).map(({ item, categoryName }) => (
              <Link
                key={item.id + item.name}
                href={getTargetRoute(item)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                      {item.subfolder || categoryName}
                    </span>
                    <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc || 'Fitur interaktif siap pakai'}
                  </p>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Jalankan</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
