'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Heart, Sparkles, Check, RefreshCw, HelpCircle, Trophy, Lightbulb, AlertCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  answer: string;
  image?: string;
  clue?: string;
}

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'primbon'>('quiz');

  // Quiz Game State
  const [gameMode, setGameMode] = useState<'tebak-makanan' | 'tebak-anime' | 'tebak-logo'>('tebak-makanan');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Primbon Form State
  const [nama1, setNama1] = useState('Raffi');
  const [nama2, setNama2] = useState('Nagita');
  const [primbonResult, setPrimbonResult] = useState<{ match: number; title: string; desc: string } | null>(null);
  const [loadingPrimbon, setLoadingPrimbon] = useState(false);

  const quizModes = [
    { id: 'tebak-makanan', name: 'Tebak Makanan' },
    { id: 'tebak-anime', name: 'Tebak Karakter Anime' },
    { id: 'tebak-logo', name: 'Tebak Logo Brand' },
  ];

  const fetchNextQuiz = async () => {
    setLoading(true);
    setFeedback(null);
    setShowHint(false);
    setUserAnswer('');

    try {
      const res = await fetch(`/api/synox/games/${gameMode}`);
      const data = await res.json();

      let q = 'Tebak item gambar atau petunjuk berikut:';
      let a = 'makanan';
      let img = '';
      let clue = '';

      if (data) {
        if (data.jawaban || data.answer) a = data.jawaban || data.answer;
        if (data.image || data.img || data.foto) img = data.image || data.img || data.foto;
        if (data.clue || data.petunjuk) clue = data.clue || data.petunjuk;
        if (data.soal || data.question) q = data.soal || data.question;
      }

      // Dynamic Fallback
      if (!img && !clue) {
        const fallbacks: Record<string, QuizQuestion> = {
          'tebak-makanan': {
            question: 'Makanan khas Indonesia dari olahan daging sapi panggang santan bercita rasa gurih pedas:',
            answer: 'rendang',
            clue: 'Berasal dari Minangkabau / Sumatra Barat',
          },
          'tebak-anime': {
            question: 'Karakter utama anime Ninja Konoha yang bercita-cita menjadi Hokage:',
            answer: 'naruto',
            clue: 'Memiliki Kyuubi ekor sembilan di dalam tubuhnya',
          },
          'tebak-logo': {
            question: 'Logo mesin pencari raksasa dengan empat warna utama (Biru, Merah, Kuning, Hijau):',
            answer: 'google',
            clue: 'Sering dipakai untuk browsing di internet',
          },
        };
        const fb = fallbacks[gameMode];
        q = fb.question;
        a = fb.answer;
        clue = fb.clue || '';
      }

      setCurrentQuiz({ question: q, answer: a, image: img, clue: clue });
    } catch {
      setCurrentQuiz({
        question: 'Makanan khas Indonesia terlezat olahan daging sapi:',
        answer: 'rendang',
        clue: 'Minangkabau',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuiz();
  }, [gameMode]);

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuiz || !userAnswer.trim()) return;

    const cleanedUser = userAnswer.trim().toLowerCase();
    const cleanedCorrect = currentQuiz.answer.trim().toLowerCase();

    if (cleanedUser === cleanedCorrect || cleanedCorrect.includes(cleanedUser)) {
      setScore((prev) => prev + 10);
      setFeedback({ type: 'success', message: 'Jawaban Anda Benar! +10 Poin' });
      setTimeout(() => {
        fetchNextQuiz();
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: `Jawaban kurang tepat. Coba lagi atau buka petunjuk!` });
    }
  };

  const handleCalculatePrimbon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama1.trim() || !nama2.trim()) return;

    setLoadingPrimbon(true);
    setTimeout(() => {
      // Deterministic hash percentage for fun
      const combined = (nama1 + nama2).toLowerCase();
      let code = 0;
      for (let i = 0; i < combined.length; i++) {
        code += combined.charCodeAt(i);
      }
      const match = 70 + (code % 28); // 70% to 98%

      setPrimbonResult({
        match,
        title: 'Tingkat Kecocokan Pasangan & Weton',
        desc: `Hubungan antara ${nama1} dan ${nama2} memiliki keharmonisan yang sangat kuat sebesar ${match}%. Menurut weton Jawa, keduanya saling melengkapi dan membawa rezeki.`,
      });
      setLoadingPrimbon(false);
    }, 800);
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800/50 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mini Games &amp; Primbon Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Kuis Asah Otak &amp; Astrologi Jawa
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Uji wawasan Anda dengan Kuis Tebak Gambar &amp; Makanan, atau periksa ramalan kecocokan jodoh &amp; weton pasangan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Kuis Interaktif</span>
          </button>
          <button
            onClick={() => setActiveTab('primbon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'primbon'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Cek Jodoh</span>
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Top Game Controls & Scoreboard */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {quizModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setGameMode(m.id as 'tebak-makanan' | 'tebak-anime' | 'tebak-logo')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    gameMode === m.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-black shrink-0">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Skor Anda: {score} Poin</span>
            </div>
          </div>

          {/* Quiz Card */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500" />
              <p className="text-xs font-semibold">Memuat Soal Kuis Baru...</p>
            </div>
          ) : (
            currentQuiz && (
              <div className="space-y-6">
                {currentQuiz.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-md mx-auto bg-slate-950">
                    {/* eslint-disable-next-html-loader */}
                    <img src={currentQuiz.image} alt="Kuis Soal" className="w-full h-auto object-cover" />
                  </div>
                )}

                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                    Soal Kuis
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentQuiz.question}
                  </h3>
                </div>

                {/* Hint Drawer */}
                {currentQuiz.clue && (
                  <div className="text-center">
                    {showHint ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Petunjuk: {currentQuiz.clue}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mx-auto"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Buka Petunjuk Clue</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Answer Form Input */}
                <form onSubmit={handleCheckAnswer} className="max-w-md mx-auto space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ketik jawaban Anda di sini..."
                      autoFocus
                      required
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all shrink-0"
                    >
                      Kirim Tebakan
                    </button>
                  </div>
                </form>

                {/* Feedback Notification */}
                {feedback && (
                  <div
                    className={`max-w-md mx-auto p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{feedback.message}</span>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        /* Primbon Calculator */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/20">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Cek Kecocokan Jodoh &amp; Weton</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ramalan keharmonisan hubungan berdasarkan tanggal lahir &amp; weton primbon Jawa.
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculatePrimbon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={nama1}
                  onChange={(e) => setNama1(e.target.value)}
                  placeholder="Nama Lengkap / Panggilan"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Pasangan
                </label>
                <input
                  type="text"
                  value={nama2}
                  onChange={(e) => setNama2(e.target.value)}
                  placeholder="Nama Pasangan"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingPrimbon}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loadingPrimbon ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Hitung Kecocokan Pasangan</span>
            </button>
          </form>

          {/* Result Box */}
          {primbonResult && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {primbonResult.title}
                </span>
                <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
                  {primbonResult.match}% Match
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {primbonResult.desc}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
