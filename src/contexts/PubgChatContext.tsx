
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

export interface PubgChatMessage {
  id: string;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  userName?: string;
  targetUser?: string;
  created_at: string;
}

interface PubgChatContextType {
  messages: PubgChatMessage[];
  addMessage: (text: string, sender: 'admin' | 'user', userName?: string, targetUser?: string) => void;
  clearMessages: () => void;
  loading: boolean;
}

const PubgChatContext = createContext<PubgChatContextType | undefined>(undefined);

export function PubgChatProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<PubgChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل الرسائل من قاعدة البيانات
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('pubg_chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading PUBG chat messages:', error);
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
      console.error('Error loading PUBG chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // إعداد التحديثات الفورية
    const channel = supabase
      .channel('pubg_chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pubg_chat_messages'
        },
        (payload) => {
          console.log('Real-time PUBG chat update:', payload);
          
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
        .from('pubg_chat_messages')
        .insert([messageData]);

      if (error) {
        console.error('Error adding PUBG chat message:', error);
        throw error;
      }

      console.log('PUBG chat message added successfully');
    } catch (error) {
      console.error('Error adding PUBG chat message:', error);
    }
  };

  const clearMessages = async () => {
    try {
      const { error } = await supabase
        .from('pubg_chat_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing PUBG chat messages:', error);
        throw error;
      }

      setMessages([]);
      console.log('PUBG chat messages cleared successfully');
    } catch (error) {
      console.error('Error clearing PUBG chat messages:', error);
    }
  };

  return (
    <PubgChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      loading,
    }}>
      {children}
    </PubgChatContext.Provider>
  );
}

export function usePubgChat() {
  const context = useContext(PubgChatContext);
  if (context === undefined) {
    throw new Error('usePubgChat must be used within a PubgChatProvider');
  }
  return context;
}
