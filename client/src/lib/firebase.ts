// client/src/lib/firebase.js
// Purpose: Initialize Firebase app & export Firestore instance for reuse.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  
// Read config from Vite envs (safe to expose in frontend; not secrets)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize once per app lifecycle
const app = initializeApp(firebaseConfig);

// Export a ready-to-use Firestore instance
export const db = getFirestore(app);

export const storage = getStorage(app);  // Export Firebase Storage instance