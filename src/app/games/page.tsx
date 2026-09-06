'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { Trophy, RefreshCw, HelpCircle, CheckCircle2, Sparkles, Flame } from 'lucide-react';

const QUIZ_TYPES = [
  { id: 'tebak-gambar', name: 'Tebak Gambar', endpoint: 'games/tebak-gambar' },
  { id: 'asah-otak', name: 'Asah Otak', endpoint: 'games/asah-otak' },
  { id: 'caklontong', name: 'Cak Lontong', endpoint: 'games/caklontong' },
];

export default function MiniGamesPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [activeQuiz, setActiveQuiz] = useState(QUIZ_TYPES[0]);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizData, setQuizData] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async (quizType = activeQuiz) => {
    setLoading(true);
    setShowHint(false);
    setUserAnswer('');

    try {
      const res = await fetch(`/api/gateway/${quizType.endpoint}`);
      const json = await res.json();

      let qObj = json;
      if (json && json.data) qObj = json.data;

      setQuizData({
        question: qObj.question || qObj.soal || 'Tebak kata: Tempat menyimpan file dan foto di internet tanpa flashdisk?',
        answer: (qObj.answer || qObj.jawaban || 'CLOUD').toUpperCase(),
        hint: qObj.hint || qObj.bantuan || 'Dimulai dari huruf C',
        image: qObj.image || qObj.img || null,
      });
    } catch {
      setQuizData({
        question: 'Tebak kata: Tempat menyimpan file dan foto di internet tanpa flashdisk?',
        answer: 'CLOUD',
        hint: 'Dimulai dari huruf C',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion(activeQuiz);
  }, [activeQuiz]);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !quizData) return;

    if (userAnswer.trim().toUpperCase() === quizData.answer.toUpperCase()) {
      addToast('Jawaban Benar! +10 Poin Score', 'success');
      setScore((s) => s + 10);
      fetchQuestion();
    } else {
      addToast('Jawaban masih belum tepat, coba lagi atau buka petunjuk!', 'error');
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">Kuis Mini Games & Trivia</h1>
                <p className="text-xs text-slate-400">Asah otak dan kuis kata interaktif berhadiah skor</p>
              </div>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-slate-300">Skor Anda:</span>
              <span className="text-lg font-black text-amber-400 font-mono">{score}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {QUIZ_TYPES.map((q) => (
              <button
                key={q.id}
                onClick={() => setActiveQuiz(q)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  activeQuiz.id === q.id
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {q.name}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
                <p className="text-xs text-slate-400">Memuat soal kuis berikutnya...</p>
              </div>
            ) : quizData ? (
              <div className="space-y-6">
                {quizData.image && (
                  <div className="w-full h-56 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <img src={quizData.image} alt="Soal Kuis" className="h-full object-contain" />
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    Pertanyaan:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-100">{quizData.question}</p>
                </div>

                {showHint && (
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Petunjuk: {quizData.hint}</span>
                  </div>
                )}

                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ketik jawaban Anda..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 uppercase font-black focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Jawab</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Buka Petunjuk
                    </button>
                    <button
                      type="button"
                      onClick={() => fetchQuestion()}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Lewati Soal
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
