
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User, Loader2, Image, Link, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerChat = () => {
  const {
    messages,
    addMessage,
    loading
  } = useChat();
  const {
    user,
    profile
  } = useAuth();
  const { t, language } = useLanguage();
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // إشعار صوتي محسن مثل الواتساب
  useEffect(() => {
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
      const lastMessage = messages[messages.length - 1];
      // تشغيل الصوت فقط إذا كانت الرسالة من الإدارة
      if (lastMessage.sender === 'admin') {
        playWhatsAppNotificationSound();
      }
    }
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount]);
  
  const playWhatsAppNotificationSound = () => {
    try {
      // صوت إشعار مثل الواتساب
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // تردد الصوت مثل الواتساب
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      // مستوى الصوت
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('خطأ في تشغيل الصوت:', error);
    }
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      addMessage(newMessage.trim(), 'user', profile?.nickname);
      setNewMessage('');
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = event => {
        const imageData = event.target?.result as string;
        addMessage(`${t('chat.image')} ${imageData}`, 'user', profile?.nickname);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const isImageMessage = (text: string) => {
    return text.startsWith(t('chat.image'));
  };
  
  const isLinkMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };
  
  const renderMessageContent = (text: string) => {
    if (isImageMessage(text)) {
      const imageData = text.replace(`${t('chat.image')} `, '');
      return <div className="mt-2">
          <img src={imageData} alt="صورة مرسلة" className="max-w-xs max-h-48 rounded-lg object-cover cursor-pointer" onClick={() => window.open(imageData, '_blank')} />
        </div>;
    }
    if (isLinkMessage(text)) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);
      return <div>
          {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 underline break-all">
                  {part}
                </a>;
          }
          return part;
        })}
        </div>;
    }
    return <span className="break-words">{text}</span>;
  };

  // فلترة الرسائل للعميل الحالي
  const customerMessages = messages.filter(message => {
    if (message.sender === 'admin') {
      // رسائل الإدارة: إما عامة (بدون targetUser) أو موجهة للعميل الحالي
      return !message.targetUser || message.targetUser === profile?.nickname;
    }
    // رسائل العميل: فقط رسائله الخاصة
    return message.userName === profile?.nickname;
  });
  
  if (!user) {
    return <Card className="gaming-card w-full max-w-4xl">
        <CardContent className="bg-slate-950 text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">{t('chat.loginRequired')}</p>
          
        </CardContent>
      </Card>;
  }
  
  return <Card className="gaming-card w-full max-w-4xl h-96 flex flex-col">
      <CardHeader className="bg-slate-900 flex-shrink-0 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle className="text-white text-sm">{t('chat.support')}</CardTitle>
              <CardDescription className="text-gray-300 text-xs">
                {t('chat.hello')} {profile?.nickname}
              </CardDescription>
            </div>
          </div>
          
          {/* عرض المعرف الفريد للمستخدم من الملف الشخصي أو من metadata */}
          {(profile?.unique_id || user?.user_metadata?.unique_id) && (
            <div className="flex items-center space-x-2 bg-purple-600/20 px-3 py-1 rounded-full">
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-purple-300 text-xs">
                {profile?.unique_id || user?.user_metadata?.unique_id}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="bg-slate-950 flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area with Fixed Height and Scroll */}
        <ScrollArea className="flex-1 p-3 h-64">
          {loading ? <div className="flex items-center justify-center h-full">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-2 text-xs">{t('chat.loadingMessages')}</span>
            </div> : customerMessages.length === 0 ? <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-xs">{t('chat.noMessages')}</p>
                {(profile?.unique_id || user?.user_metadata?.unique_id) && (
                  <div className="mt-2 text-xs text-purple-300">
                    <Hash className="w-3 h-3 inline mr-1" />
                    معرفك الفريد: {profile?.unique_id || user?.user_metadata?.unique_id}
                  </div>
                )}
              </div>
            </div> : <div className="space-y-2">
              {customerMessages.map(message => <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-lg p-2 ${message.sender === 'admin' ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className={`text-xs font-medium ${message.sender === 'admin' ? 'text-purple-300' : 'text-blue-300'}`}>
                        {message.sender === 'admin' ? t('chat.supportTeam') : t('chat.you')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'admin' && message.targetUser && <span className="text-xs bg-purple-700/30 px-1 rounded text-purple-200">
                          {t('chat.private')}
                        </span>}
                      {message.sender === 'user' && (profile?.unique_id || user?.user_metadata?.unique_id) && <span className="text-xs bg-blue-700/30 px-1 rounded text-blue-200">
                          {profile?.unique_id || user?.user_metadata?.unique_id}
                        </span>}
                    </div>
                    <div className="text-white text-xs leading-relaxed">
                      {renderMessageContent(message.text)}
                    </div>
                  </div>
                </div>)}
              <div ref={messagesEndRef} />
            </div>}
        </ScrollArea>

        {/* Message Input - Fixed Height */}
        <div className="border-t border-gray-700 p-2 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex space-x-1">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              placeholder={t('chat.placeholder')} 
              className="flex-1 bg-gray-800/50 border-gray-600 text-white text-xs h-8" 
              disabled={loading} 
            />
            
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            
            <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700 px-2 h-8" disabled={loading} size="sm">
              <Image className="w-3 h-3" />
            </Button>
            
            <Button type="submit" className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25 px-2 h-8" disabled={!newMessage.trim() || loading} size="sm">
              <Send className="w-3 h-3" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-1">
            {t('chat.textImagesLinks')}
          </p>
        </div>
      </CardContent>
    </Card>;
};

export default CustomerChat;
