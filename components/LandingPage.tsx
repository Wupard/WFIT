import React from 'react';
import { Activity, Dumbbell, Brain, Target, MessageSquare, StickyNote, ChevronRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden relative font-body selection:bg-[var(--accent-primary)] selection:text-white">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-2.5 rounded-xl shadow-lg">
                        <Activity size={24} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-heading text-[var(--text-main)]">WFIT</span>
                        <span className="text-[10px] text-[var(--text-muted)]">Personal Fitness Hub</span>
                    </div>
                </div>
                <button
                    onClick={onLogin}
                    className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-primary)] transition-all rounded-xl text-sm font-medium backdrop-blur-xl"
                >
                    Sign In
                </button>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-full mb-10 animate-fade-in backdrop-blur-sm">
                    <Sparkles size={14} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-medium text-[var(--accent-primary)]">AI-Powered Training Intelligence</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-8 leading-tight animate-fade-in">
                    Your Personal<br />
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Fitness Hub</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                    Track your strength, analyze your progress with AI intelligence, and keep organized training notes — all in one beautifully designed dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={onLogin}
                        className="btn-primary px-10 py-4 text-lg flex items-center justify-center gap-3 rounded-xl"
                    >
                        Get Started <ChevronRight size={20} />
                    </button>

                    <button className="px-10 py-4 bg-transparent border border-[var(--border-color)] text-[var(--text-muted)] rounded-xl text-lg hover:text-[var(--text-main)] hover:border-[var(--border-strong)] transition-all backdrop-blur-sm">
                        Learn More
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="vintage-card p-8 text-left group hover:border-[var(--accent-primary)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-5 group-hover:from-purple-500/30 group-hover:to-indigo-500/30 transition-all">
                            <MessageSquare size={24} className="text-[var(--accent-primary)]" />
                        </div>
                        <h3 className="text-lg font-heading mb-2 text-[var(--text-main)]">AI Assistant</h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Get real-time training advice and biometric intelligence from our advanced AI chatbot.</p>
                    </div>

                    <div className="vintage-card p-8 text-left group hover:border-[var(--accent-primary)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-5 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all">
                            <Target size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-lg font-heading mb-2 text-[var(--text-main)]">1RM Calculator</h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Precision strength analytics to calculate your one-rep max and track progressive overload.</p>
                    </div>

                    <div className="vintage-card p-8 text-left group hover:border-[var(--accent-primary)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-5 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                            <StickyNote size={24} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-heading mb-2 text-[var(--text-main)]">Smart Notes</h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Keep track of your training observations and critical workout logs with sticky notes.</p>
                    </div>
                </div>
            </main>

            <footer className="relative z-50 border-t border-[var(--border-color)] py-8 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-[var(--text-muted)]">© 2026 WFIT. All rights reserved.</span>
                    <span className="text-xs text-[var(--text-muted)]">v5.0 — Status: Operational</span>
                </div>
            </footer>
        </div>
    );
};
