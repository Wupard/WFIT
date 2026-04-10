import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User as UserIcon } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage, User } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIChatbotProps {
  user: User;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi ${user.name}. I'm your AI fitness assistant. Ask me anything about your training, diet, or physiology.`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `User Name: ${user.name}. Valid app features: Dashboard, 1RM Calculator, Notes, Training Intelligence. Theme: Modern Glassmorphic Dark UI. Tone: Professional, intelligent, helpful, concise.`;

    const responseText = await chatWithAI(userMsg.text, context);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
      {/* Chat Window - Glassmorphic Style */}
      <div
        className={`pointer-events-auto absolute bottom-20 right-0 bg-[var(--bg-card)] backdrop-blur-2xl w-[350px] md:w-[400px] h-[600px] max-h-[80vh] border border-[var(--border-color)] flex flex-col transition-all duration-300 origin-bottom-right rounded-3xl shadow-2xl ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-[rgba(139,92,246,0.05)] p-5 flex items-center justify-between border-b border-[var(--border-color)] rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.1)] to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl shadow-lg border border-white/10">
              <Bot size={20} />
            </div>
            <div>
              <span className="font-heading font-bold text-[var(--text-main)] text-sm tracking-wide block">AI Assistant</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[10px] font-medium text-green-500 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-muted)] hover:text-white bg-[var(--bg-main)] hover:bg-white/10 p-2 rounded-full transition-all relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-[var(--bg-main)] border border-[var(--border-color)]' : 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'}`}>
                {msg.role === 'user' ? (
                  user.photoUrl ? <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon size={14} className="text-[var(--text-muted)]" />
                ) : (
                  <Sparkles size={14} />
                )}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-tr-none shadow-md'
                  : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-tl-none'
                  }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className={`text-[10px] mt-2 font-medium opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                <Sparkles size={14} className="animate-spin" />
              </div>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-[42px]">
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex gap-3 relative z-10 rounded-b-3xl">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] px-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] text-sm placeholder-[var(--text-muted)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* FAB - Glassmorphic */}
      <div className="pointer-events-auto relative w-14 h-14 group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-full"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden hover:scale-105 active:scale-95 border border-white/10 ${isOpen ? 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-white' : 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'}`}
        >
          {isOpen ? <X size={24} /> : (
            <Bot size={24} className="relative z-10" />
          )}
        </button>
      </div>
    </div>
  );
};
