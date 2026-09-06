'use client';

import { useState } from 'react';
import { CreditCard, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';

export function CardMaker() {
  const [username, setUsername] = useState('SaurusGege');
  const [quote, setQuote] = useState('Jangan pernah menyerah pada impianmu!');
  const [avatar, setAvatar] = useState('https://c.top4top.io/p_3815w0ycy1.jpg');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const endpoint = `/api/synox/canvas/quotes-v2?author=${encodeURIComponent(username.trim())}&text=${encodeURIComponent(quote.trim())}&pp=${encodeURIComponent(avatar.trim())}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`Gagal membuat kartu banner (HTTP ${res.status})`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.url) setImageUrl(data.url);
        else if (data.result) setImageUrl(data.result);
        else throw new Error(data.message || 'Gagal merender kartu banner.');
      } else {
        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat kartu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Discord Welcome &amp; Rank Card Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buat kartu nama komunitas, quote card, dan profil custom dengan avatar &amp; nama pengguna.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerateCard} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username / Author Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: SaurusGege"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL Profil Avatar (PNG/JPG)
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Pesan Quote / Subtitle Kartu
          </label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Tulis pesan atau status Anda di sini..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={!username.trim() || loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Membuat Kartu Banner...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Card Custom</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {imageUrl && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hasil Kartu Banner Profile
          </span>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2">
            {/* eslint-disable-next-html-loader */}
            <img src={imageUrl} alt="Card Preview" className="w-full h-auto rounded-xl mx-auto max-h-[400px] object-contain" />
          </div>
          <a
            href={imageUrl}
            download="synox-profile-card.png"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-4 h-4" /> Unduh Banner Kartu
          </a>
        </div>
      )}
    </div>
  );
}
