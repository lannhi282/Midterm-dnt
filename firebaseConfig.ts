// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDoixA3ojoFf1cPC6kvGF5KwXjW3BlZuYs",
  authDomain: "midterm-dnt.firebaseapp.com",
  projectId: "midterm-dnt",
  storageBucket: "midterm-dnt.firebasestorage.app",
  messagingSenderId: "907472510882",
  appId: "1:907472510882:web:06d3b99b3354f72b0fdcfb",
  measurementId: "G-MYX1LFFL4B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
