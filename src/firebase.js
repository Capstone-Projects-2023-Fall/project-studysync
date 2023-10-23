// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

import keys from './keys';
import {getAuth} from "firebase/auth";
import { UserRepository } from "./js/repositories/UserRepository";
import { QuizRepository } from "./js/repositories/QuizRepository";
import { NotificationRepository } from "./js/repositories/NotificationRepository";
import { FlashCardRepository } from "./js/repositories/FlashCardRepository";
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

export const quizRepository = new QuizRepository(database)

export const notificationRepository = new NotificationRepository(database)
export const userRepository = new UserRepository(database, quizRepository, notificationRepository)
export const flashcardRepository = new FlashCardRepository(database)

