
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useChat } from '../../contexts/ChatContext';

const AdminChat = () => {
  const { messages, addMessage, clearMessages } = useChat();
  const [newMessage, setNewMessage] = useState('');
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
      addMessage(newMessage.trim(), isUserMode ? 'user' : 'admin', isUserMode ? userName : undefined);
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
      </CardHeader>

      <CardContent className="bg-slate-950 flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
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
                    {message.sender === 'admin' ? 'الإدارة' : message.userName || 'مستخدم'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`اكتب رسالة ${isUserMode ? 'كمستخدم' : 'كإدارة'}...`}
              className="flex-1 bg-gray-800/50 border-gray-600 text-white"
            />
            <Button
              type="submit"
              className={`${
                isUserMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25'
              }`}
              disabled={!newMessage.trim() || (isUserMode && !userName.trim())}
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
