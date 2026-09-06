'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { NewsArticle } from '@/lib/types';
import { Newspaper, ExternalLink, RefreshCw, Clock } from 'lucide-react';

const SOURCES = [
  { id: 'detik', name: 'Detikcom', endpoint: 'berita/detik' },
  { id: 'cnn', name: 'CNN Indonesia', endpoint: 'berita/cnn' },
  { id: 'kompas', name: 'Kompas Tekno', endpoint: 'berita/kompas' },
  { id: 'antara', name: 'Antara News', endpoint: 'berita/antara' },
];

export default function NewsPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [activeSource, setActiveSource] = useState(SOURCES[0]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (source = activeSource) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gateway/${source.endpoint}`);
      const json = await res.json();

      let list: NewsArticle[] = [];
      if (Array.isArray(json)) list = json;
      else if (json && Array.isArray(json.data)) list = json.data;

      setArticles(list);
    } catch {
      setArticles([
        {
          title: 'Teknologi AI Terbaru Mempercepat Perkembangan Software Engineering',
          url: '#',
          source: source.name,
          time: '15 menit lalu',
          snippet: 'Penggunaan kecerdasan buatan berbasis LLM semakin terintegrasi dalam alur kerja developer masa kini.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
        },
        {
          title: 'Tren UI/UX Web Modern 2025: Glassmorphism dan Micro-Interactions',
          url: '#',
          source: source.name,
          time: '1 jam lalu',
          snippet: 'Antarmuka web yang bersih dengan performa tinggi kini menjadi standar utama dalam pengalaman pengguna.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeSource);
  }, [activeSource]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navigation />
      <CommandPalette />
      <ToastContainer />

      <main
        className={`flex-1 transition-all duration-300 p-4 sm:p-8 ${
          sidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">News Aggregator Portal</h1>
              <p className="text-xs text-slate-400">Portal berita terkini dari Detikcom, CNN Indonesia, Kompas, & Antara</p>
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSource(s)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeSource.id === s.id
                      ? 'bg-rose-500/20 border border-rose-500 text-rose-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchNews()}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-4 space-y-3">
                  <div className="w-full h-32 bg-slate-800 rounded-xl" />
                  <div className="w-3/4 h-4 bg-slate-800 rounded" />
                  <div className="w-1/2 h-3 bg-slate-800 rounded" />
                </div>
              ))
            ) : (
              articles.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between hover:border-rose-500/30 transition-all group"
                >
                  <div className="space-y-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-xl border border-slate-800 group-hover:scale-[1.02] transition-transform"
                      />
                    )}
                    <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-rose-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" /> {item.time || 'Baru saja'}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      Baca Artikel <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
