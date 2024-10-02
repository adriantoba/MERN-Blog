// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-a8bac.firebaseapp.com",
  projectId: "mern-blog-a8bac",
  storageBucket: "mern-blog-a8bac.appspot.com",
  messagingSenderId: "509974182979",
  appId: "1:509974182979:web:b2e2e310c3e46284b028f6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
