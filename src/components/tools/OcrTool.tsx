'use client';

import { useState } from 'react';
import { FileText, Copy, Check, RefreshCw, AlertCircle, Sparkles, Upload } from 'lucide-react';

export function OcrTool() {
  const [imageUrl, setImageUrl] = useState('');
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtractText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || loading) return;

    setLoading(true);
    setError(null);
    setExtractedText(null);

    try {
      const endpoint = `/api/synox/tools/ocr?url=${encodeURIComponent(imageUrl.trim())}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`Gagal mengekstrak teks dari gambar (HTTP ${res.status})`);
      }

      const data = await res.json();

      let text = '';
      if (typeof data === 'string') text = data;
      else if (data.text) text = data.text;
      else if (data.result) text = data.result;
      else if (data.data) text = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
      else throw new Error(data.message || 'Teks tidak ditemukan dalam gambar.');

      setExtractedText(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses OCR.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Image to Text (OCR)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekstrak teks tulisan tangan, dokumen, atau tangkapan layar langsung dari tautan gambar.
          </p>
        </div>
      </div>

      <form onSubmit={handleExtractText} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            URL Gambar (PNG/JPG)
          </label>
          <div className="relative">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Tempel tautan gambar di sini (https://...)"
              required
              className="w-full pl-4 pr-32 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!imageUrl.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Ekstrak OCR</span>
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

      {extractedText && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Hasil Ekstraksi Teks (Editable)
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>

          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={6}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
}
