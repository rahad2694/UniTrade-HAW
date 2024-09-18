// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDclS0IvnJMYQoeUiCzNUTFNMV9TAtQuCk",
  authDomain: "unitrade-62b63.firebaseapp.com",
  projectId: "unitrade-62b63",
  storageBucket: "unitrade-62b63.appspot.com",
  messagingSenderId: "682971287212",
  appId: "1:682971287212:web:1e0da2f24998cf13515909",
  measurementId: "G-1587BBHDHE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;
