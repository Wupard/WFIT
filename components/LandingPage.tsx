import React from 'react';
import { Activity, Dumbbell, Terminal, Brain, Target, MessageSquare, StickyNote, ChevronRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-[#0E0C0B] text-[var(--text-main)] overflow-hidden relative font-sans selection:bg-[var(--accent-primary)] selection:text-black">

            {/* Background Texture & Grids */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,123,42,0.05),transparent_70%)] pointer-events-none"></div>

            {/* Industrial Header Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto border-b-2 border-[#1D1916]">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1D1916] border-2 border-[var(--accent-primary)] p-3 shadow-[4px_4px_0px_#000]">
                        <Activity size={28} className="text-[var(--accent-primary)] animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-heading tracking-[0.2em] uppercase text-stamped">WFIT</span>
                        <span className="text-[8px] font-mono text-[var(--accent-primary)] font-bold tracking-[0.4em]">SYSTEM_VERSION_5.0</span>
                    </div>
                </div>
                <button
                    onClick={onLogin}
                    className="px-8 py-3 bg-[#1D1916] border-2 border-[#26211D] text-[var(--text-main)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all font-heading tracking-widest uppercase text-sm shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    [ ACCESS_PORTAL ]
                </button>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-40 flex flex-col items-center text-center">

                {/* HUD Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#14110F] border-2 border-[#26211D] mb-12 animate-fade-in relative">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-primary)] animate-ping"></div>
                    <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-none"></div>
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">NEW_PROTOCOL: CORE_ANALYTICS // ACTIVE</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-heading font-black tracking-widest mb-10 leading-tight animate-fade-in uppercase text-stamped">
                    FORGE THE<br />
                    <span className="text-[var(--accent-primary)]">ULTIMATE_SELF</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mb-12 font-mono uppercase tracking-tight leading-relaxed animate-fade-in opacity-80" style={{ animationDelay: '0.2s' }}>
                    <span className="text-[var(--accent-primary)] font-bold">// DATA_STREAM:</span> WFIT IS AN ANALOG-INSPIRED COMMAND HUB FOR HUMAN OPTIMIZATION. RUN STRENGTH ANALYTICS, COMMAND NEURAL AI INTELLIGENCE, AND ARCHIVE CRITICAL TRAINING DATA.
                </p>

                <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={onLogin}
                        className="btn-primary px-12 py-6 text-3xl tracking-[0.3em] shadow-[12px_12px_0px_rgba(0,0,0,0.8)] hover:shadow-[15px_15px_0px_rgba(0,0,0,0.9)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-4"
                    >
                        START_INITIALIZATION <ChevronRight size={32} />
                    </button>

                    <button className="px-12 py-6 bg-transparent border-4 border-[#1D1916] text-[#3D3630] font-heading text-2xl tracking-widest uppercase hover:text-[var(--text-main)] hover:border-[#26211D] transition-all">
                        SYS_SPECS
                    </button>
                </div>

                {/* Industrial Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32 w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[#26211D] text-left hover:border-[var(--accent-primary)] group transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={120} /></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-[#14110F] border-2 border-[#26211D] flex items-center justify-center mb-8 group-hover:border-[var(--accent-primary)] transition-all shadow-[4px_4px_0px_#000]">
                                <MessageSquare size={32} className="text-[var(--accent-primary)]" />
                            </div>
                            <h3 className="text-2xl font-heading tracking-widest mb-4 uppercase text-[var(--text-main)]">NEURAL_COMMAND</h3>
                            <p className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-tight leading-relaxed line-clamp-3">ADVANCED AI CENTRAL INTERFACE FOR REAL-TIME BIOMETRIC INTELLIGENCE AND TRAINING STRATEGY.</p>
                            <div className="mt-6 flex gap-2"><div className="w-1.5 h-1.5 bg-[var(--accent-primary)]"></div><div className="w-1.5 h-1.5 bg-[#26211D]"></div><div className="w-1.5 h-1.5 bg-[#26211D]"></div></div>
                        </div>
                    </div>

                    <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[#26211D] text-left hover:border-[var(--accent-primary)] group transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={120} /></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-[#14110F] border-2 border-[#26211D] flex items-center justify-center mb-8 group-hover:border-[var(--accent-primary)] transition-all shadow-[4px_4px_0px_#000]">
                                <Target size={32} className="text-[var(--accent-primary)]" />
                            </div>
                            <h3 className="text-2xl font-heading tracking-widest mb-4 uppercase text-[var(--text-main)]">STRENGTH_ANALYTICS</h3>
                            <p className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-tight leading-relaxed line-clamp-3">HIGH-PRECISION COMMAND HUB FOR CALCULATING 1RM (ONE REP MAX) AND ADAPTIVE STRENGTH PROXIES.</p>
                            <div className="mt-6 flex gap-2"><div className="w-1.5 h-1.5 bg-[#26211D]"></div><div className="w-1.5 h-1.5 bg-[var(--accent-primary)]"></div><div className="w-1.5 h-1.5 bg-[#26211D]"></div></div>
                        </div>
                    </div>

                    <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[#26211D] text-left hover:border-[var(--accent-primary)] group transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><StickyNote size={120} /></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-[#14110F] border-2 border-[#26211D] flex items-center justify-center mb-8 group-hover:border-[var(--accent-primary)] transition-all shadow-[4px_4px_0px_#000]">
                                <StickyNote size={32} className="text-[var(--accent-primary)]" />
                            </div>
                            <h3 className="text-2xl font-heading tracking-widest mb-4 uppercase text-[var(--text-main)]">ARCHIVE_X9</h3>
                            <p className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-tight leading-relaxed line-clamp-3">ANALOG-STYLE STICKY NOTE ARCHIVE FOR RECORDING CRITICAL TRAINING OBSERVATIONS AND LOGS.</p>
                            <div className="mt-6 flex gap-2"><div className="w-1.5 h-1.5 bg-[#26211D]"></div><div className="w-1.5 h-1.5 bg-[#26211D]"></div><div className="w-1.5 h-1.5 bg-[var(--accent-primary)]"></div></div>
                        </div>
                    </div>
                </div>

                {/* Stamped Background Text */}
                <div className="absolute bottom-10 left-10 pointer-events-none opacity-[0.03] rotate-[-90deg] origin-bottom-left select-none">
                    <span className="text-[200px] font-heading font-black tracking-[1em] uppercase">WFIT_PROTOCOL_X</span>
                </div>
            </main>

            <footer className="relative z-50 border-t-2 border-[#1D1916] py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Terminal size={12} className="text-[var(--accent-primary)]" />
                        <span className="text-[9px] font-mono font-bold text-[#3D3630] uppercase tracking-widest">ENCRYPTED_TRANSMISSION // ALL_RIGHTS_RESERVED</span>
                    </div>
                    <div className="flex gap-8">
                        <span className="text-[9px] font-mono font-bold text-[#3D3630] uppercase tracking-widest">BUILD_STAMP: 2026.04.10</span>
                        <span className="text-[9px] font-mono font-bold text-[#3D3630] uppercase tracking-widest">STATUS: OPERATIONAL</span>
                    </div>
                </div>
            </footer>

            <style>{`
                .text-stamped {
                    text-shadow: 1px 1px 0px rgba(255,255,255,0.05), -1px -1px 0px rgba(0,0,0,0.5);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                .animate-float {
                    animation: float 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
