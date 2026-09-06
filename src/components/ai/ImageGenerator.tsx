'use client';

import { useState } from 'react';
import { Sparkles, Download, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('seedream-4.0');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios = ['1:1', '16:9', '9:16'];
  const generators = [
    { id: 'seedream-4.0', name: 'SeeDream 4.0 (Ultra HD)' },
    { id: 'quillbot-txt2img', name: 'Quillbot Text2Img' },
    { id: 'text-2-image', name: 'Anime & Art Diffusion' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      let url = '';
      if (model === 'seedream-4.0') {
        url = `/api/synox/ai-generate/seedream-4.0?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(aspectRatio)}&quality=1K`;
      } else if (model === 'quillbot-txt2img') {
        url = `/api/synox/ai-generate/quillbot-txt2img?prompt=${encodeURIComponent(prompt)}&aspectRatio=${encodeURIComponent(aspectRatio)}`;
      } else {
        url = `/api/synox/ai-generate/text-2-image?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(aspectRatio)}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Gagal membuat gambar (HTTP ${res.status})`);
      }

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.url) setImageUrl(data.url);
        else if (data.result) setImageUrl(data.result);
        else if (data.image) setImageUrl(data.image);
        else if (data.status === false || data.error) throw new Error(data.message || 'Layanan generator sedang sibuk.');
        else throw new Error('Format respon gambar tidak valid.');
      } else {
        // Direct binary blob image
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat merender gambar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Image Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ubah deskripsi teks menjadi visual grafis realistis &amp; karya seni digital.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Model Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Pilih Engine Model AI
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {generators.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setModel(g.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  model === g.id
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Prompt Deskripsi Teks
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Contoh: A futuristic cyberpunk city at night with neon lights and flying cars, hyper-realistic, 8k..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Aspek Rasio Gambar
          </label>
          <div className="flex items-center gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  aspectRatio === ratio
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Merender Gambar AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Gambar Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Gallery & Download */}
      {imageUrl && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Hasil Render Gambar
          </h4>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group">
            {/* eslint-disable-next-html-loader */}
            <img src={imageUrl} alt="AI Generated" className="w-full h-auto object-contain max-h-[500px]" />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a
                href={imageUrl}
                download="synox-ai-generated.png"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Download className="w-4 h-4" /> Unduh Gambar High-Res
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
