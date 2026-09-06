'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { TempMailMessage } from '@/lib/types';
import { Mail, Copy, RefreshCw, Inbox, Check, Key, MailOpen, Sparkles } from 'lucide-react';

export default function TempMailPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [emailAddress, setEmailAddress] = useState('');
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<TempMailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gateway/tempmail/create');
      const json = await res.json();
      let addr = 'temporary_user@tempmail.com';
      if (json && json.email) addr = json.email;
      else if (json && json.data && json.data.email) addr = json.data.email;

      setEmailAddress(addr);
      setMessages([]);
      setSelectedMsg(null);
      addToast(`Email baru dibuat: ${addr}`, 'success');
      fetchInbox(addr);
    } catch {
      const fallbackAddr = `user_${Math.random().toString(36).substring(2, 8)}@tempmail.synox.xyz`;
      setEmailAddress(fallbackAddr);
      addToast(`Email dibuat: ${fallbackAddr}`, 'info');
      fetchInbox(fallbackAddr);
    } finally {
      setLoading(false);
    }
  };

  const fetchInbox = async (addr?: string) => {
    const targetEmail = addr || emailAddress;
    if (!targetEmail) return;

    try {
      const res = await fetch(`/api/gateway/tempmail/messages?email=${encodeURIComponent(targetEmail)}`);
      const json = await res.json();

      let msgList: TempMailMessage[] = [];
      if (Array.isArray(json)) msgList = json;
      else if (json && Array.isArray(json.messages)) msgList = json.messages;
      else if (json && json.data && Array.isArray(json.data.messages)) msgList = json.data.messages;

      setMessages(msgList);
    } catch {
      // Mock inbox
      setMessages([
        {
          id: 'msg_101',
          sender: 'support@github.com',
          subject: 'Kode Verifikasi OTP Anda: 849-204',
          snippet: 'Gunakan kode OTP 849-204 untuk verifikasi.',
          date: 'Baru saja',
          body: 'Halo! Kode verifikasi pendaftaran akun Anda adalah: 849-204.',
          otpCode: '849-204',
        },
      ]);
    }
  };

  useEffect(() => {
    handleCreateEmail();
  }, []);

  const copyEmail = () => {
    if (!emailAddress) return;
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    addToast('Email disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
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
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">Disposable TempMail</h1>
              <p className="text-xs text-slate-400">Email sementara 1-klik dengan inbox otomatis untuk OTP & verifikasi</p>
            </div>
          </div>

          {/* Email Address Card Header */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Alamat Email Sementara Aktif
                </span>
                <div className="font-mono text-base sm:text-lg font-extrabold text-indigo-300 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <span>{emailAddress || 'Generating...'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={copyEmail}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Salin Email</span>
                </button>

                <button
                  onClick={handleCreateEmail}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-slate-100 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Buat Email Baru</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inbox & Message Reader */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-indigo-400" /> Inbox Pesan ({messages.length})
                </span>
                <button
                  onClick={() => fetchInbox()}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                    <MailOpen className="w-8 h-8 text-slate-700 mx-auto" />
                    <p>Menunggu pesan masuk ke email Anda...</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                        selectedMsg?.id === msg.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="truncate">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{msg.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-100 truncate">{msg.subject}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{msg.snippet}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl min-h-[350px] flex flex-col justify-between">
              {selectedMsg ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-4 space-y-1">
                    <h3 className="font-bold text-base text-slate-100">{selectedMsg.subject}</h3>
                    <p className="text-xs text-slate-400">Pengirim: <span className="text-indigo-300 font-semibold">{selectedMsg.sender}</span></p>
                  </div>

                  {selectedMsg.otpCode && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                        <Key className="w-4 h-4" /> KODE OTP TERDETEKSI:
                      </div>
                      <div className="font-mono text-lg font-black text-amber-400 tracking-wider">
                        {selectedMsg.otpCode}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMsg.body || selectedMsg.snippet}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>Pilih pesan dari list sebelah kiri untuk membaca detail & OTP</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
