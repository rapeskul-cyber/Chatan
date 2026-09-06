'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Search, ExternalLink, RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface NewsItem {
  title: string;
  link?: string;
  url?: string;
  cover?: string;
  image?: string;
  date?: string;
  category?: string;
  description?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [source, setSource] = useState('tribunnews');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const sources = [
    { id: 'tribunnews', name: 'Tribunnews Portal' },
    { id: 'ff-news', name: 'Free Fire & Esports News' },
    { id: 'jkt48-news', name: 'JKT48 News Feed' },
  ];

  useEffect(() => {
    setLoading(true);
    let endpoint = `/api/synox/berita/${source}`;
    if (source === 'ff-news') endpoint += '?limit=12';
    if (source === 'jkt48-news') endpoint += '?page=1';

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        let items: NewsItem[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray(data.result)) {
          items = data.result;
        } else if (data && Array.isArray(data.data)) {
          items = data.data;
        } else {
          // Fallback static structured news list
          items = [
            {
              title: 'Teknologi AI Terbaru Mempermudah Akses Produktivitas Digital',
              url: 'https://detik.com',
              date: new Date().toLocaleDateString('id-ID'),
              description: 'Inovasi REST API dan kecerdasan buatan semakin terjangkau bagi pengguna umum.',
              category: 'Teknologi',
            },
            {
              title: 'Update Patch Game & Turnamen Esports Internasional Pekan Ini',
              url: 'https://cnnindonesia.com',
              date: new Date().toLocaleDateString('id-ID'),
              description: 'Pemain tim nasional bersiap menghadapi babak kualifikasi turnamen.',
              category: 'Esports',
            },
          ];
        }
        setNews(items);
      })
      .catch(() => {
        setNews([]);
      })
      .finally(() => setLoading(false));
  }, [source]);

  const filteredNews = news.filter((item) => {
    if (!search.trim()) return true;
    return item.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-cyan-950 to-slate-900 border border-blue-800/50 shadow-xl text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>News Portal &amp; Information Feed</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Portal Berita Terkini &amp; Informasi Publik
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Kumpulan berita nasional terbaru, informasi turnamen esports, serta kabar hangat yang diperbarui secara langsung.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                source === s.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul berita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-400">
          <Newspaper className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-semibold">Tidak ada berita yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, idx) => {
            const targetUrl = item.link || item.url || '#';
            const img = item.cover || item.image;
            return (
              <a
                key={idx}
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {img && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-html-loader */}
                      <img
                        src={img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span>{item.date || 'Terbaru'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Baca Selengkapnya</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
