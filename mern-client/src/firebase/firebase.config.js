// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDWHi7j-KQWfaRMGAzjS6bG6MzIQ0VA-U",
  authDomain: "mern-book-store-a4f3c.firebaseapp.com",
  projectId: "mern-book-store-a4f3c",
  storageBucket: "mern-book-store-a4f3c.appspot.com",
  messagingSenderId: "819955079395",
  appId: "1:819955079395:web:486e72c3b7c3ee907e8dd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;