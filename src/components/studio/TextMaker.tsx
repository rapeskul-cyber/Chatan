'use client';

import { useState } from 'react';
import { Type, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';

export function TextMaker() {
  const [text, setText] = useState('SYNOX HUB');
  const [effect, setEffect] = useState('makingneon');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effects = [
    { id: 'makingneon', name: 'Neon Glow', category: 'Ephoto' },
    { id: 'luxurygold', name: '3D Luxury Gold', category: 'Ephoto' },
    { id: 'glitchtext', name: 'Cyber Glitch', category: 'Ephoto' },
    { id: 'blackpinkstyle', name: 'Blackpink Logo', category: 'Ephoto' },
    { id: 'typographytext', name: 'Typography Poster', category: 'Ephoto' },
    { id: 'underwatertext', name: '3D Underwater', category: 'Ephoto' },
  ];

  const handleGenerateTextEffect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const endpointPath = `/api/synox/ephoto/${effect}?text=${encodeURIComponent(text.trim())}`;
      const res = await fetch(endpointPath);

      if (!res.ok) {
        throw new Error(`Gagal merender efek teks (HTTP ${res.status})`);
      }

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.url) setImageUrl(data.url);
        else if (data.result) setImageUrl(data.result);
        else if (data.image) setImageUrl(data.image);
        else throw new Error(data.message || 'Gagal memproses efek teks.');
      } else {
        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
          <Type className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">3D &amp; Neon Text Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buat logo teks kustom dengan efek Neon, 3D Gold, Glitch, dan Graffiti secara cepat.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerateTextEffect} className="space-y-4">
        {/* Effect Style Chooser */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Pilih Gaya Efek Visual Teks
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {effects.map((eff) => (
              <button
                key={eff.id}
                type="button"
                onClick={() => setEffect(eff.id)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  effect === eff.id
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {eff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Input Teks Judul/Nama
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik teks di sini (contoh: SYNOX HUB)"
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Membuat Efek Teks...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Render Efek Teks</span>
            </>
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Output */}
      {imageUrl && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hasil Render Efek Teks
          </span>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2">
            {/* eslint-disable-next-html-loader */}
            <img src={imageUrl} alt="3D Text Effect" className="w-full h-auto rounded-xl mx-auto max-h-[400px] object-contain" />
          </div>
          <a
            href={imageUrl}
            download={`synox-text-${effect}.png`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all"
          >
            <Download className="w-4 h-4" /> Unduh Gambar HD
          </a>
        </div>
      )}
    </div>
  );
}
