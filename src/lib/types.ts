export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  about: string;
  isOnline: boolean;
  lastSeenAt: string;
}

export interface Reaction {
  id: string;
  messageId: string;
  userId: string;
  reactionCode: string; // e.g. '❤️', '🔥', '😂', '😮', '😢', '👍'
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  parentMessageId?: string;
  parentMessagePreview?: {
    senderName: string;
    content: string;
  };
  content: string;
  mediaUrl?: string;
  audioDuration?: number; // duration in seconds for voice notes
  messageType: MessageType;
  status: MessageStatus;
  reactions: Reaction[];
  createdAt: string;
  isDeleted?: boolean;
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  title?: string;
  avatarUrl?: string;
  participantIds: string[];
  unreadCount: number;
  lastMessage?: Message;
  updatedAt: string;
  isTyping?: boolean;
  typingUser?: string;
}
