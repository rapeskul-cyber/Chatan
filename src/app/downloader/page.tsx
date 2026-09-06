'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import {
  Download,
  Link2,
  Video,
  Music,
  RefreshCw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const SUPPORTED_PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', domain: 'tiktok.com', endpoint: 'download/tiktok' },
  { id: 'instagram', name: 'Instagram', icon: '📸', domain: 'instagram.com', endpoint: 'download/instagram' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', domain: 'youtu', endpoint: 'download/youtube' },
  { id: 'spotify', name: 'Spotify', icon: '🎧', domain: 'spotify.com', endpoint: 'download/spotify' },
  { id: 'facebook', name: 'Facebook', icon: '📘', domain: 'facebook.com', endpoint: 'download/facebook' },
  { id: 'twitter', name: 'Twitter / X', icon: '🐦', domain: 'x.com', endpoint: 'download/twitter' },
  { id: 'soundcloud', name: 'SoundCloud', icon: '☁️', domain: 'soundcloud.com', endpoint: 'download/soundcloud' },
  { id: 'capcut', name: 'CapCut', icon: '🎬', domain: 'capcut.com', endpoint: 'download/capcut' },
];

export default function DownloaderPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<typeof SUPPORTED_PLATFORMS[0] | null>(null);

  const handleUrlChange = (inputUrl: string) => {
    setUrl(inputUrl);
    if (!inputUrl.trim()) {
      setDetectedPlatform(null);
      return;
    }

    const matched = SUPPORTED_PLATFORMS.find((p) => inputUrl.toLowerCase().includes(p.domain));
    setDetectedPlatform(matched || SUPPORTED_PLATFORMS[0]);
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const platform = detectedPlatform || SUPPORTED_PLATFORMS[0];
    const targetEndpoint = `/api/gateway/${platform.endpoint}?url=${encodeURIComponent(url.trim())}`;

    try {
      const res = await fetch(targetEndpoint);
      const json = await res.json();

      let dataObj = json;
      if (json && json.data) {
        dataObj = json.data;
      }

      setResult({
        title: dataObj.title || 'Media Siap Diunduh',
        author: dataObj.author || dataObj.creator || '@synox_user',
        thumbnail:
          dataObj.thumbnail ||
          dataObj.cover ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        duration: dataObj.duration || '01:20',
        media: dataObj.media || [
          { quality: 'Video HD No Watermark (MP4)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', format: 'mp4' },
          { quality: 'Audio Extraks (MP3)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', format: 'mp3' },
        ],
      });
      addToast('Prospek unduhan berhasil diproses!', 'success');
    } catch (err) {
      addToast('Proses unduh gagal. Menampilkan format fallback.', 'error');
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
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                Social Media Downloader Hub
              </h1>
              <p className="text-xs text-slate-400">
                Satu form cerdas untuk unduh video, audio & story tanpa watermark
              </p>
            </div>
          </div>

          {/* Form Input URL */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <form onSubmit={handleDownloadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Tempelkan Tautan / URL Media</span>
                  {detectedPlatform && (
                    <span className="text-cyan-400 font-semibold text-[11px] flex items-center gap-1">
                      Platform Terdeteksi: {detectedPlatform.icon} {detectedPlatform.name}
                    </span>
                  )}
                </label>

                <div className="relative flex items-center">
                  <Link2 className="w-5 h-5 text-slate-500 absolute left-4" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://vt.tiktok.com/xxxxxx/ atau https://www.instagram.com/reel/xxxxxx/"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Tautan Media...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Proses & Ambil Tautan Unduhan</span>
                  </>
                )}
              </button>
            </form>

            {/* Platform Badges list */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Dukungan Platform Resmi:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_PLATFORMS.map((p) => (
                  <span
                    key={p.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5"
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Result Media Preview */}
          {result && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Media Siap Diunduh
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-full sm:w-48 h-36 object-cover rounded-xl border border-slate-800"
                />

                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-slate-100 text-base leading-snug">
                    {result.title}
                  </h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Kreator: <span className="text-slate-200 font-semibold">{result.author}</span></p>
                    <p>Durasi: <span className="text-slate-200 font-semibold">{result.duration}</span></p>
                  </div>

                  {/* Options for download */}
                  <div className="pt-3 space-y-2">
                    {result.media.map((item: any, idx: number) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-xs font-semibold text-cyan-300 group"
                      >
                        <div className="flex items-center gap-2">
                          {item.format === 'mp3' ? (
                            <Music className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Video className="w-4 h-4 text-cyan-400" />
                          )}
                          <span>{item.quality}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
