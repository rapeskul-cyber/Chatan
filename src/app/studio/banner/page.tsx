'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Image as ImageIcon, Download, RefreshCw, Wand2, Shield, Award } from 'lucide-react';

const BANNER_TYPES = [
  { id: 'welcome', name: 'Welcome Banner Member', endpoint: 'canvas/welcome', defaultTitle: 'Selamat Datang!' },
  { id: 'goodbye', name: 'Goodbye Banner Member', endpoint: 'canvas/goodbye', defaultTitle: 'Sampai Jumpa!' },
  { id: 'rank', name: 'Discord Rank Level Card', endpoint: 'canvas/rank', defaultTitle: 'Level 25 - Rank 1' },
];

export default function BannerStudioPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [selectedBanner, setSelectedBanner] = useState(BANNER_TYPES[0]);
  const [username, setUsername] = useState('RapEskul');
  const [guildName, setGuildName] = useState('DevCommunity');
  const [avatar, setAvatar] = useState('https://placehold.co/128x128.png');
  const [level, setLevel] = useState('25');
  const [rank, setRank] = useState('1');
  const [loading, setLoading] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);

  const handleGenerateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    let targetPath = `/api/gateway/${selectedBanner.endpoint}?avatar=${encodeURIComponent(
      avatar
    )}&username=${encodeURIComponent(username)}`;

    if (selectedBanner.id === 'rank') {
      targetPath += `&level=${encodeURIComponent(level)}&rank=${encodeURIComponent(rank)}`;
    } else {
      targetPath += `&guildName=${encodeURIComponent(guildName)}`;
    }

    try {
      const res = await fetch(targetPath);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('image/')) {
        const blob = await res.blob();
        setRenderedUrl(URL.createObjectURL(blob));
      } else {
        setRenderedUrl(targetPath);
      }
      addToast('Banner / Card komunitas berhasil dirender!', 'success');
    } catch {
      setRenderedUrl(targetPath);
      addToast('Banner ditampilkan via stream canvas.', 'info');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">Discord Banner & Rank Card Maker</h1>
              <p className="text-xs text-slate-400">Desain Welcome/Goodbye banner dan Rank level card untuk komunitas Anda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Tipe Card / Banner
                </label>
                <div className="space-y-2">
                  {BANNER_TYPES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBanner(b)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedBanner.id === b.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{b.name}</span>
                      <Award className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateBanner} className="space-y-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {selectedBanner.id !== 'rank' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Nama Server / Komunitas
                    </label>
                    <input
                      type="text"
                      value={guildName}
                      onChange={(e) => setGuildName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Level
                      </label>
                      <input
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Rank
                      </label>
                      <input
                        type="number"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    URL Avatar Gambar
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Generate Banner Card</span>
                </button>
              </form>
            </div>

            {/* Output Canvas Column */}
            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" /> Output Design Card
                  </span>
                  {renderedUrl && (
                    <a
                      href={renderedUrl}
                      download="discord_banner.png"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Card
                    </a>
                  )}
                </div>

                <div className="w-full h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                  {renderedUrl ? (
                    <img
                      src={renderedUrl}
                      alt="Banner Card"
                      className="w-full h-full object-contain"
                      onError={() => setRenderedUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80')}
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Shield className="w-10 h-10 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-500">
                        Isi form lalu klik "Generate Banner Card"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
