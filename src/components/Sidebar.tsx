'use client';

import React from 'react';
import { Search, MessageSquarePlus, Settings, Check, CheckCheck } from 'lucide-react';
import { useChatStore, CURRENT_USER } from '@/lib/store';

export const Sidebar: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversation, searchQuery, setSearchQuery, messages } = useChatStore();

  const filteredConversations = conversations.filter((conv) => {
    const titleMatch = conv.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch;
  });

  return (
    <aside className="w-full md:w-[380px] flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-100">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* User Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CURRENT_USER.avatarUrl}
              alt={CURRENT_USER.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100 leading-tight">
              {CURRENT_USER.displayName}
            </h2>
            <p className="text-xs text-slate-400">@{CURRENT_USER.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            title="New Chat"
            className="p-2 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
          <button
            title="Settings"
            className="p-2 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No chats found</div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const convMessages = messages[conv.id] || [];
            const lastMsg = convMessages[convMessages.length - 1];

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full p-3.5 flex items-center gap-3 transition-all text-left ${
                  isActive
                    ? 'bg-blue-600/10 border-l-4 border-blue-500'
                    : 'hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={conv.avatarUrl}
                    alt={conv.title || 'Chat Avatar'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.isTyping && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                      typing...
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-slate-100 truncate">
                      {conv.title}
                    </h3>
                    {lastMsg && (
                      <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
                        {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <p className="truncate flex-1 pr-2">
                      {conv.isTyping ? (
                        <span className="text-blue-400 italic">typing a message...</span>
                      ) : lastMsg ? (
                        lastMsg.isDeleted ? (
                          <span className="italic text-slate-500">Message deleted</span>
                        ) : (
                          lastMsg.content || 'Media message'
                        )
                      ) : (
                        'No messages yet'
                      )}
                    </p>

                    <div className="flex items-center gap-1.5">
                      {lastMsg && lastMsg.senderId === CURRENT_USER.id && (
                        <span>
                          {lastMsg.status === 'read' ? (
                            <CheckCheck className="w-4 h-4 text-sky-400" />
                          ) : lastMsg.status === 'delivered' ? (
                            <CheckCheck className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Check className="w-4 h-4 text-slate-400" />
                          )}
                        </span>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
