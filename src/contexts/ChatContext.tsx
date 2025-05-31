
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  userName?: string;
  targetUser?: string;
  created_at: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'admin' | 'user', userName?: string, targetUser?: string) => void;
  clearMessages: () => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل الرسائل من قاعدة البيانات
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender as 'admin' | 'user',
        timestamp: new Date(msg.created_at),
        userName: msg.user_name,
        targetUser: msg.target_user,
        created_at: msg.created_at
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // إعداد التحديثات الفورية
    const channel = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMessage = {
              id: payload.new.id,
              text: payload.new.text,
              sender: payload.new.sender as 'admin' | 'user',
              timestamp: new Date(payload.new.created_at),
              userName: payload.new.user_name,
              targetUser: payload.new.target_user,
              created_at: payload.new.created_at
            };
            
            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMessage = async (text: string, sender: 'admin' | 'user', userName?: string, targetUser?: string) => {
    try {
      const messageData = {
        text,
        sender,
        user_name: sender === 'user' ? (profile?.nickname || userName || 'مستخدم') : null,
        target_user: targetUser || null,
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) {
        console.error('Error adding message:', error);
        throw error;
      }

      console.log('Message added successfully');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const clearMessages = async () => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف جميع الرسائل

      if (error) {
        console.error('Error clearing messages:', error);
        throw error;
      }

      setMessages([]);
      console.log('Messages cleared successfully');
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
