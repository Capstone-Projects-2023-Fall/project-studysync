// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATW2gjlAHdLUCCzKj_8cYs3ySkV2O0wVI",
  authDomain: "studysync-5de5d.firebaseapp.com",
  databaseURL: "https://studysync-5de5d-default-rtdb.firebaseio.com",
  projectId: "studysync-5de5d",
  storageBucket: "studysync-5de5d.appspot.com",
  messagingSenderId: "745714428379",
  appId: "1:745714428379:web:5046014a7f3a176ed29ffe",
  measurementId: "G-R8RR5PT3DN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
