import React, { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: <Check size={20} className="text-white" />,
        error: <AlertCircle size={20} className="text-white" />,
        info: <AlertCircle size={20} className="text-white" />
    };

    const content = (
        <div className="fixed top-24 right-4 z-[9999] animate-slide-in-right">
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 min-w-[300px] border border-white/10`}>
                <div className="p-1 bg-white/20 rounded-full">
                    {icons[type]}
                </div>
                <p className="font-medium flex-1">{message}</p>
                <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};
