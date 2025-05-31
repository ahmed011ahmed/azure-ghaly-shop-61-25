
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useChat } from '../../contexts/ChatContext';

const AdminChat = () => {
  const { messages, addMessage, clearMessages, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [isUserMode, setIsUserMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // الحصول على قائمة العملاء الفريدة
  const uniqueCustomers = Array.from(
    new Set(messages
      .filter(msg => msg.sender === 'user' && msg.userName)
      .map(msg => msg.userName)
    )
  );

  return (
    <Card className="gaming-card h-[600px] flex flex-col">
      <CardHeader className="bg-slate-900 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <div>
              <CardTitle className="text-white">شات الإدارة</CardTitle>
              <CardDescription className="text-gray-300">
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
          <div className="mt-3">
            <Input
              placeholder="اكتب اسم المستخدم..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>
        )}

        {/* اختيار العميل للرد عليه */}
        {!isUserMode && (
          <div className="mt-3 space-y-2">
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
                <p className="text-sm text-gray-400 mb-2">العملاء النشطين:</p>
                <div className="flex flex-wrap gap-2">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-2">جاري تحميل الرسائل...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">لا توجد رسائل بعد.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
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
                  <p className="text-white text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="mb-2">
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
              placeholder={`اكتب رسالة ${isUserMode ? 'كمستخدم' : selectedCustomer ? `لـ ${selectedCustomer}` : 'عامة'}...`}
              className="flex-1 bg-gray-800/50 border-gray-600 text-white"
              disabled={loading}
            />
            <Button
              type="submit"
              className={`${
                isUserMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25'
              }`}
              disabled={!newMessage.trim() || (isUserMode && !userName.trim()) || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminChat;
