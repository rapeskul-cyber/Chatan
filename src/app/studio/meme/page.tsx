'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Smile, Download, RefreshCw, Wand2, Image as ImageIcon } from 'lucide-react';

const PRESET_MEMES = [
  { name: 'Deploy Prod Error 500', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80', top: 'DEPLOY KE PROD', bottom: 'TAPI ERROR 500' },
  { name: 'Vibe Coding AI', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', top: 'GAK BISA CODING', bottom: 'TAPI PAKAI AI' },
  { name: 'Client Request', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80', top: 'MINTA CEPAT', bottom: 'BUDGET MINIMAL' },
];

export default function MemeStudioPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [imageUrl, setImageUrl] = useState(PRESET_MEMES[0].url);
  const [topText, setTopText] = useState(PRESET_MEMES[0].top);
  const [bottomText, setBottomText] = useState(PRESET_MEMES[0].bottom);
  const [loading, setLoading] = useState(false);
  const [renderedMemeUrl, setRenderedMemeUrl] = useState<string | null>(null);

  const handleGenerateMeme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || loading) return;

    setLoading(true);
    const targetPath = `/api/gateway/canvas/custom-meme?url=${encodeURIComponent(
      imageUrl
    )}&topText=${encodeURIComponent(topText)}&bottomText=${encodeURIComponent(bottomText)}`;

    try {
      const res = await fetch(targetPath);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('image/')) {
        const blob = await res.blob();
        setRenderedMemeUrl(URL.createObjectURL(blob));
      } else {
        setRenderedMemeUrl(targetPath);
      }
      addToast('Meme berhasil dibuat!', 'success');
    } catch {
      setRenderedMemeUrl(targetPath);
      addToast('Meme ditampilkan via stream canvas.', 'info');
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
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">Custom Meme Studio</h1>
              <p className="text-xs text-slate-400">Buat meme lucu dengan teks kustom dalam hitungan detik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Preset Template Meme
                </label>
                <div className="space-y-2">
                  {PRESET_MEMES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setTopText(preset.top);
                        setBottomText(preset.bottom);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-xs font-medium text-slate-300 hover:text-slate-100 transition-all flex items-center justify-between"
                    >
                      <span>{preset.name}</span>
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateMeme} className="space-y-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    URL Gambar Kustom
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://placehold.co/600x400.png"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Teks Atas (Top Text)
                  </label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 uppercase font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Teks Bawah (Bottom Text)
                  </label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 uppercase font-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Render Canvas Meme</span>
                </button>
              </form>
            </div>

            {/* Preview Canvas Column */}
            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" /> Preview Canvas
                  </span>
                  {renderedMemeUrl && (
                    <a
                      href={renderedMemeUrl}
                      download="meme_synox.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Meme
                    </a>
                  )}
                </div>

                <div className="w-full h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                  {renderedMemeUrl ? (
                    <img
                      src={renderedMemeUrl}
                      alt="Meme"
                      className="w-full h-full object-contain"
                      onError={() => setRenderedMemeUrl('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80')}
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Smile className="w-10 h-10 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-500">Klik "Render Canvas Meme" untuk melihat visual</p>
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
