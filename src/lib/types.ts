export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  tools: ToolItem[];
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  icon: string;
  popular?: boolean;
  tags: string[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface TempMailMessage {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  body?: string;
  otpCode?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  image?: string;
  time?: string;
  category?: string;
  source: string;
  snippet?: string;
}

export interface QuizQuestion {
  id: string;
  image?: string;
  question: string;
  answer: string;
  hint?: string;
  category: 'tebak-gambar' | 'asah-otak' | 'caklontong' | 'tebak-kata';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
