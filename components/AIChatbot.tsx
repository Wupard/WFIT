
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
    { role: 'model', text: `Systems Online. Data Link Established. Ask me anything about your training, diet, or physiology, ${user.name}.`, timestamp: new Date() }
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

    const context = `User Name: ${user.name}. Valid app features: Workout, Diet, Posture Analysis. Theme: Vintage Industrial Workshop. Tone: Serious, Disciplined, Technical.`;

    const responseText = await chatWithAI(userMsg.text, context);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
      {/* Chat Window - Vintage Terminal Style */}
      <div
        className={`pointer-events-auto absolute bottom-24 right-0 bg-[#14110F] w-[350px] md:w-[400px] h-[550px] border-2 border-[var(--border-strong)] flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right shadow-[10px_10px_0px_#000] rounded-[2px] ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        <div className="texture-overlay opacity-10"></div>

        {/* Header - Industrial Plate */}
        <div className="bg-[#1D1916] p-4 flex items-center justify-between border-b-2 border-[var(--border-strong)] relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#14110F] border border-[var(--border-color)] text-[var(--accent-primary)] rounded-[2px]">
              <Bot size={20} />
            </div>
            <div>
              <span className="font-heading tracking-[0.2em] text-[var(--accent-primary)] uppercase text-sm">Central Interface</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Biometric Link: ACTIVE</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages - Terminal Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#14110F] relative z-10 custom-scrollbar">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 border-2 ${msg.role === 'user' ? 'bg-[#1D1916] border-[var(--border-color)] text-[var(--accent-primary)] shadow-[2px_2px_0px_#000]' : 'bg-[#14110F] border-[var(--border-strong)] text-[var(--text-muted)]'} rounded-[2px] overflow-hidden`}>
                {msg.role === 'user' ? (
                  user.photoUrl ? <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover opacity-60" /> : <UserIcon size={16} />
                ) : (
                  <Sparkles size={16} className="text-[var(--accent-primary)]" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-4 border rounded-[2px] text-xs leading-relaxed font-mono uppercase tracking-tight ${msg.role === 'user'
                  ? 'bg-[#1D1916] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'bg-[#1D1916] border-[#26211D] text-[var(--text-muted)] shadow-[inset_2px_2px_4px_#000]'
                  }`}
              >
                <div className="prose prose-invert prose-xs max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/20 opacity-50 text-[8px] tracking-[0.2em]">
                  <span>TRANSMISSION_ID_{idx.toString().padStart(3, '0')}</span>
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-[2px] border-2 border-[#26211D] flex items-center justify-center flex-shrink-0 text-[var(--accent-primary)]">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div className="bg-[#1D1916] border border-[#26211D] p-3 rounded-[2px] shadow-[inset_2px_2px_4px_#000] flex gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-pulse shadow-orange"></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-pulse delay-75 shadow-orange"></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-pulse delay-150 shadow-orange"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Technical Command Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#1D1916] border-t-2 border-[var(--border-strong)] flex gap-3 relative z-10">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Command..."
              className="w-full bg-[#14110F] text-[var(--accent-primary)] border border-[#26211D] px-4 py-3 rounded-[2px] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-mono uppercase tracking-widest placeholder:opacity-30 transition-all shadow-[inset_2px_2px_4px_#000]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <span className="text-[10px] font-mono uppercase">Ctrl+Ent</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[var(--accent-primary)] hover:bg-[#A86A25] disabled:opacity-30 disabled:grayscale text-black p-3 rounded-[2px] transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* FAB - Industrial Toggle Switch */}
      <div className="pointer-events-auto relative w-16 h-16 group">
        <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-full rounded-[2px] border-2 flex items-center justify-center transition-all duration-300 shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none overflow-hidden ${isOpen ? 'bg-[#1D1916] border-[var(--accent-primary)] text-[var(--accent-primary)] rotate-90' : 'bg-[#1D1916] border-[var(--border-strong)] text-[var(--text-muted)]'}`}
        >
          {isOpen ? <X size={28} /> : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Bot size={28} className="relative z-10" />
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
