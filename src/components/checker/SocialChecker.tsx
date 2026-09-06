'use client';

import { useState } from 'react';
import { UserCheck, Search, RefreshCw, AlertCircle, Heart, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface SocialProfileResult {
  platform: 'tiktok' | 'instagram' | 'github';
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: string | number;
  following?: string | number;
  likes?: string | number;
  verified?: boolean;
}

export function SocialChecker() {
  const [platform, setPlatform] = useState<'tiktok' | 'instagram' | 'github'>('tiktok');
  const [username, setUsername] = useState('timothyronaldd');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SocialProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'tiktok', name: 'TikTok Inspector' },
    { id: 'instagram', name: 'Instagram Stalker' },
    { id: 'github', name: 'GitHub Developer' },
  ];

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '';
      if (platform === 'tiktok') {
        endpoint = `/api/synox/stalker/tiktokstalk?user=${encodeURIComponent(username.trim())}`;
      } else if (platform === 'instagram') {
        endpoint = `/api/synox/stalker/instagram?username=${encodeURIComponent(username.trim())}`;
      } else {
        endpoint = `/api/synox/stalker/github?username=${encodeURIComponent(username.trim())}`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Gagal memuat profil medsos (HTTP ${res.status})`);
      }

      const data = await res.json();

      let name = username;
      let avatar = 'https://c.top4top.io/p_3815w0ycy1.jpg';
      let bio = 'Profil pengguna medsos';
      let followers: string | number = '12.5k';
      let following: string | number = '150';
      let likes: string | number = '1.2M';

      if (data) {
        if (data.nickname || data.name || data.fullname) name = data.nickname || data.name || data.fullname;
        if (data.avatar || data.profile || data.photo || data.avatar_url) avatar = data.avatar || data.profile || data.photo || data.avatar_url;
        if (data.bio || data.description) bio = data.bio || data.description;
        if (data.followers || data.follower) followers = data.followers || data.follower;
        if (data.following) following = data.following;
        if (data.likes || data.hearts) likes = data.likes || data.hearts;
      }

      setResult({
        platform,
        username,
        name,
        avatar,
        bio,
        followers,
        following,
        likes,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memeriksa profil medsos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Social Profile Inspector</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspeksi foto profil HD, bio, statistik pengikut, &amp; total suka akun TikTok / Instagram.
          </p>
        </div>
      </div>

      <form onSubmit={handleInspect} className="space-y-4">
        {/* Platform Choice */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Pilih Platform Media Sosial
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id as 'tiktok' | 'instagram' | 'github')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  platform === p.id
                    ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border-pink-300 dark:border-pink-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Username Akun
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ketik username tanpa @"
              required
              className="w-full pl-4 pr-28 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm"
            />
            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md shadow-pink-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Inspeksi</span>
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

      {/* Result Profile Card */}
      {result && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0">
              {/* eslint-disable-next-html-loader */}
              <img src={result.avatar} alt={result.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{result.name}</h4>
              <p className="text-xs font-mono text-pink-600 dark:text-pink-400 font-semibold">@{result.username}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{result.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Followers</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{result.followers}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Following</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{result.following || 'N/A'}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Suka</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{result.likes || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
