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
            // Script yüklendi mi kontrol et
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: "73949061224-ejvepvb2r4iuruprjlhovcfl6b252g8d.apps.googleusercontent.com", // User's Web Client ID
                callback: async (response: any) => {
                    try {
                        // Google'dan gelen ID Token
                        const credential = GoogleAuthProvider.credential(response.credential);

                        // Firebase ile giriş yap
                        const result = await signInWithCredential(auth, credential);

                        if (onSuccess) onSuccess(result.user);
                    } catch (error) {
                        console.error("One Tap Login Failed:", error);
                        if (onError) onError(error);
                    }
                },
                auto_select: true, // Otomatik seçimi dener
                cancel_on_tap_outside: false
            });

            // Popup'ı göster
            window.google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log("One Tap skipped/not displayed:", notification.getNotDisplayedReason());
                }
            });
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
