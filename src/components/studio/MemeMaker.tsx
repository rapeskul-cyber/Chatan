'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, RefreshCw, Sparkles, Upload, Type } from 'lucide-react';

export function MemeMaker() {
  const [topText, setTopText] = useState('AKU KETIKA');
  const [bottomText, setBottomText] = useState('TELAT BANGUN SAAT LIBUR');
  const [selectedTemplate, setSelectedTemplate] = useState('kucing');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultTemplates = [
    {
      id: 'kucing',
      name: 'Kucing Bunga',
      url: 'https://raw.githubusercontent.com/SaurusAraAra/mentahan/refs/heads/main/images/kucing_megang_bunga.jpg',
    },
    {
      id: 'drake',
      name: 'Meme Cat',
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'doge',
      name: 'Funny Doge',
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Draw on Canvas dynamically whenever inputs change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const currentSource =
      customImage ||
      defaultTemplates.find((t) => t.id === selectedTemplate)?.url ||
      defaultTemplates[0].url;

    img.src = currentSource;

    img.onload = () => {
      canvas.width = 600;
      canvas.height = (img.height / img.width) * 600 || 600;

      // Draw Base Image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Text styling (Classic Meme Font Impact / Bold Sans)
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.font = '900 36px Impact, Arial, sans-serif';

      // Top Text
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 50);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 50);
      }

      // Bottom Text
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 25);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 25);
      }
    };
  }, [topText, bottomText, selectedTemplate, customImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setSelectedTemplate('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateRemoteCanvas = async () => {
    setLoadingRemote(true);
    setRemoteImage(null);
    try {
      const imgUrl =
        customImage ||
        defaultTemplates.find((t) => t.id === selectedTemplate)?.url ||
        defaultTemplates[0].url;

      const apiEndpoint = `/api/synox/canvas/smeme?image=${encodeURIComponent(imgUrl)}&top=${encodeURIComponent(topText)}&bottom=${encodeURIComponent(bottomText)}`;
      const res = await fetch(apiEndpoint);

      if (res.ok) {
        const blob = await res.blob();
        setRemoteImage(URL.createObjectURL(blob));
      }
    } catch {
      // Fallback
    } finally {
      setLoadingRemote(false);
    }
  };

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'synox-meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Interactive Meme Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload gambar sendiri atau pilih template, ketik teks atas &amp; bawah dengan preview canvas real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Template Mentahan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {defaultTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setCustomImage(null);
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedTemplate === t.id && !customImage
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Atau Unggah Gambar Sendiri
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Upload className="w-4 h-4 text-purple-500" />
              <span>{customImage ? 'Ganti Gambar File' : 'Unggah File Gambar (PNG/JPG)'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Teks Bagian Atas (Top Text)
            </label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="AKU KETIKA..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Teks Bagian Bawah (Bottom Text)
            </label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="DESKRIPSI MEME..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold uppercase"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleDownloadCanvas}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Unduh Hasil Meme PNG
            </button>
            <button
              onClick={handleGenerateRemoteCanvas}
              disabled={loadingRemote}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              {loadingRemote ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              )}
              <span>Render via Server API (/canvas/smeme)</span>
            </button>
          </div>
        </div>

        {/* Right Canvas Preview */}
        <div className="space-y-3 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live HTML5 Canvas Preview
          </span>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 w-full max-w-[450px]">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          {remoteImage && (
            <div className="mt-4 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-center w-full">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 block mb-2">
                Hasil Render Server Synox:
              </span>
              {/* eslint-disable-next-html-loader */}
              <img src={remoteImage} alt="Server Meme" className="w-full h-auto rounded-xl shadow" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
