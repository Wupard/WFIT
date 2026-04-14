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
        let isCancelled = false;

        const initializeGoogleOneTap = () => {
            if (isCancelled || !window.google) return;
            try {
                window.google.accounts.id.initialize({
                    client_id: "73949061224-ejvepvb2r4iuruprjlhovcfl6b252g8d.apps.googleusercontent.com",
                    callback: async (response: any) => {
                        try {
                            const credential = GoogleAuthProvider.credential(response.credential);
                            const result = await signInWithCredential(auth, credential);
                            if (onSuccess && !isCancelled) onSuccess(result.user);
                        } catch (error) {
                            console.error("One Tap Login Failed:", error);
                            if (onError && !isCancelled) onError(error);
                        }
                    },
                    auto_select: false, 
                    cancel_on_tap_outside: true,
                    ux_mode: 'popup'
                });

                window.google.accounts.id.prompt();
            } catch(err) {
                console.log("One tap initialize bypassed");
            }
        };

        const existingScript = document.getElementById('google-gsi-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'google-gsi-script';
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleOneTap;
            document.body.appendChild(script);
        } else if (window.google) {
            initializeGoogleOneTap();
        } else {
            existingScript.addEventListener('load', initializeGoogleOneTap);
        }

        return () => {
            isCancelled = true;
            if (window.google && window.google.accounts && window.google.accounts.id) {
                window.google.accounts.id.cancel();
            }
            if (existingScript) {
                existingScript.removeEventListener('load', initializeGoogleOneTap);
            }
        };
    }, [onSuccess, onError]);

    return (
        <div id="credential_picker_container" className="fixed top-0 right-0 z-[100]"></div>
    );
};
