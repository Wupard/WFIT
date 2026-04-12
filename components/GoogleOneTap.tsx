import React, { useEffect } from 'react';
import { signInWithCredential, auth } from '../services/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

interface GoogleOneTapProps {
    onSuccess?: (user: any) => void;
    onError?: (error: any) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onSuccess, onError }) => {
    useEffect(() => {
        const initializeGoogleOneTap = () => {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: "73949061224-ejvepvb2r4iuruprjlhovcfl6b252g8d.apps.googleusercontent.com",
                callback: async (response: any) => {
                    try {
                        const credential = GoogleAuthProvider.credential(response.credential);
                        const result = await signInWithCredential(auth, credential);
                        if (onSuccess) onSuccess(result.user);
                    } catch (error) {
                        console.error("One Tap Login Failed:", error);
                        if (onError) onError(error);
                    }
                },
                auto_select: false, 
                cancel_on_tap_outside: true
            });

            // Resmi Google Butonunu Render Et
            const buttonDiv = document.getElementById('google-button-container');
            if (buttonDiv) {
                window.google.accounts.id.renderButton(
                    buttonDiv,
                    { theme: 'filled_black', size: 'large', shape: 'pill', width: '380' }
                );
            }

            // One Tap Prompt (Sağ üstteki panel)
            window.google.accounts.id.prompt();
        };

        // Scripti Dinamik Olarak Yükle
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleOneTap;
        document.body.appendChild(script);

        return () => {
            // Cleanup script if needed, but usually fine to leave for single page app
            document.body.removeChild(script);
        };
    }, [onSuccess, onError]);

    return (
        <div id="credential_picker_container" className="fixed top-0 right-0 z-[100]"></div>
    );
};
