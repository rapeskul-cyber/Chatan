import { create } from 'zustand';
import { ToastNotification, ToolItem } from './types';

export const ALL_TOOLS: ToolItem[] = [
  // AI Tools
  {
    id: 'ai-chat',
    name: 'Multi-Model AI Chat',
    description: 'Chatbot pintar dengan ChatGPT-4, Claude 3.5, Gemini Pro, & DeepSeek Coder',
    path: '/ai/chat',
    category: 'AI Workspace',
    icon: 'Bot',
    popular: true,
    tags: ['ai', 'chat', 'gpt', 'claude', 'gemini', 'coding'],
  },
  {
    id: 'ai-image',
    name: 'AI Art & Text-to-Image',
    description: 'Generator gambar AI (Flux, Anime Art, Realistic Portrait) dari prompt teks',
    path: '/ai/image',
    category: 'AI Workspace',
    icon: 'Sparkles',
    popular: true,
    tags: ['ai', 'image', 'art', 'anime', 'flux', 'portrait'],
  },
  // Downloader
  {
    id: 'downloader',
    name: 'Social Media Downloader',
    description: 'Unduh video TikTok, Instagram, YouTube, Spotify MP3, FB, Twitter & CapCut',
    path: '/downloader',
    category: 'Downloader',
    icon: 'Download',
    popular: true,
    tags: ['download', 'tiktok', 'instagram', 'youtube', 'spotify', 'mp3', 'mp4'],
  },
  // Studio
  {
    id: 'studio-meme',
    name: 'Meme Generator Studio',
    description: 'Buat meme kocak langsung dari canvas interaktif',
    path: '/studio/meme',
    category: 'Creative Studio',
    icon: 'Smile',
    popular: true,
    tags: ['meme', 'canvas', 'image', 'editor', 'studio'],
  },
  {
    id: 'studio-effects',
    name: 'Text Effect 3D & Neon',
    description: 'Bikin teks 3D Gold, Neon Glow, Cyberpunk Glitch & Graffiti',
    path: '/studio/effects',
    category: 'Creative Studio',
    icon: 'Wand2',
    tags: ['text', 'effect', 'neon', 'gold', 'glitch', 'ephoto'],
  },
  {
    id: 'studio-banner',
    name: 'Discord Banner & Rank Card',
    description: 'Desain Welcome/Goodbye banner dan Rank level card untuk komunitas',
    path: '/studio/banner',
    category: 'Creative Studio',
    icon: 'Image',
    tags: ['discord', 'banner', 'welcome', 'rank', 'card'],
  },
  // Stalker
  {
    id: 'stalker-games',
    name: 'Game Account Lookup',
    description: 'Cek akun Mobile Legends, Free Fire, & Genshin Impact',
    path: '/stalker/games',
    category: 'Stalker & Checker',
    icon: 'Gamepad2',
    popular: true,
    tags: ['game', 'mlbb', 'mobile legends', 'free fire', 'genshin'],
  },
  {
    id: 'stalker-social',
    name: 'Social Profile Inspector',
    description: 'Stalker profil TikTok & Instagram (Follower, Bio, Avatar HD)',
    path: '/stalker/social',
    category: 'Stalker & Checker',
    icon: 'UserSearch',
    tags: ['tiktok', 'instagram', 'profile', 'stalker', 'avatar'],
  },
  // Tools
  {
    id: 'tools-tempmail',
    name: 'Disposable TempMail',
    description: 'Email sementara 1-klik dengan inbox otomatis untuk OTP & verifikasi',
    path: '/tools/tempmail',
    category: 'Utility Tools',
    icon: 'Mail',
    popular: true,
    tags: ['email', 'tempmail', 'otp', 'disposable', 'mail'],
  },
  {
    id: 'tools-ocr',
    name: 'Image to Text (OCR)',
    description: 'Ekstraksi teks dari foto dokumen atau screenshot rapi',
    path: '/tools/ocr',
    category: 'Utility Tools',
    icon: 'FileText',
    tags: ['ocr', 'text', 'image', 'scan', 'extract'],
  },
  {
    id: 'tools-shortlink',
    name: 'URL Shortener & Bypass',
    description: 'Pemendek tautan cepat dan bypass shortlink beriklan',
    path: '/tools/shortlink',
    category: 'Utility Tools',
    icon: 'Link',
    tags: ['shortlink', 'url', 'bypass', 'link'],
  },
  // Portal
  {
    id: 'news',
    name: 'News Aggregator Portal',
    description: 'Berita terkini dari Detikcom, CNN Indonesia, Kompas, & Antara',
    path: '/news',
    category: 'News & Portal',
    icon: 'Newspaper',
    tags: ['berita', 'news', 'detik', 'cnn', 'kompas'],
  },
  {
    id: 'games',
    name: 'Mini Games & Trivia',
    description: 'Kuis Tebak Gambar, Asah Otak, & Tebak Kata Cak Lontong',
    path: '/games',
    category: 'Entertainment',
    icon: 'Trophy',
    tags: ['game', 'quiz', 'tebak gambar', 'asah otak', 'cak lontong'],
  },
  {
    id: 'primbon',
    name: 'Primbon & Astrologi',
    description: 'Ramalan Jodoh, Arti Nama, Weton Jawa, & Zodiak Harian',
    path: '/primbon',
    category: 'Entertainment',
    icon: 'Compass',
    tags: ['primbon', 'zodiak', 'jodoh', 'weton', 'ramalan'],
  },
];

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  apiKey: typeof window !== 'undefined' ? localStorage.getItem('synox_api_key') || 'FREE' : 'FREE',
  setApiKey: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synox_api_key', key);
    }
    set({ apiKey: key });
  },
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  toasts: [],
  addToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id: string) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));
