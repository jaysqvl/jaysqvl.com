'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
  bgColor: string;
}

export default function ChatWindow({ onClose, bgColor }: ChatWindowProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle client-side only initialization
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        role: 'assistant',
        content: "Welcome to my website! This chatbot is equipped with knowledge of most of my recent work and experience. Ask it anything about me."
      }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mounted]);

  // Focus input when chat opens
  useEffect(() => {
    if (mounted) {
      inputRef.current?.focus();
    }
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(msg => msg.role !== 'system'),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const data = await response.json();
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error. I'm still under development so check back later to see if I work!" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Don't render anything during SSR
  if (!mounted) return null;

  // Determine text color based on background
  const isDark = bgColor === '#1a1a1a';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedTextColor = isDark ? '#a1a1aa' : '#71717a';
  const inputBgColor = isDark ? '#2a2a2a' : '#f4f4f5';
  const messageBgColor = isDark ? '#2a2a2a' : '#f4f4f5';
  const userMessageBgColor = isDark ? '#7c3aed' : '#8b5cf6';
  const borderColor = isDark ? '#2a2a2a' : '#e4e4e7';

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b" 
        style={{ backgroundColor: bgColor, borderColor: borderColor }}
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/profile.jpg" alt="Jay" />
            <AvatarFallback>JE</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm" style={{ color: textColor }}>Chat with Jay</h3>
            <p className="text-xs" style={{ color: mutedTextColor }}>Ask me anything</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-10"
          style={{ backgroundColor: 'transparent', color: textColor }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Messages */}
      <div 
        className="flex-1 overflow-auto p-4" 
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col gap-4">
          {messages.filter(msg => msg.role !== 'system').map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className="max-w-[80%] rounded-lg px-3 py-2"
                style={{ 
                  backgroundColor: message.role === 'user' ? userMessageBgColor : messageBgColor,
                  color: message.role === 'user' ? '#ffffff' : textColor
                }}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-3 py-2" style={{ backgroundColor: messageBgColor }}>
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: textColor }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div 
        className="p-3 border-t"
        style={{ backgroundColor: bgColor, borderColor: borderColor }}
      >
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about Jay..."
            className="min-h-10 resize-none"
            style={{ backgroundColor: inputBgColor, color: textColor }}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="w-10 h-10 flex items-center justify-center rounded-md"
            style={{ 
              backgroundColor: userMessageBgColor, 
              color: '#ffffff',
              opacity: isLoading || !input.trim() ? 0.5 : 1,
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
} 