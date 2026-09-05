'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';

export default function Home() {
  const [showMobileChat, setShowMobileChat] = useState(false);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans antialiased text-slate-100">
      {/* Sidebar Component (Visible on desktop always, on mobile when showMobileChat is false) */}
      <div className={`${showMobileChat ? 'hidden' : 'block'} md:block w-full md:w-auto h-full flex-shrink-0`}>
        <Sidebar onSelectConv={() => setShowMobileChat(true)} />
      </div>

      {/* Main Active Chat Area */}
      <div
        className={`${
          showMobileChat ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col h-full bg-slate-950 border-l border-slate-800/80`}
      >
        <ChatHeader onBackMobile={() => setShowMobileChat(false)} />
        <MessageList />
        <MessageInput />
      </div>
    </main>
  );
}
