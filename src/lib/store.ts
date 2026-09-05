import { create } from 'zustand';
import { User, Conversation, Message, MessageType } from './types';

export const CURRENT_USER: User = {
  id: 'user-me',
  username: 'jules_dev',
  displayName: 'Jules Software Engineer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Building PulseChat 🚀 | Code & Design',
  isOnline: true,
  lastSeenAt: new Date().toISOString(),
};

export const MOCK_USERS: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    username: 'sarah_m',
    displayName: 'Sarah Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    about: 'Design & Visuals 🎨',
    isOnline: true,
    lastSeenAt: new Date().toISOString(),
  },
  'user-2': {
    id: 'user-2',
    username: 'alex_tech',
    displayName: 'Alex Rivers',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    about: 'Fullstack Dev & Tech Enthusiast 💻',
    isOnline: false,
    lastSeenAt: '2026-09-05T15:30:00Z',
  },
  'user-3': {
    id: 'user-3',
    username: 'pulse_team',
    displayName: 'PulseChat Product Core',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    about: 'Official PulseChat Announcement Group 📢',
    isOnline: true,
    lastSeenAt: new Date().toISOString(),
  },
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    type: 'DIRECT',
    title: 'Sarah Miller',
    avatarUrl: MOCK_USERS['user-1'].avatarUrl,
    participantIds: ['user-me', 'user-1'],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    isTyping: false,
  },
  {
    id: 'conv-2',
    type: 'DIRECT',
    title: 'Alex Rivers',
    avatarUrl: MOCK_USERS['user-2'].avatarUrl,
    participantIds: ['user-me', 'user-2'],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isTyping: false,
  },
  {
    id: 'conv-3',
    type: 'GROUP',
    title: 'PulseChat Product Core 🚀',
    avatarUrl: MOCK_USERS['user-3'].avatarUrl,
    participantIds: ['user-me', 'user-1', 'user-2', 'user-3'],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isTyping: false,
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-101',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Hey Jules! How is the new PulseChat UI coming along?',
      messageType: 'text',
      status: 'read',
      reactions: [{ id: 'r1', messageId: 'msg-101', userId: 'user-me', reactionCode: '❤️' }],
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'msg-102',
      conversationId: 'conv-1',
      senderId: 'user-me',
      content: 'It is looking super crisp! Hybrid of WhatsApp simplicity + IG DM reactions + TikTok interaction feel 🔥',
      messageType: 'text',
      status: 'read',
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      id: 'msg-103',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Check out this new component concept!',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      messageType: 'image',
      status: 'read',
      reactions: [{ id: 'r2', messageId: 'msg-103', userId: 'user-me', reactionCode: '🔥' }],
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'msg-104',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Listen to my audio feedback on the mobile swipe gesture',
      audioDuration: 8,
      messageType: 'audio',
      status: 'delivered',
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-201',
      conversationId: 'conv-2',
      senderId: 'user-2',
      content: 'Did we finalize the Redis PubSub clustering schema?',
      messageType: 'text',
      status: 'read',
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'msg-202',
      conversationId: 'conv-2',
      senderId: 'user-me',
      content: 'Yes! Check ARCHITECTURE.md for sequence diagram.',
      messageType: 'text',
      status: 'read',
      reactions: [{ id: 'r3', messageId: 'msg-202', userId: 'user-2', reactionCode: '👍' }],
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ],
  'conv-3': [
    {
      id: 'msg-301',
      conversationId: 'conv-3',
      senderId: 'user-3',
      content: 'Welcome everyone to PulseChat official release milestone test channel! 🚀',
      messageType: 'text',
      status: 'read',
      reactions: [
        { id: 'r4', messageId: 'msg-301', userId: 'user-1', reactionCode: '❤️' },
        { id: 'r5', messageId: 'msg-301', userId: 'user-2', reactionCode: '🔥' },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ],
};

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string;
  messages: Record<string, Message[]>;
  replyingToMessage: Message | null;
  searchQuery: string;

  // Actions
  setActiveConversation: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setReplyingToMessage: (msg: Message | null) => void;
  sendMessage: (payload: {
    content: string;
    messageType?: MessageType;
    mediaUrl?: string;
    audioDuration?: number;
  }) => void;
  addReaction: (messageId: string, reactionCode: string) => void;
  toggleTyping: (convId: string, isTyping: boolean) => void;
  deleteMessage: (messageId: string) => void;
  markConversationAsRead: (convId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: 'conv-1',
  messages: INITIAL_MESSAGES,
  replyingToMessage: null,
  searchQuery: '',

  setActiveConversation: (id: string) => {
    set({ activeConversationId: id, replyingToMessage: null });
    get().markConversationAsRead(id);
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setReplyingToMessage: (msg: Message | null) => set({ replyingToMessage: msg }),

  sendMessage: ({ content, messageType = 'text', mediaUrl, audioDuration }) => {
    const { activeConversationId, replyingToMessage, messages } = get();
    if (!activeConversationId) return;

    const newMessageId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: newMessageId,
      conversationId: activeConversationId,
      senderId: CURRENT_USER.id,
      content,
      mediaUrl,
      audioDuration,
      messageType,
      status: 'pending',
      reactions: [],
      createdAt: new Date().toISOString(),
      ...(replyingToMessage
        ? {
            parentMessageId: replyingToMessage.id,
            parentMessagePreview: {
              senderName:
                replyingToMessage.senderId === CURRENT_USER.id
                  ? 'You'
                  : MOCK_USERS[replyingToMessage.senderId]?.displayName || 'Contact',
              content: replyingToMessage.content || 'Media message',
            },
          }
        : {}),
    };

    const currentConvMsgs = messages[activeConversationId] || [];
    set({
      messages: {
        ...messages,
        [activeConversationId]: [...currentConvMsgs, newMsg],
      },
      replyingToMessage: null,
    });

    setTimeout(() => {
      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]: (state.messages[activeConversationId] || []).map((m) =>
            m.id === newMessageId ? { ...m, status: 'sent' } : m
          ),
        },
      }));
    }, 400);

    setTimeout(() => {
      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]: (state.messages[activeConversationId] || []).map((m) =>
            m.id === newMessageId ? { ...m, status: 'delivered' } : m
          ),
        },
      }));
    }, 1000);

    setTimeout(() => {
      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]: (state.messages[activeConversationId] || []).map((m) =>
            m.id === newMessageId ? { ...m, status: 'read' } : m
          ),
        },
      }));
    }, 2000);

    if (activeConversationId === 'conv-1') {
      setTimeout(() => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === 'conv-1' ? { ...c, isTyping: true } : c
          ),
        }));
      }, 2500);

      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg-auto-${Date.now()}`,
          conversationId: 'conv-1',
          senderId: 'user-1',
          content: 'PulseChat real-time WebSocket connection test passed! 🚀',
          messageType: 'text',
          status: 'read',
          reactions: [{ id: `r-auto`, messageId: `msg-auto`, userId: 'user-me', reactionCode: '❤️' }],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === 'conv-1' ? { ...c, isTyping: false } : c
          ),
          messages: {
            ...state.messages,
            'conv-1': [...(state.messages['conv-1'] || []), replyMsg],
          },
        }));
      }, 4500);
    }
  },

  addReaction: (messageId: string, reactionCode: string) => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return;

    const convMsgs = messages[activeConversationId] || [];
    const updatedMsgs = convMsgs.map((msg) => {
      if (msg.id !== messageId) return msg;

      const existingReactionIndex = msg.reactions.findIndex(
        (r) => r.userId === CURRENT_USER.id && r.reactionCode === reactionCode
      );

      const newReactions = [...msg.reactions];
      if (existingReactionIndex >= 0) {
        newReactions.splice(existingReactionIndex, 1);
      } else {
        newReactions.push({
          id: `react-${Date.now()}`,
          messageId,
          userId: CURRENT_USER.id,
          reactionCode,
        });
      }

      return { ...msg, reactions: newReactions };
    });

    set({
      messages: {
        ...messages,
        [activeConversationId]: updatedMsgs,
      },
    });
  },

  toggleTyping: (convId: string, isTyping: boolean) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId ? { ...c, isTyping } : c
      ),
    }));
  },

  deleteMessage: (messageId: string) => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return;

    const convMsgs = messages[activeConversationId] || [];
    set({
      messages: {
        ...messages,
        [activeConversationId]: convMsgs.map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
        ),
      },
    });
  },

  markConversationAsRead: (convId: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));
