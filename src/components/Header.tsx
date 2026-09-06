'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Search,
  Bot,
  Download,
  Palette,
  ShieldCheck,
  Wrench,
  Newspaper,
  Gamepad2,
  Key,
  Menu,
  X,
  Globe,
  Activity,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import { ApiKeyModal } from './ApiKeyModal';

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverActive, setServerActive] = useState<boolean | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);

  useEffect(() => {
    // Check server status
    const checkHealth = async () => {
      const start = Date.now();
      try {
        const res = await fetch('/api/synox/status');
        const elapsed = Date.now() - start;
        setPingMs(elapsed);
        if (res.ok) {
          const data = await res.json();
          setServerActive(data.active !== false && data.status !== false);
        } else {
          setServerActive(false);
        }
      } catch {
        setServerActive(false);
      }
    };

    // Detect client IP
    const fetchIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org/?format=json');
        if (res.ok) {
          const data = await res.json();
          setUserIp(data.ip);
        }
      } catch {
        // Silent fallback
      }
    };

    checkHealth();
    fetchIp();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Sparkles },
    { href: '/ai', label: 'AI Workspace', icon: Bot },
    { href: '/downloader', label: 'Downloader', icon: Download },
    { href: '/studio', label: 'Studio', icon: Palette },
    { href: '/checker', label: 'Checker', icon: ShieldCheck },
    { href: '/tools', label: 'Utility Hub', icon: Wrench },
    { href: '/news', label: 'News Feed', icon: Newspaper },
    { href: '/games', label: 'Games & Primbon', icon: Gamepad2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Brand */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                    SYNOX<span className="text-indigo-600 dark:text-indigo-400">HUB</span>
                  </span>
                  <span className="hidden sm:block text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                    AI & Utility Hub
                  </span>
                </div>
              </Link>

              {/* Server Status Indicator Widget */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      serverActive ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      serverActive ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {serverActive ? 'LIVE' : 'OFFLINE'}
                </span>
                {pingMs !== null && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono border-l border-slate-200 dark:border-slate-800 pl-2">
                    {pingMs}ms
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Tools & Actions */}
            <div className="flex items-center gap-2">
              {/* Search Shortcut Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors text-xs font-medium"
              >
                <Search className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                  ⌘K
                </kbd>
              </button>

              {/* API Key Modal Button */}
              <button
                onClick={() => setApiKeyOpen(true)}
                title="API Key Settings"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <Key className="w-4 h-4 text-amber-500" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-500" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                {userIp || 'Detecting IP...'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                {serverActive ? 'LIVE Status' : 'Server Down'}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <ApiKeyModal isOpen={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </>
  );
}
