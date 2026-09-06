'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, X, ArrowRight, Compass, Terminal } from 'lucide-react';
import { SynoxCategory, SynoxItem } from '@/types/synox';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [endpoints, setEndpoints] = useState<SynoxItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && endpoints.length === 0) {
      setLoading(true);
      fetch('/api/synox/endpoints')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.endpoints) {
            const allItems: SynoxItem[] = [];
            data.endpoints.forEach((cat: SynoxCategory) => {
              if (cat.items && Array.isArray(cat.items)) {
                allItems.push(...cat.items);
              }
            });
            setEndpoints(allItems);
          }
        })
        .catch((err) => console.error('Failed to load endpoints in search:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, endpoints.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Send event or trigger parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = endpoints.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      (item.subfolder && item.subfolder.toLowerCase().includes(q))
    );
  }).slice(0, 15);

  const getCategoryRoute = (item: SynoxItem) => {
    const sub = (item.subfolder || '').toLowerCase();
    if (sub.includes('ai')) return `/ai?tool=${item.id}`;
    if (sub.includes('download')) return `/downloader?tool=${item.id}`;
    if (sub.includes('canvas') || sub.includes('ephoto') || sub.includes('maker') || sub.includes('edit')) return `/studio?tool=${item.id}`;
    if (sub.includes('stalker') || sub.includes('check')) return `/checker?tool=${item.id}`;
    if (sub.includes('tempmail') || sub.includes('bypass') || sub.includes('tool')) return `/tools?tool=${item.id}`;
    if (sub.includes('berita')) return `/news`;
    if (sub.includes('game') || sub.includes('primbon')) return `/games?tool=${item.id}`;
    return `/tools?tool=${item.id}`;
  };

  const handleSelect = (item: SynoxItem) => {
    const route = getCategoryRoute(item);
    onClose();
    router.push(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 400+ AI tools, downloaders, graphic generators..."
            autoFocus
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800/50">
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin text-indigo-500" />
              <p className="text-sm">Loading tools catalog...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">Tidak ada fitur yang cocok dengan &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Coba kata kunci lain seperti &quot;TikTok&quot;, &quot;Claude&quot;, &quot;Meme&quot;, atau &quot;MLBB&quot;</p>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id + item.name}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {item.name}
                      </span>
                      {item.subfolder && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                          {item.subfolder}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.desc || 'Akses cepat dan mudah'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Menampilkan hingga 15 hasil terbaik</span>
          <span className="hidden sm:inline">Navigasi langsung 1-Klik</span>
        </div>
      </div>
    </div>
  );
}
