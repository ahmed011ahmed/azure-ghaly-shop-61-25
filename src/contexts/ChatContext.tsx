
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  userName?: string;
  created_at?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'admin' | 'user', userName?: string) => void;
  clearMessages: () => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل الرسائل من قاعدة البيانات
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date(msg.created_at),
          userName: msg.user_name,
          created_at: msg.created_at
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // الاشتراك في التحديثات الفورية
    const subscription = supabase
      .channel('chat_messages')
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
              sender: payload.new.sender,
              timestamp: new Date(payload.new.created_at),
              userName: payload.new.user_name,
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
      subscription.unsubscribe();
    };
  }, []);

  const addMessage = async (text: string, sender: 'admin' | 'user', userName?: string) => {
    try {
      const messageData = {
        text,
        sender,
        user_name: sender === 'user' ? (profile?.nickname || userName || 'مستخدم') : null
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) {
        console.error('Error adding message:', error);
        // في حالة الخطأ، أضف الرسالة محلياً كحل بديل
        const newMessage: ChatMessage = {
          id: Math.max(...messages.map(m => m.id), 0) + 1,
          text,
          sender,
          timestamp: new Date(),
          userName: sender === 'user' ? (profile?.nickname || userName || 'مستخدم') : undefined
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error in addMessage:', error);
    }
  };

  const clearMessages = async () => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .neq('id', 0); // حذف جميع الرسائل

      if (error) {
        console.error('Error clearing messages:', error);
        return;
      }

      setMessages([]);
    } catch (error) {
      console.error('Error in clearMessages:', error);
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
