'use client';

import { useState } from 'react';
import { Link2, Copy, Check, RefreshCw, AlertCircle, ExternalLink, ShieldAlert } from 'lucide-react';

export function LinkTool() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'shorten' | 'bypass'>('shorten');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '';
      if (mode === 'shorten') {
        endpoint = `/api/synox/tools/url-shortener?url=${encodeURIComponent(url.trim())}`;
      } else {
        endpoint = `/api/synox/bypass/bypass-izen?url=${encodeURIComponent(url.trim())}&force=false`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Gagal memproses tautan (HTTP ${res.status})`);
      }

      const data = await res.json();

      let finalUrl = '';
      if (typeof data === 'string') finalUrl = data;
      else if (data.shortened || data.short_url || data.url) finalUrl = data.shortened || data.short_url || data.url;
      else if (data.bypassed || data.result) finalUrl = data.bypassed || data.result;
      else throw new Error(data.message || 'Gagal mengurai tautan.');

      setResult(finalUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses tautan.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20">
          <Link2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Shortlink &amp; Link Bypasser</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pemendek tautan cepat dan pengurai shortlink iklan otomatis tanpa menunggu timer.
          </p>
        </div>
      </div>

      <form onSubmit={handleProcessLink} className="space-y-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('shorten')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shorten'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Pendekkan Tautan (Shortener)
          </button>
          <button
            type="button"
            onClick={() => setMode('bypass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'bypass'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Bypass Shortlink Iklan
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            URL Tautan
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full pl-4 pr-32 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!url.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
              <span>{mode === 'shorten' ? 'Proses Link' : 'Bypass Link'}</span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hasil Tautan</span>
            <a
              href={result}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span className="truncate max-w-[300px] sm:max-w-[400px]">{result}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-600/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
