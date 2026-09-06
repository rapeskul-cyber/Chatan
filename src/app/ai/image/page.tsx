'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import {
  Sparkles,
  Download,
  Ratio,
  Wand2,
  Image as ImageIcon,
  RefreshCw,
  Eye,
} from 'lucide-react';

const GENERATION_TYPES = [
  { id: 'text2img', name: 'Flux AI (General)', endpoint: 'ai-generate/text2img', promptDefault: 'Cyberpunk hacker workstation neon light 8k' },
  { id: 'anime-art', name: 'Anime Art Generator', endpoint: 'ai-generate/anime-art', promptDefault: '1girl hoodie purple hair futuristic city masterpiece' },
  { id: 'portrait', name: 'Realistic Portrait AI', endpoint: 'ai-generate/portrait', promptDefault: 'Close up cinematic portrait developer studio lighting' },
  { id: 'logo', name: 'AI Logo Designer', endpoint: 'ai-generate/logo', promptDefault: 'Minimalist tech company logo gradient modern' },
];

const ASPECT_RATIOS = [
  { label: '16:9 (Landscape)', value: '16:9' },
  { label: '1:1 (Square)', value: '1:1' },
  { label: '9:16 (Portrait)', value: '9:16' },
];

export default function AIImagePage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [selectedType, setSelectedType] = useState(GENERATION_TYPES[0]);
  const [prompt, setPrompt] = useState(GENERATION_TYPES[0].promptDefault);
  const [ratio, setRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    const targetPath = `/api/gateway/${selectedType.endpoint}?prompt=${encodeURIComponent(
      prompt.trim()
    )}&ratio=${encodeURIComponent(ratio)}`;

    try {
      // Test fetch through BFF Gateway
      const res = await fetch(targetPath);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('image/')) {
        const blob = await res.blob();
        const localBlobUrl = URL.createObjectURL(blob);
        setImageUrl(localBlobUrl);
      } else {
        const json = await res.json();
        if (json && json.data && typeof json.data === 'string') {
          setImageUrl(json.data);
        } else {
          // Direct image preview fallback
          setImageUrl(targetPath);
        }
      }
      addToast('Gambar AI berhasil dirender!', 'success');
    } catch (err) {
      // Direct render URL fallback if blob fetch gets interrupted
      setImageUrl(targetPath);
      addToast('Gambar ditampilkan melalui live render stream.', 'info');
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">AI Art & Image Generator</h1>
              <p className="text-xs text-slate-400">Ubah ide teks Anda menjadi gambar visual berkualitas tinggi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Generation Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Model AI Generator
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENERATION_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setSelectedType(type);
                          setPrompt(type.promptDefault);
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                          selectedType.id === type.id
                            ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Ratio className="w-3.5 h-3.5 text-purple-400" /> Rasio Gambar
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRatio(r.value)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          ratio === r.value
                            ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Prompt Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Deskripsi Teks (Prompt)
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Contoh: Cyberpunk hacker workstation neon light 8k..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sedang Merender Gambar...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Gambar AI</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Render Preview Column */}
            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" /> Hasil Render AI
                  </span>
                  {imageUrl && (
                    <a
                      href={imageUrl}
                      download="synox_ai_art.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Gambar
                    </a>
                  )}
                </div>

                <div className="w-full h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                  {loading ? (
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto animate-spin">
                        <RefreshCw className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-400">Merender visual berdasarkan prompt...</p>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="AI Generated"
                      className="w-full h-full object-contain rounded-xl"
                      onError={() => {
                        setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
                      }}
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <ImageIcon className="w-10 h-10 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-500">
                        Isi prompt di sebelah kiri lalu klik "Generate Gambar AI" untuk melihat hasil
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between mt-4">
                <span>Model Aktif: {selectedType.name}</span>
                <span>Rasio: {ratio}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
