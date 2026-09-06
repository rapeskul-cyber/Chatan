'use client';

import { Download, Sparkles } from 'lucide-react';
import { MediaDownloader } from '@/components/downloader/MediaDownloader';

export default function DownloaderPage() {
  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800/50 shadow-xl text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Social Media Downloader Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Unduh Video HD &amp; Audio MP3 Tanpa Watermark
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Platform pengunduh otomatis universal untuk TikTok, Instagram Reels, YouTube Video, dan Spotify Track. Hasil jernih &amp; cepat tanpa instalasi aplikasi tambahan.
        </p>
      </div>

      {/* Downloader Component */}
      <MediaDownloader />
    </div>
  );
}
