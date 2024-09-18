// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_apiKey,
  authDomain: process.env.VITE_authDomain,
  projectId: process.env.VITE_projectId,
  storageBucket: process.env.VITE_storageBucket,
  messagingSenderId: process.env.VITE_messagingSenderId,
  appId: process.env.VITE_appId,
  measurementId: process.env.VITE_measurementId,
};

console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;
