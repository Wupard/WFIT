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
                <div className="w-20 h-20 bg-[var(--accent-glow)] rounded-2xl flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-lg shadow-indigo-500/10 border border-[var(--border-color)]">
                    <Heart size={40} className="drop-shadow-md" />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[var(--text-main)] mb-2">
                    {getTranslation(language, 'about_title')}
                </h1>
                <p className="text-[var(--text-muted)] text-sm md:text-base max-w-lg mx-auto">
                    The vision and dedication behind the WFIT OS Project
                </p>
            </div>

            <div className="glass-card rounded-3xl border border-[var(--border-color)] overflow-hidden relative p-8 md:p-12">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none"></div>

                <div className="relative z-10 space-y-8 text-base leading-relaxed text-[var(--text-main)]">
                    <p className="text-lg md:text-xl font-heading font-medium text-[var(--text-main)] leading-relaxed">
                        {getTranslation(language, 'about_intro')}
                    </p>

                    <div className="p-8 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] relative shadow-inner">
                        <div className="absolute -top-3 left-8 px-3 bg-[var(--bg-main)] text-xs font-semibold text-[var(--accent-primary)] tracking-widest uppercase border border-[var(--border-color)] rounded-full">Core Philosophy</div>
                        <p className="text-[var(--accent-primary)] text-xl font-heading italic font-light leading-relaxed">
                            "{getTranslation(language, 'about_quote')}"
                        </p>
                    </div>

                    <div className="space-y-6 text-[var(--text-muted)]">
                        <p>{getTranslation(language, 'about_outro')}</p>
                        <p>{getTranslation(language, 'about_dev_process')}</p>
                        <p>{getTranslation(language, 'about_signoff')}</p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                        <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider mb-6">Support & Contact</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
                                <span className="text-xs text-[var(--accent-primary)] font-semibold uppercase block mb-1">{getTranslation(language, 'contact_email')}</span>
                                <p className="text-[var(--text-main)] font-medium">wupard@gmail.com</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
                                <span className="text-xs text-[var(--accent-primary)] font-semibold uppercase block mb-1">{getTranslation(language, 'contact_instagram')}</span>
                                <p className="text-[var(--text-main)] font-medium">@yusufxkahraman</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col items-center justify-center gap-6">
                        <div className="text-center group">
                            <div className="relative">
                                <img
                                    src="/signature-dark-final.png"
                                    alt="Yusuf Kahraman Signature"
                                    className="h-24 md:h-28 object-contain filter drop-shadow-[0_0_10px_rgba(99,102,241,0.2)] opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                            <div className="mt-4">
                                <span className="text-xs text-[var(--text-muted)] font-semibold tracking-widest uppercase">{getTranslation(language, 'developer_role')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
