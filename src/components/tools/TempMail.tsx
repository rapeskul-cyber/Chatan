'use client';

import { useState, useEffect } from 'react';
import { Mail, Copy, Check, RefreshCw, AlertCircle, Inbox, ShieldCheck, Clock, FileText } from 'lucide-react';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
}

export function TempMail() {
  const [address, setAddress] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = async () => {
    setLoading(true);
    setError(null);
    setSelectedMessage(null);

    try {
      const res = await fetch('/api/synox/tempmail/tempmail-create');
      const data = await res.json();

      if (data && data.result && data.result.address) {
        setAddress(data.result.address);
        setVisitorId(data.result.visitor_id);
        setMessages([]);
      } else {
        throw new Error('Gagal membuat email sementara.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const checkInbox = async () => {
    if (!visitorId) return;
    setPolling(true);

    try {
      const res = await fetch(`/api/synox/tempmail/tempmail-inbox?id=${encodeURIComponent(visitorId)}`);
      const data = await res.json();

      if (data && data.result && Array.isArray(data.result.messages)) {
        // Map inbox messages
        const parsed: EmailMessage[] = data.result.messages.map((m: { id?: string; from?: string; subject?: string; date?: string; body?: string; text?: string }, index: number) => ({
          id: m.id || `msg_${index}`,
          from: m.from || 'sender@domain.com',
          subject: m.subject || 'Pesan Baru / Kode OTP Verifikasi',
          date: m.date || new Date().toLocaleTimeString(),
          body: m.body || m.text || 'Isi pesan email...',
        }));
        setMessages(parsed);
      }
    } catch {
      // Ignore background auto-poll errors
    } finally {
      setPolling(false);
    }
  };

  useEffect(() => {
    if (visitorId) {
      checkInbox();
      const interval = setInterval(checkInbox, 5000); // 5 seconds auto polling
      return () => clearInterval(interval);
    }
  }, [visitorId]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Disposable TempMail</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Email sementara 1-klik dengan auto-polling kotak masuk setiap 5 detik.
            </p>
          </div>
        </div>

        <button
          onClick={generateEmail}
          disabled={loading}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          <span>{address ? 'Buat Email Baru' : 'Generate Email'}</span>
        </button>
      </div>

      {/* Address & Copy Box */}
      {address && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Alamat Email Aktif Anda</span>
            <span className="text-base font-mono font-bold text-slate-900 dark:text-white select-all">{address}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAddress}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Alamat'}</span>
            </button>
            <button
              onClick={checkInbox}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
              title="Refresh Inbox"
            >
              <RefreshCw className={`w-4 h-4 ${polling ? 'animate-spin text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inbox Feed & Reader */}
      {address && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Messages List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-rose-500" /> Kotak Masuk ({messages.length})
              </span>
              <span className="text-[10px] font-mono text-slate-400">Auto-polling 5s</span>
            </div>

            {messages.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 animate-pulse" />
                <p className="text-xs font-medium">Menunggu pesan masuk...</p>
                <p className="text-[10px] text-slate-500">
                  Gunakan alamat email di atas untuk mendaftar akun atau menerima kode OTP verifikasi.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {messages.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMessage(m)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all ${
                      selectedMessage?.id === m.id
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span className="truncate max-w-[150px]">{m.from}</span>
                      <span>{m.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.subject}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reader Pane */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 min-h-[220px]">
            {selectedMessage ? (
              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Dari</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMessage.from}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mt-2">Subjek</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedMessage.subject}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Isi Pesan</span>
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedMessage.body}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                <FileText className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium">Pilih pesan di sebelah kiri untuk membaca rincian email &amp; OTP.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
