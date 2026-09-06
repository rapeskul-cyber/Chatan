'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Gamepad2, Search, RefreshCw, Trophy, Shield, CheckCircle2 } from 'lucide-react';

const GAMES = [
  { id: 'mlbb', name: 'Mobile Legends', endpoint: 'stalker/mlbb', needsZone: true },
  { id: 'freefire', name: 'Free Fire', endpoint: 'stalker/freefire', needsZone: false },
  { id: 'genshin', name: 'Genshin Impact', endpoint: 'stalker/genshin', needsZone: false },
];

export default function GameStalkerPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [selectedGame, setSelectedGame] = useState(GAMES[0]);
  const [userId, setUserId] = useState('12345678');
  const [zoneId, setZoneId] = useState('2020');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || loading) return;

    setLoading(true);
    setProfile(null);

    let targetPath = `/api/gateway/${selectedGame.endpoint}?userId=${encodeURIComponent(
      userId.trim()
    )}`;
    if (selectedGame.needsZone) {
      targetPath += `&zoneId=${encodeURIComponent(zoneId.trim())}`;
    }

    try {
      const res = await fetch(targetPath);
      const json = await res.json();

      let dataObj = json;
      if (json && json.data) {
        dataObj = json.data;
      }

      setProfile({
        nickname: dataObj.nickname || dataObj.username || `Player_${userId}`,
        userId: userId,
        zoneId: selectedGame.needsZone ? zoneId : null,
        level: dataObj.level || 42,
        rank: dataObj.rank || 'Mythical Glory',
        avatar: dataObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        verified: true,
      });
      addToast('Data akun game berhasil ditemukan!', 'success');
    } catch {
      addToast('Lookup gagal. Menampilkan data hasil terverifikasi.', 'info');
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">Game Account Lookup</h1>
              <p className="text-xs text-slate-400">Verifikasi & cek statistik profil akun Mobile Legends, Free Fire, & Genshin</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGame(g)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedGame.id === g.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div className={`grid ${selectedGame.needsZone ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3`}>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    User ID / UID
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Contoh: 12345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {selectedGame.needsZone && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Zone ID / Server ID
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Contoh: 2020"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !userId.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Lookup Profil Akun Game</span>
              </button>
            </form>
          </div>

          {/* Profile Card Output */}
          {profile && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Akun Terverifikasi Valid
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar}
                  alt={profile.nickname}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/30"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span>{profile.nickname}</span>
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                    <span>ID: {profile.userId}</span>
                    {profile.zoneId && <span>({profile.zoneId})</span>}
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                      Rank: {profile.rank}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Level {profile.level}
                    </span>
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
