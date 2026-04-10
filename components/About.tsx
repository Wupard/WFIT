import React from 'react';
import { Card } from './ui/Card';
import { Heart } from 'lucide-react';

import { getTranslation } from '../translations';
import { Language } from '../types';

interface AboutProps {
    language: Language;
}

export const About: React.FC<AboutProps> = ({ language }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in p-4 pb-20">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#1D1916] border-2 border-[#A83232] rounded-[var(--radius-sm)] flex items-center justify-center mx-auto text-[#A83232] shadow-[6px_6px_0px_#000] rotate-2">
                    <Heart size={40} fill="currentColor" />
                </div>
                <h1 className="text-4xl font-heading text-[var(--text-main)] tracking-widest uppercase text-stamped">
                    {getTranslation(language, 'about_title')}
                </h1>
            </div>

            <Card title="Documentation // Manifesto" className="vintage-card p-0 overflow-hidden">
                <div className="relative p-8 md:p-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-primary)] opacity-5 rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-primary)] opacity-5 rounded-tr-full pointer-events-none"></div>

                    <div className="relative z-10 space-y-8 text-sm leading-relaxed text-[var(--text-muted)] font-mono uppercase tracking-tight">
                        <p className="border-l-2 border-[var(--accent-primary)] pl-6 text-[var(--text-main)] normal-case font-body text-lg italic">
                            {getTranslation(language, 'about_intro')}
                        </p>

                        <div className="p-6 bg-[#14110F] border border-[#26211D] relative">
                            <div className="absolute -top-3 left-6 px-2 bg-[#14110F] text-[10px] font-bold text-[var(--accent-primary)] tracking-widest uppercase">Direct Transmission</div>
                            <p className="text-[var(--accent-primary)] text-2xl pacifico leading-relaxed">
                                {getTranslation(language, 'about_quote')}
                            </p>
                        </div>

                        <div className="space-y-4 text-[var(--text-muted)] normal-case font-body text-base">
                            <p>{getTranslation(language, 'about_outro')}</p>
                            <p>{getTranslation(language, 'about_dev_process')}</p>
                            <p>{getTranslation(language, 'about_signoff')}</p>
                        </div>

                        <div className="bg-[#14110F] p-6 border-2 border-[#26211D] rounded-[2px] relative shadow-[inset_2px_2px_4px_#000]">
                            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-[0.2em] mb-4 border-b border-[#26211D] pb-2">Support & Feedback Channels</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[var(--accent-primary)] font-bold tracking-widest uppercase">{getTranslation(language, 'contact_email')}</span>
                                    <p className="text-[var(--text-main)] font-mono text-xs">wupard@gmail.com</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] text-[var(--accent-primary)] font-bold tracking-widest uppercase">{getTranslation(language, 'contact_instagram')}</span>
                                    <p className="text-[var(--text-main)] font-mono text-xs">yusufxkahraman</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-4 border-t border-[#26211D] flex flex-col items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-5 blur-xl transition-opacity"></div>
                                    <img
                                        src="/signature-dark-final.png"
                                        alt="Yusuf Kahraman Signature"
                                        className="h-28 object-contain filter drop-shadow-[0_0_10px_rgba(200,123,42,0.1)]"
                                    />
                                </div>
                                <div className="mt-4 inline-block px-4 py-1 bg-[#1D1916] border border-[#26211D] rounded-[2px]">
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.4em] font-bold">{getTranslation(language, 'developer_role')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
