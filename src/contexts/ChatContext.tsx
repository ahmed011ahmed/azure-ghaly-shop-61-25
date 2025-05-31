import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  userName?: string;
  targetUser?: string; // المستخدم المستهدف للرسالة
  created_at?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'admin' | 'user', userName?: string, targetUser?: string) => void;
  clearMessages: () => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const CHAT_STORAGE_KEY = 'chat_messages';

export function ChatProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل الرسائل من localStorage
  useEffect(() => {
    const loadMessages = () => {
      try {
        const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // مراقبة تغييرات localStorage للتحديث الفوري
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CHAT_STORAGE_KEY && e.newValue) {
        try {
          const parsedMessages = JSON.parse(e.newValue).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // للتحديث الفوري في نفس التبويب
    const handleCustomUpdate = () => {
      loadMessages();
    };

    window.addEventListener('chatUpdate', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatUpdate', handleCustomUpdate);
    };
  }, []);

  const saveMessages = (newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
      // إشعار التبويبات الأخرى بالتحديث
      window.dispatchEvent(new CustomEvent('chatUpdate'));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  };

  const addMessage = async (text: string, sender: 'admin' | 'user', userName?: string, targetUser?: string) => {
    try {
      const newMessage: ChatMessage = {
        id: Date.now() + Math.random(), // معرف فريد
        text,
        sender,
        timestamp: new Date(),
        userName: sender === 'user' ? (profile?.nickname || userName || 'مستخدم') : undefined,
        targetUser: targetUser, // إضافة المستخدم المستهدف
        created_at: new Date().toISOString()
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      
      console.log('Message added:', newMessage);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const clearMessages = async () => {
    try {
      setMessages([]);
      saveMessages([]);
      console.log('Messages cleared');
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      loading,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
