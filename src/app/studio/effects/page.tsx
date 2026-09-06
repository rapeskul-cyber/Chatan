'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Wand2, Download, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';

const EPHOTO_EFFECTS = [
  { id: 'neon', name: 'Neon Light Glowing', endpoint: 'ephoto/neon-text', textDefault: 'SYNOX CLOUD' },
  { id: 'gold', name: '3D Golden Metallic', endpoint: 'ephoto/gold-text', textDefault: 'VIP ACCESS' },
  { id: 'glitch', name: 'Glitch Cyberpunk', endpoint: 'ephoto/glitch-text', textDefault: 'VIBE CODING' },
  { id: 'graffiti', name: 'Graffiti Wall Text', endpoint: 'ephoto/graffiti-text', textDefault: 'URBAN ART' },
  { id: 'galaxy', name: 'Galaxy Space Text', endpoint: 'ephoto/galaxy-text', textDefault: 'COSMOS' },
];

export default function TextEffectsPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [selectedEffect, setSelectedEffect] = useState(EPHOTO_EFFECTS[0]);
  const [text, setText] = useState(EPHOTO_EFFECTS[0].textDefault);
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleGenerateEffect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    const targetPath = `/api/gateway/${selectedEffect.endpoint}?text=${encodeURIComponent(text.trim())}`;

    try {
      const res = await fetch(targetPath);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('image/')) {
        const blob = await res.blob();
        setOutputUrl(URL.createObjectURL(blob));
      } else {
        setOutputUrl(targetPath);
      }
      addToast('Efek teks berhasil dibuat!', 'success');
    } catch {
      setOutputUrl(targetPath);
      addToast('Efek teks ditampilkan via stream.', 'info');
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
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">3D Text Effect Designer</h1>
              <p className="text-xs text-slate-400">Generator efek teks 3D Neon, Gold, Glitch Cyberpunk & Graffiti</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Options Form */}
            <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Pilih Gaya Efek Teks
                </label>
                <div className="space-y-2">
                  {EPHOTO_EFFECTS.map((eff) => (
                    <button
                      key={eff.id}
                      type="button"
                      onClick={() => {
                        setSelectedEffect(eff);
                        setText(eff.textDefault);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedEffect.id === eff.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{eff.name}</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateEffect} className="space-y-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Input Teks Anda
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="SYNOX CLOUD"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Generate Efek Teks 3D</span>
                </button>
              </form>
            </div>

            {/* Render Display */}
            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" /> Output Hasil 3D
                  </span>
                  {outputUrl && (
                    <a
                      href={outputUrl}
                      download="text_effect.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Gambar 3D
                    </a>
                  )}
                </div>

                <div className="w-full h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                  {outputUrl ? (
                    <img
                      src={outputUrl}
                      alt="3D Text Effect"
                      className="w-full h-full object-contain"
                      onError={() =>
                        setOutputUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80')
                      }
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Wand2 className="w-10 h-10 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-500">
                        Pilih gaya lalu klik "Generate Efek Teks 3D"
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
