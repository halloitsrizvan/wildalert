import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXdDV4B_c7xEH3gN4PXH2hZedf3OeSdKo",
  authDomain: "multi-hacks.firebaseapp.com",
  projectId: "multi-hacks",
  storageBucket: "multi-hacks.firebasestorage.app",
  messagingSenderId: "928254518012",
  appId: "1:928254518012:web:48e9807a762c1029daad79",
  measurementId: "G-TWRFY2JSYQ"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
