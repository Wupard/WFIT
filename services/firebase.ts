// services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signInWithCredential } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// BURAYA Firebase konsolundan aldığın kodları yapıştır
const firebaseConfig = {
  apiKey: "AIzaSyCTFplgiY7IfVTyGE6mOqrmjPhwJ3oFg-o",
  authDomain: "wupard.xyz",
  projectId: "wfit-9de7b",
  storageBucket: "wfit-9de7b.firebasestorage.app",
  messagingSenderId: "641357902140",
  appId: "1:641357902140:web:51ec8f14c674da60a2ee39"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Giriş Fonksiyonu
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login hatası:", error);
    throw error;
  }
};

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signInWithCredential };

// Çıkış Fonksiyonu
export const logoutUser = async () => {
  await signOut(auth);
};

// Veri Kaydetme (Kullanıcının tüm datasını tek seferde günceller)
// Firebase undefined değerleri kabul etmez, bu yüzden temizliyoruz
const removeUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = removeUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
};

export const saveUserData = async (userId: string, data: any) => {
  try {
    const cleanedData = removeUndefined(data);
    await setDoc(doc(db, "users", userId), cleanedData, { merge: true });
  } catch (error) {
    console.error("Veri kaydetme hatası:", error);
  }
};

// Veri Çekme
export const getUserData = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
