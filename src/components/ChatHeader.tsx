'use client';

import React from 'react';
import { Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { useChatStore } from '@/lib/store';

interface ChatHeaderProps {
  onBackMobile?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackMobile }) => {
  const { conversations, activeConversationId } = useChatStore();
  const conversation = conversations.find((c) => c.id === activeConversationId);

  if (!conversation) return null;

  return (
    <header className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {onBackMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBackMobile();
            }}
            className="md:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={conversation.avatarUrl}
            alt={conversation.title || 'Avatar'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </div>

        <div>
          <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            {conversation.title}
          </h2>
          <p className="text-xs text-slate-400">
            {conversation.isTyping ? (
              <span className="text-blue-400 font-medium animate-pulse">typing...</span>
            ) : (
              'Active now'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          title="Audio Call"
          className="p-2.5 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          title="Video Call"
          className="p-2.5 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          title="Conversation Info"
          className="p-2.5 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
