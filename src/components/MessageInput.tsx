'use client';

import React, { useState, useRef } from 'react';
import { Paperclip, Smile, Mic, Send, X, Square, Image as ImageIcon } from 'lucide-react';
import { useChatStore, CURRENT_USER, MOCK_USERS } from '@/lib/store';

const EMOJI_DRAWER = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '🙌', '😎', '🙏', '👀', '✨', '🚀'];

export const MessageInput: React.FC = () => {
  const { sendMessage, replyingToMessage, setReplyingToMessage, activeConversationId, toggleTyping } = useChatStore();

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (activeConversationId) {
      toggleTyping(activeConversationId, e.target.value.length > 0);
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    sendMessage({
      content: text,
      messageType: 'text',
    });

    setText('');
    setShowEmojiPicker(false);
    if (activeConversationId) {
      toggleTyping(activeConversationId, false);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopAndSendVoice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    sendMessage({
      content: 'Voice note',
      messageType: 'audio',
      audioDuration: recordingSeconds || 3,
    });
    setRecordingSeconds(0);
  };

  const cancelVoice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendSampleImage = () => {
    sendMessage({
      content: 'PulseChat UI layout screenshot',
      messageType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col gap-2 flex-shrink-0 relative">
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 bg-slate-800 border border-slate-700 p-3 rounded-2xl shadow-xl grid grid-cols-6 gap-2 z-20 animate-in fade-in slide-in-from-bottom-2">
          {EMOJI_DRAWER.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setText((prev) => prev + emoji);
              }}
              className="p-2 hover:bg-slate-700 rounded-xl text-lg hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Replying Banner Preview */}
      {replyingToMessage && (
        <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl text-xs border-l-4 border-blue-500">
          <div>
            <span className="font-semibold text-blue-400">
              Replying to{' '}
              {replyingToMessage.senderId === CURRENT_USER.id
                ? 'Yourself'
                : MOCK_USERS[replyingToMessage.senderId]?.displayName || 'Contact'}
            </span>
            <p className="text-slate-300 truncate max-w-md">{replyingToMessage.content}</p>
          </div>
          <button
            onClick={() => setReplyingToMessage(null)}
            className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Control Row */}
      <form onSubmit={handleSendText} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleSendSampleImage}
          title="Attach Image"
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          title="Attachment"
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors hidden sm:block"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {isRecording ? (
          <div className="flex-1 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-red-400 animate-pulse">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              Recording Voice Note: 00:0{recordingSeconds}s
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelVoice}
                className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={stopAndSendVoice}
                className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Write a message..."
            className="flex-1 bg-slate-800/80 text-sm text-slate-100 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        )}

        {text.trim() ? (
          <button
            type="submit"
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          !isRecording && (
            <button
              type="button"
              onClick={startVoiceRecording}
              className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          )
        )}
      </form>
    </div>
  );
};
