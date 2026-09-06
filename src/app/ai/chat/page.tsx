'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppStore } from '@/lib/store';
import { AIChatMessage } from '@/lib/types';
import {
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Code2,
  Cpu,
  User,
  RefreshCw,
} from 'lucide-react';

const AI_MODELS = [
  { id: 'chatgpt-4', name: 'ChatGPT-4 Turbo', endpoint: 'ai-chat/chatgpt-4', badge: 'GPT-4o', desc: 'Sangat responsif untuk penalaran umum' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', endpoint: 'ai-chat/claude', badge: 'Anthropic', desc: 'Terbaik untuk penulisan & analisis kompleks' },
  { id: 'gemini', name: 'Google Gemini Pro', endpoint: 'ai-chat/gemini', badge: 'Google', desc: 'Pemahaman kontekstual serbaguna' },
  { id: 'ai-coder', name: 'AI Coder Assistant', endpoint: 'ai-chat/ai-coder', badge: 'Developer', desc: 'Khusus bantuan coding & arsitektur' },
  { id: 'deepseek', name: 'DeepSeek Coder V2', endpoint: 'ai-chat/deepseek', badge: 'DeepSeek', desc: 'Optimasi query & algoritma' },
];

export default function AIChatPage() {
  const { sidebarOpen, addToast } = useAppStore();
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat session from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('synox_chat_session');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([
        {
          id: 'msg_welcome',
          role: 'assistant',
          content: 'Halo! Saya adalah AI Workspace SynoxHub. Ada yang bisa saya bantu hari ini? Pilih model AI favorit Anda di atas dan mulailah berdiskusi.',
          timestamp: Date.now(),
          model: AI_MODELS[0].name,
        },
      ]);
    }
  }, []);

  // Save session to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('synox_chat_session', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const session = 'sess_' + (messages[0]?.id || 'default');
      const res = await fetch(
        `/api/gateway/${selectedModel.endpoint}?prompt=${encodeURIComponent(userText)}&session=${session}`
      );
      const json = await res.json();

      let replyContent = '';
      if (json && typeof json.response === 'string') {
        replyContent = json.response;
      } else if (json && json.data && json.data.response) {
        replyContent = json.data.response;
      } else if (typeof json === 'string') {
        replyContent = json;
      } else {
        replyContent = json.message || 'Jawaban berhasil diterima dari model AI.';
      }

      const assistantMsg: AIChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
        model: selectedModel.name,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      addToast('Gagal menghubungi API Gateway AI.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('synox_chat_session');
    addToast('Riwayat percakapan dibersihkan.', 'info');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Teks berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navigation />
      <CommandPalette />
      <ToastContainer />

      <main
        className={`flex-1 transition-all duration-300 flex flex-col h-[calc(100vh-64px)] ${
          sidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        {/* Workspace Top Header Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100">Multi-Model AI Chat Workspace</h1>
              <p className="text-xs text-slate-400">Pilih model kecerdasan buatan terbaik untuk kebutuhan Anda</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const m = AI_MODELS.find((x) => x.id === e.target.value);
                  if (m) setSelectedModel(m);
                }}
                className="appearance-none bg-slate-950 border border-slate-700/80 text-slate-200 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.badge})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearHistory}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              title="Bersihkan Percakapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 max-w-xl shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-slate-50 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.model && (
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> {msg.model}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px] opacity-70">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="p-1 hover:text-indigo-300 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 animate-pulse">
                {selectedModel.name} sedang berpikir dan menyusun respon...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Tanya ${selectedModel.name}... (misal: Buatkan helper HTTP di TypeScript)`}
              disabled={loading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
