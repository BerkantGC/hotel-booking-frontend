'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { fetchService } from '@/utils/fetchService';
import { getSession } from '@/actions/authApi';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAgentProps {
  username: string;
}

export default function AIAgent({ username }: AIAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${username}! I'm your AI assistant. How can I help you with your hotel booking today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    await getAIResponse(userMessage.text)

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

  };

  const getAIResponse = async(userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();

    const session = await getSession();
    try {
        
        const response = await fetch("http://localhost:3001/ai-agent/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${session?.token || ''}`,
            },
            body: JSON.stringify({ message: lowerInput }),
        })
        
        if (!response.ok) {
            return "Sorry, I couldn't process your request. Please try again.";
        }
        
        const data = await response.json();
        if (data.error) {
            return "Sorry, I couldn't process your request. Please try again.";
        }
        
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: data.reply,
            isUser: false,
            timestamp: new Date(),
        }]);
        return data.reply || "I'm not sure how to respond to that.";
    } catch (error) {
        alert(JSON.stringify(error))
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Bot size={24} />
          <span className="hidden sm:inline text-sm font-medium">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-medium">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg rounded-bl-none text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
