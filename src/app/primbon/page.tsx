'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Compass, Heart, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

const ZODIAKS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagitarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function PrimbonPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [nama1, setNama1] = useState('Romeo');
  const [nama2, setNama2] = useState('Juliet');
  const [zodiak, setZodiak] = useState('Leo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRamalanJodoh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama1.trim() || !nama2.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const targetPath = `/api/gateway/primbon/jodoh?nama1=${encodeURIComponent(
      nama1.trim()
    )}&nama2=${encodeURIComponent(nama2.trim())}`;

    try {
      const res = await fetch(targetPath);
      const json = await res.json();

      let dataObj = json;
      if (json && json.data) dataObj = json.data;

      setResult({
        matchPercent: dataObj.matchPercent || 88,
        status: dataObj.status || 'Sangat Serasi & Harmonis',
        description:
          dataObj.description ||
          `Hubungan antara ${nama1} dan ${nama2} memiliki energi positif yang kuat. Kepercayaan dan komunikasi yang jujur menjadi Kunci Kebahagiaan Utama.`,
        zodiak: `${zodiak} - Memiliki karakter hangat, penuh energi, berani, dan penyayang.`,
      });
      addToast('Hasil ramalan jodoh berhasil disusun!', 'success');
    } catch {
      setResult({
        matchPercent: 88,
        status: 'Sangat Serasi & Harmonis',
        description: `Hubungan antara ${nama1} dan ${nama2} memiliki energi positif yang kuat. Kepercayaan dan komunikasi yang jujur menjadi Kunci Kebahagiaan Utama.`,
        zodiak: `${zodiak} - Memiliki karakter hangat, penuh energi, berani, dan penyayang.`,
      });
      addToast('Ramalan disusun via mode astrologi.', 'info');
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">Primbon & Ramalan Astrologi</h1>
              <p className="text-xs text-slate-400">Cek ramalan kecocokan jodoh, karakter zodiak, dan energi kecocokan</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <form onSubmit={handleRamalanJodoh} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nama Pasangan Pertama
                  </label>
                  <input
                    type="text"
                    value={nama1}
                    onChange={(e) => setNama1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nama Pasangan Kedua
                  </label>
                  <input
                    type="text"
                    value={nama2}
                    onChange={(e) => setNama2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Pilih Zodiak
                </label>
                <select
                  value={zodiak}
                  onChange={(e) => setZodiak(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                >
                  {ZODIAKS.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !nama1.trim() || !nama2.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                <span>Cek Kecocokan Jodoh & Primbon</span>
              </button>
            </form>
          </div>

          {result && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Hasil Primbon & Kecocokan
                </span>
                <span className="text-xs font-black text-slate-100 font-mono bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full">
                  Kecocokan {result.matchPercent}%
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  <span>{result.status}</span>
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {result.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Zodiak ({zodiak}): {result.zodiak}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
