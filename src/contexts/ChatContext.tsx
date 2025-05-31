
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  userName?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'admin' | 'user', userName?: string) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      sender: 'admin',
      timestamp: new Date(),
    }
  ]);

  const addMessage = (text: string, sender: 'admin' | 'user', userName?: string) => {
    const newMessage: ChatMessage = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      text,
      sender,
      timestamp: new Date(),
      userName: sender === 'user' ? userName : undefined
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([{
      id: 1,
      text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      sender: 'admin',
      timestamp: new Date(),
    }]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
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
