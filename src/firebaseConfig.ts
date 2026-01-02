// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, getDoc,query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyC-v1iogndwtkQJuCQ6kR_ZLChJbdmDgAM",
    authDomain: "refuse-monitoring-agent.firebaseapp.com",
    projectId: "refuse-monitoring-agent",
    storageBucket: "refuse-monitoring-agent.firebasestorage.app",
    messagingSenderId: "948798684715",
    appId: "1:948798684715:web:0848cb74772550d33a346e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { collection, addDoc, getDocs,updateDoc, doc, getDoc, query, where };

export default app;
