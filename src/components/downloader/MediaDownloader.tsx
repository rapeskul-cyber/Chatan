'use client';

import { useState } from 'react';
import {
  Download,
  Link as LinkIcon,
  Video,
  Music,
  RefreshCw,
  AlertCircle,
  Film,
  Sparkles,
} from 'lucide-react';

interface DownloadResult {
  platform: 'tiktok' | 'instagram' | 'youtube' | 'spotify' | 'generic';
  title?: string;
  author?: string;
  thumbnail?: string;
  duration?: string;
  downloads: {
    label: string;
    url: string;
    type: 'video' | 'audio' | 'image';
    quality?: string;
  }[];
}

export function MediaDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectPlatform = (inputUrl: string): 'tiktok' | 'instagram' | 'youtube' | 'spotify' | 'generic' => {
    const low = inputUrl.toLowerCase();
    if (low.includes('tiktok.com') || low.includes('vt.tiktok')) return 'tiktok';
    if (low.includes('instagram.com') || low.includes('instagr.am')) return 'instagram';
    if (low.includes('youtube.com') || low.includes('youtu.be')) return 'youtube';
    if (low.includes('spotify.com')) return 'spotify';
    return 'generic';
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const platform = detectPlatform(url.trim());

    try {
      let fetchEndpoint = '';
      if (platform === 'tiktok') {
        fetchEndpoint = `/api/synox/download/tiktok?url=${encodeURIComponent(url.trim())}`;
      } else if (platform === 'instagram') {
        fetchEndpoint = `/api/synox/download/instagram?url=${encodeURIComponent(url.trim())}&quality=1080`;
      } else if (platform === 'youtube') {
        fetchEndpoint = `/api/synox/download/youtube?url=${encodeURIComponent(url.trim())}`;
      } else if (platform === 'spotify') {
        fetchEndpoint = `/api/synox/download/spotify?url=${encodeURIComponent(url.trim())}`;
      } else {
        fetchEndpoint = `/api/synox/download/aio-v2?url=${encodeURIComponent(url.trim())}`;
      }

      const primaryRes = await fetch(fetchEndpoint);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = null;

      if (primaryRes.ok) {
        data = await primaryRes.json();
      }

      // If primary endpoint failed or returned no data, attempt Universal AIO fallback
      if (!primaryRes.ok || !data || (data.status === false && platform !== 'generic')) {
        const fallbackEndpoint = `/api/synox/download/aio-v2?url=${encodeURIComponent(url.trim())}`;
        const fallbackRes = await fetch(fallbackEndpoint);
        if (fallbackRes.ok) {
          data = await fallbackRes.json();
        }
      }

      if (!data) {
        throw new Error(`Gagal memproses tautan media. Silakan periksa kembali URL.`);
      }

      // Normalize Synox response structure
      const parsedDownloads: DownloadResult['downloads'] = [];
      let title = 'Media Downloaded';
      let author = 'Unknown Creator';
      let thumbnail = '';
      let duration = '';

      if (data) {
        // Extract Title / Author / Thumbnail
        if (data.title || data.caption) title = data.title || data.caption;
        if (data.author || data.creator || data.nickname) author = data.author || data.creator || data.nickname;
        if (data.cover || data.thumbnail || data.image) thumbnail = data.cover || data.thumbnail || data.image;
        if (data.duration) duration = String(data.duration);

        // Normalize Download links
        if (data.noWatermark || data.nowm || data.video) {
          parsedDownloads.push({
            label: 'Download Video HD (No Watermark)',
            url: data.noWatermark || data.nowm || data.video,
            type: 'video',
            quality: 'HD 1080p',
          });
        }
        if (data.watermark || data.wm) {
          parsedDownloads.push({
            label: 'Download Video (With Watermark)',
            url: data.watermark || data.wm,
            type: 'video',
            quality: 'SD 720p',
          });
        }
        if (data.audio || data.mp3 || data.music) {
          parsedDownloads.push({
            label: 'Download Audio MP3 (High Bitrate)',
            url: data.audio || data.mp3 || data.music,
            type: 'audio',
            quality: '320 kbps',
          });
        }
        if (data.downloads && Array.isArray(data.downloads)) {
          data.downloads.forEach((d: { label?: string; url?: string; type?: string }) => {
            if (d.url) {
              parsedDownloads.push({
                label: d.label || 'Download Media',
                url: d.url,
                type: (d.type as 'video' | 'audio' | 'image') || 'video',
              });
            }
          });
        }
        if (data.result && typeof data.result === 'object') {
          const r = data.result;
          if (r.title) title = r.title;
          if (r.author) author = typeof r.author === 'string' ? r.author : r.author?.name || author;
          if (r.cover || r.thumbnail) thumbnail = r.cover || r.thumbnail;
          if (r.video || r.url) {
            parsedDownloads.push({
              label: 'Download Video Direct',
              url: r.video || r.url,
              type: 'video',
            });
          }
          if (r.audio) {
            parsedDownloads.push({
              label: 'Download Audio Extra',
              url: r.audio,
              type: 'audio',
            });
          }
        }
      }

      // Fallback if no specific links mapped
      if (parsedDownloads.length === 0) {
        if (data.url) {
          parsedDownloads.push({ label: 'Download File Media', url: data.url, type: 'video' });
        } else {
          throw new Error('Media tidak ditemukan atau link tidak valid.');
        }
      }

      setResult({
        platform,
        title,
        author,
        thumbnail,
        duration,
        downloads: parsedDownloads,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses tautan.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Downloader Input Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Smart URL Downloader</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tempelkan tautan dari TikTok, Instagram, YouTube, atau Spotify. Sistem akan memetakan otomatis.
            </p>
          </div>
        </div>

        <form onSubmit={handleDownloadSubmit} className="space-y-4">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Tempel tautan video/audio di sini (contoh: https://vt.tiktok.com/...)"
              required
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium shadow-sm"
            />
            <button
              type="submit"
              disabled={!url.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ekstrak Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Dukungan Platform:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              TikTok (No Watermark)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              Instagram Reels &amp; Posts
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              YouTube Video/Audio
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              Spotify Audio
            </span>
          </div>
        </form>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {result.thumbnail ? (
              <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                {/* eslint-disable-next-html-loader */}
                <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-mono text-white/90 bg-slate-900/80 px-2 py-0.5 rounded">
                    {result.platform.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full sm:w-48 h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-slate-400">
                <Film className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {result.platform} Media Ready
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {result.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Kreator / Artis: <span className="text-slate-700 dark:text-slate-200 font-semibold">{result.author}</span>
              </p>

              {/* Download Buttons List */}
              <div className="pt-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Opsi Unduhan Langsung:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.downloads.map((d, idx) => (
                    <a
                      key={idx}
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                          {d.type === 'audio' ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {d.label}
                          </p>
                          {d.quality && (
                            <span className="text-[10px] font-mono text-slate-400">{d.quality}</span>
                          )}
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
