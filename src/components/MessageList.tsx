'use client';

import React, { useState } from 'react';
import { Check, CheckCheck, Clock, Reply, Trash2, Volume2 } from 'lucide-react';
import { MessageStatus } from '@/lib/types';
import { useChatStore, CURRENT_USER, MOCK_USERS } from '@/lib/store';

const QUICK_REACTIONS = ['❤️', '🔥', '😂', '😮', '😢', '👍'];

export const MessageList: React.FC = () => {
  const { messages, activeConversationId, setReplyingToMessage, addReaction, deleteMessage } = useChatStore();
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const handleDoubleTap = (messageId: string) => {
    addReaction(messageId, '❤️');
  };

  const renderStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
      {currentMessages.map((msg) => {
        const isMe = msg.senderId === CURRENT_USER.id;
        const sender = isMe ? CURRENT_USER : MOCK_USERS[msg.senderId] || { displayName: 'User', avatarUrl: '' };

        return (
          <div
            key={msg.id}
            onMouseEnter={() => setHoveredMessageId(msg.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Name for incoming */}
            {!isMe && (
              <span className="text-[11px] font-medium text-slate-400 ml-1 mb-1">
                {sender.displayName}
              </span>
            )}

            <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[65%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Message Bubble Container */}
              <div
                onDoubleClick={() => handleDoubleTap(msg.id)}
                className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm transition-all select-none ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/60'
                }`}
              >
                {/* Quote Reply Parent Preview */}
                {msg.parentMessagePreview && (
                  <div className="mb-2 p-2 rounded-lg bg-black/20 border-l-3 border-blue-400 text-xs">
                    <span className="font-semibold text-blue-300 block">
                      {msg.parentMessagePreview.senderName}
                    </span>
                    <p className="truncate text-slate-200">{msg.parentMessagePreview.content}</p>
                  </div>
                )}

                {/* Media Image */}
                {msg.mediaUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.mediaUrl}
                      alt="Shared media"
                      className="w-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Voice Note Audio Player */}
                {msg.messageType === 'audio' && (
                  <div className="flex items-center gap-3 py-1">
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 bg-white/30 rounded-full overflow-hidden w-32">
                        <div className="h-full bg-white w-1/2 rounded-full" />
                      </div>
                      <span className="text-[10px] text-white/80 mt-1 block">
                        00:0{msg.audioDuration || 5} • Voice Note
                      </span>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                {msg.content && <p className="leading-relaxed break-words">{msg.content}</p>}

                {/* Bottom Meta Bar (Timestamp + Status) */}
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                    isMe ? 'text-blue-100/80' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && renderStatusIcon(msg.status)}
                </div>

                {/* Reactions Badge */}
                {msg.reactions.length > 0 && (
                  <div className="absolute -bottom-2.5 right-2 flex items-center bg-slate-900 border border-slate-700/80 rounded-full px-1.5 py-0.5 shadow-md text-xs gap-0.5">
                    {msg.reactions.map((r) => (
                      <span key={r.id}>{r.reactionCode}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar on Hover */}
              {hoveredMessageId === msg.id && !msg.isDeleted && (
                <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-800 shadow-lg animate-fade-in">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="p-1 hover:scale-125 transition-transform text-xs"
                    >
                      {emoji}
                    </button>
                  ))}
                  <button
                    onClick={() => setReplyingToMessage(msg)}
                    title="Reply"
                    className="p-1 text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                  {isMe && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      title="Delete"
                      className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
