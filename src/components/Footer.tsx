import Link from 'next/link';
import { Sparkles, Shield, Cpu, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                SYNOX<span className="text-indigo-600 dark:text-indigo-400">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform serba ada untuk AI workspace, downloader media sosial, pembuat gambar &amp; meme studio, game checker, serta peralatan utilitas harian.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Multi-Model AI Chat
                </Link>
              </li>
              <li>
                <Link href="/downloader" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Social Media Downloader
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Creative Graphic Studio
                </Link>
              </li>
              <li>
                <Link href="/checker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Game &amp; Profile Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Utilitas &amp; Hiburan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  TempMail Disposable Email
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image to Text OCR
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Portal Berita Terkini
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Kuis Interaktif &amp; Primbon
                </Link>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Informasi Platform
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Encrypted &amp; CORS Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Powered by Synox Cloud REST API</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-2">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Antarmuka ramah pengguna (End-User App) tanpa konfigurasi rumit.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SynoxHub AI Utility. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for End-Users.
          </p>
        </div>
      </div>
    </footer>
  );
}
