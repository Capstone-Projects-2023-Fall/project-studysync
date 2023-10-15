// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

import keys from './keys';
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: keys.apiKey,
  authDomain: keys.authDomain,
  projectId: keys.projectId,
  storageBucket: keys.storageBucket,
  messagingSenderId: keys.messagingSenderId,
  appId: keys.appId,
  measurementId: keys.measurementId
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const database = getFirestore(app);

