
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User, Loader2, Image, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../hooks/useAuth';

const CustomerChat = () => {
  const { messages, addMessage, loading } = useChat();
  const { user, profile } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        addMessage(`[صورة]: ${imageData}`, 'user', profile?.nickname);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isImageMessage = (text: string) => {
    return text.startsWith('[صورة]: ');
  };

  const isLinkMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };

  const renderMessageContent = (text: string) => {
    if (isImageMessage(text)) {
      const imageData = text.replace('[صورة]: ', '');
      return (
        <div className="mt-2">
          <img 
            src={imageData} 
            alt="صورة مرسلة" 
            className="max-w-xs max-h-48 rounded-lg object-cover cursor-pointer"
            onClick={() => window.open(imageData, '_blank')}
          />
        </div>
      );
    }

    if (isLinkMessage(text)) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);
      
      return (
        <div>
          {parts.map((part, index) => {
            if (urlRegex.test(part)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-400 underline break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </div>
      );
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
    return (
      <Card className="gaming-card">
        <CardContent className="bg-slate-950 text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">يجب تسجيل الدخول أولاً للتواصل مع فريق الدعم</p>
          <Button className="bg-gaming-gradient">
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gaming-card h-[500px] flex flex-col">
      <CardHeader className="bg-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <div>
            <CardTitle className="text-white">دعم العملاء</CardTitle>
            <CardDescription className="text-gray-300">
              تواصل مع فريق الدعم - مرحباً {profile?.nickname}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-slate-950 flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-2">جاري تحميل الرسائل...</span>
            </div>
          ) : customerMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
              </div>
            </div>
          ) : (
            customerMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'admin'
                      ? 'bg-purple-600/20 border border-purple-500/30'
                      : 'bg-blue-600/20 border border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-medium ${
                      message.sender === 'admin' ? 'text-purple-300' : 'text-blue-300'
                    }`}>
                      {message.sender === 'admin' ? 'فريق الدعم' : 'أنت'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'admin' && message.targetUser && (
                      <span className="text-xs bg-purple-700/30 px-1 rounded text-purple-200">
                        خاص
                      </span>
                    )}
                  </div>
                  <div className="text-white text-sm leading-relaxed">
                    {renderMessageContent(message.text)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك أو رابط..."
              className="flex-1 bg-gray-800/50 border-gray-600 text-white"
              disabled={loading}
            />
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              type="submit"
              className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
              disabled={!newMessage.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            يمكنك إرسال النصوص والصور والروابط
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerChat;
