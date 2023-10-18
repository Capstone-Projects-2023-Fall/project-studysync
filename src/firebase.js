// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { httpsCallable,getFunctions } from 'firebase/functions'
import {getAuth} from "firebase/auth";

import keys from './keys';
import { UserRepository } from "./js/repositories/UserRepository";
import { QuizRepository } from "./js/repositories/QuizRepository";


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
export const functions = getFunctions(app); 

export const quizRepository = new QuizRepository(database)
export const userRepository = new UserRepository(database, quizRepository)


export const askGPT = async (prompt) => {
  const askGPTFunction = httpsCallable(functions, 'askGPT');
  try {
    const response = await askGPTFunction({ prompt });
    return response.data;  // This will contain the GPT-3 response
  } catch (error) {
    console.error('Error calling GPT-3 through Firebase:', error);
    throw error;
  }
};

