import { io, Socket } from 'socket.io-client';
import { useChatStore } from './store';

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;

  // Initialize socket connection (defaults to current origin or fallback)
  socket = io(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000', {
    autoConnect: true,
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('[PulseChat] Socket connected:', socket?.id);
  });

  socket.on('new_message', (payload) => {
    const { sendMessage } = useChatStore.getState();
    if (payload && payload.content) {
      sendMessage({
        content: payload.content,
        messageType: payload.messageType || 'text',
        mediaUrl: payload.mediaUrl,
      });
    }
  });

  socket.on('user_presence', (payload) => {
    if (payload && payload.userId) {
      const { toggleTyping } = useChatStore.getState();
      toggleTyping(payload.conversationId || 'conv-1', !!payload.isTyping);
    }
  });

  return socket;
};

export const getSocket = () => socket;
