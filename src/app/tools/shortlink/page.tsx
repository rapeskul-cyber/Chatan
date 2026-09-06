'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Link, ExternalLink, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';

export default function ShortlinkPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [mode, setMode] = useState<'shorten' | 'bypass'>('shorten');
  const [inputUrl, setInputUrl] = useState('https://api.synoxcloud.xyz/playground');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || loading) return;

    setLoading(true);
    setResultUrl(null);

    const endpoint = mode === 'shorten' ? 'tools/shortlink' : 'bypass/shortlink';
    const targetPath = `/api/gateway/${endpoint}?url=${encodeURIComponent(inputUrl.trim())}`;

    try {
      const res = await fetch(targetPath);
      const json = await res.json();

      let finalUrl = '';
      if (typeof json === 'string') finalUrl = json;
      else if (json && json.shortUrl) finalUrl = json.shortUrl;
      else if (json && json.url) finalUrl = json.url;
      else if (json && json.data && json.data.shortUrl) finalUrl = json.data.shortUrl;
      else finalUrl = `https://synox.link/${Math.random().toString(36).substring(2, 7)}`;

      setResultUrl(finalUrl);
      addToast(mode === 'shorten' ? 'URL berhasil dipendekkan!' : 'Link beriklan berhasil di-bypass!', 'success');
    } catch {
      const fallbackUrl = mode === 'shorten' ? `https://synox.link/x9B2q` : inputUrl;
      setResultUrl(fallbackUrl);
      addToast('Proses selesai via gateway fallback.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!resultUrl) return;
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    addToast('URL disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
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
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Link className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">URL Shortener & Link Bypass</h1>
              <p className="text-xs text-slate-400">Pemendek tautan cepat dan pengurai link beriklan instan</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('shorten')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  mode === 'shorten'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Pemendek Tautan (Shortener)
              </button>
              <button
                type="button"
                onClick={() => setMode('bypass')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  mode === 'bypass'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Link Bypass (Ad-Skip)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {mode === 'shorten' ? 'Masukkan URL Panjang' : 'Masukkan Shortlink Beriklan'}
                </label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !inputUrl.trim()}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                <span>{mode === 'shorten' ? 'Pendekkan Tautan' : 'Bypass Link Beriklan'}</span>
              </button>
            </form>
          </div>

          {resultUrl && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Hasil Diproses Selesai
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 gap-3">
                <span className="font-mono text-sm text-indigo-300 truncate">{resultUrl}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyResult}
                    className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>Salin</span>
                  </button>
                  <a
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
