import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2, User, Loader2, Image, Link } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useChat } from '../../contexts/ChatContext';

const AdminChat = () => {
  const { messages, addMessage, clearMessages, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [isUserMode, setIsUserMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // إشعار صوتي عند استلام رسالة جديدة من العملاء
  useEffect(() => {
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
      const lastMessage = messages[messages.length - 1];
      // تشغيل الصوت فقط إذا كانت الرسالة من عميل
      if (lastMessage.sender === 'user') {
        playNotificationSound();
      }
    }
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBT2Q1fLNeSs=';
      audio.volume = 0.3;
      audio.play().catch(e => console.log('صوت الإشعار غير متاح:', e));
    } catch (error) {
      console.log('خطأ في تشغيل الصوت:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (isUserMode && !userName.trim()) {
        alert('يرجى إدخال اسم المستخدم أولاً');
        return;
      }
      
      const messageText = newMessage.trim();
      
      if (!isUserMode) {
        // رسالة من الإدارة
        addMessage(messageText, 'admin', undefined, selectedCustomer || undefined);
      } else {
        // رسالة كمستخدم
        addMessage(messageText, 'user', userName);
      }
      
      setNewMessage('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        const messageText = `[صورة]: ${imageData}`;
        
        if (!isUserMode) {
          // رسالة من الإدارة
          addMessage(messageText, 'admin', undefined, selectedCustomer || undefined);
        } else {
          if (!userName.trim()) {
            alert('يرجى إدخال اسم المستخدم أولاً');
            return;
          }
          // رسالة كمستخدم
          addMessage(messageText, 'user', userName);
        }
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

  // الحصول على قائمة العملاء الفريدة
  const uniqueCustomers = Array.from(
    new Set(messages
      .filter(msg => msg.sender === 'user' && msg.userName)
      .map(msg => msg.userName)
    )
  );

  return (
    <Card className="gaming-card h-[500px] flex flex-col">
      <CardHeader className="bg-slate-900 flex-shrink-0 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle className="text-white text-lg">شات الإدارة</CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                التواصل مع العملاء ({messages.length} رسالة)
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsUserMode(!isUserMode)}
              variant={isUserMode ? "default" : "outline"}
              size="sm"
              className={isUserMode ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500 text-blue-400"}
            >
              <User className="w-4 h-4 mr-1" />
              {isUserMode ? 'وضع المستخدم' : 'وضع الإدارة'}
            </Button>
            <Button
              onClick={clearMessages}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {isUserMode && (
          <div className="mt-2">
            <Input
              placeholder="اكتب اسم المستخدم..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white text-sm"
            />
          </div>
        )}

        {!isUserMode && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">الرد على:</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 text-white rounded px-2 py-1 text-sm"
              >
                <option value="">رسالة عامة لجميع العملاء</option>
                {uniqueCustomers.map((customer, index) => (
                  <option key={index} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
            
            {uniqueCustomers.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-1">العملاء النشطين:</p>
                <div className="flex flex-wrap gap-1">
                  {uniqueCustomers.map((customer, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        selectedCustomer === customer
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300'
                      }`}
                    >
                      {customer}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="bg-slate-950 flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-2">جاري تحميل الرسائل...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300 text-sm">لا توجد رسائل بعد.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-2.5 ${
                      message.sender === 'admin'
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'bg-blue-600/20 border border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1 flex-wrap">
                      <span className={`text-xs font-medium ${
                        message.sender === 'admin' ? 'text-purple-300' : 'text-blue-300'
                      }`}>
                        {message.sender === 'admin' ? 'الإدارة' : message.userName || 'مستخدم'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'admin' && message.targetUser && (
                        <span className="text-xs bg-purple-700 px-1 rounded text-white">
                          إلى: {message.targetUser}
                        </span>
                      )}
                      {message.sender === 'admin' && !message.targetUser && (
                        <span className="text-xs bg-green-700 px-1 rounded text-white">
                          عام
                        </span>
                      )}
                    </div>
                    <div className="text-white text-sm leading-relaxed">
                      {renderMessageContent(message.text)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-3">
          <div className="mb-1">
            <p className="text-xs text-gray-400">
              {!isUserMode && selectedCustomer 
                ? `سيتم إرسال الرسالة إلى: ${selectedCustomer}`
                : !isUserMode 
                ? 'رسالة عامة لجميع العملاء'
                : `رسالة كمستخدم: ${userName}`
              }
            </p>
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`اكتب رسالة أو رابط ${isUserMode ? 'كمستخدم' : selectedCustomer ? `لـ ${selectedCustomer}` : 'عامة'}...`}
              className="flex-1 bg-gray-800/50 border-gray-600 text-white text-sm"
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
              className="bg-green-600 hover:bg-green-700 px-3"
              disabled={loading || (isUserMode && !userName.trim())}
              size="sm"
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              type="submit"
              className={`px-3 ${
                isUserMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25'
              }`}
              disabled={!newMessage.trim() || (isUserMode && !userName.trim()) || loading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-1">
            يمكنك إرسال النصوص والصور والروابط
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminChat;
