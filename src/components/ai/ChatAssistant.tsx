'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Copy, Check, RefreshCw, Plus, Code } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model: string;
}

export function ChatAssistant() {
  const [model, setModel] = useState<string>('gpt-5.5');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'gpt-5.5', name: 'ChatGPT (GPT-5.5)', badge: 'Fast & Smart' },
    { id: 'claude-opus-4.8', name: 'Claude Opus 4.8', badge: 'Creative Writer' },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', badge: 'Logical AI' },
    { id: 'ai-coder', name: 'AI Coder Pro', badge: 'Code Generator' },
  ];

  // Initialize session ID from localStorage or generate new
  useEffect(() => {
    let sid = localStorage.getItem('synox_chat_session');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('synox_chat_session', sid);
    }
    setSessionId(sid);

    const savedMsgs = localStorage.getItem(`synox_chat_history_${sid}`);
    if (savedMsgs) {
      try {
        setMessages(JSON.parse(savedMsgs));
      } catch {
        // Fallback
      }
    } else {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'Halo! Saya asisten AI serba bisa SynoxHub. Pilih model favorit Anda di tab atas dan mulai bertukar pesan secara interaktif.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'gpt-5.5',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`synox_chat_history_${sessionId}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sessionId]);

  const handleNewChat = () => {
    const newSid = 'session_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('synox_chat_session', newSid);
    setSessionId(newSid);
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        text: 'Sesi percakapan baru telah dibuat. Apa yang ingin Anda tanyakan atau buat hari ini?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: model,
      },
    ]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: model,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      let endpointPath = '';
      if (model === 'ai-coder') {
        endpointPath = `/api/synox/ai-chat/ai-coder?prompt=${encodeURIComponent(userText)}&session=${sessionId}`;
      } else if (model.includes('claude')) {
        endpointPath = `/api/synox/ai-chat/${model}?pesan=${encodeURIComponent(userText)}`;
      } else if (model.includes('gemini')) {
        endpointPath = `/api/synox/ai-chat/${model}?pesan=${encodeURIComponent(userText)}&session=${sessionId}`;
      } else {
        endpointPath = `/api/synox/ai-chat/${model}?pesan=${encodeURIComponent(userText)}&session=${sessionId}`;
      }

      const res = await fetch(endpointPath);
      const data = await res.json();

      let replyText = 'Maaf, tidak dapat memproses respons saat ini.';

      if (data) {
        if (typeof data === 'string') {
          replyText = data;
        } else if (typeof data.result === 'string') {
          replyText = data.result;
        } else if (data.result && typeof data.result === 'object') {
          replyText = data.result.reply || data.result.response || data.result.text || JSON.stringify(data.result);
        } else if (typeof data.response === 'string') {
          replyText = data.response;
        } else if (typeof data.pesan === 'string') {
          replyText = data.pesan;
        } else if (data.message) {
          replyText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        } else if (data.data) {
          replyText = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        } else if (data.error) {
          replyText = `Error: ${typeof data.message === 'string' ? data.message : JSON.stringify(data.error)}`;
        } else if (typeof data === 'object') {
          replyText = JSON.stringify(data);
        }
      }

      // Final safety check to strictly ensure replyText is always a string
      if (typeof replyText !== 'string') {
        replyText = JSON.stringify(replyText);
      }

      const assistantMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: 'Terjadi kesalahan jaringan saat menghubungkan ke AI. Silakan coba lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: model,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[700px]">
      {/* Header Bar & Model Tabs */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                model === m.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {m.id === 'ai-coder' ? <Code className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Sesi Baru</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`p-2 rounded-2xl text-white shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-slate-800 dark:bg-slate-700'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm relative group ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1.5 gap-4">
                <span className="font-semibold uppercase tracking-wider">{msg.sender === 'user' ? 'Anda' : msg.model}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Body */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                {String(msg.text)}
              </div>

              <button
                onClick={() => copyToClipboard(msg.id, String(msg.text))}
                className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                  msg.sender === 'user'
                    ? 'hover:bg-indigo-700 text-white'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
                title="Salin teks"
              >
                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-indigo-600 text-white shrink-0 shadow-md animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>AI sedang berpikir dan memproses tanggapan...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ketik pesan Anda ke ${model}...`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
