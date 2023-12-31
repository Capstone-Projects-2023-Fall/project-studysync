// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

import keys from "./keys";
import { UserRepository } from "./js/repositories/UserRepository";
import { QuizRepository } from "./js/repositories/QuizRepository";
import { NotificationRepository } from "./js/repositories/NotificationRepository";
import { FlashCardRepository } from "./js/repositories/FlashCardRepository";
import { EventRepository } from "./js/repositories/EventRepository";
const firebaseConfig = {
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    projectId: keys.projectId,
    storageBucket: keys.storageBucket,
    messagingSenderId: keys.messagingSenderId,
    appId: keys.appId,
    measurementId: keys.measurementId,
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const functions = getFunctions(app);

export const quizRepository = new QuizRepository(database);

export const eventRepository = new EventRepository(database);

export const notificationRepository = new NotificationRepository(
    database,
    eventRepository
);
export const flashcardRepository = new FlashCardRepository(database);
export const userRepository = new UserRepository(
    database,
    quizRepository,
    notificationRepository,
    flashcardRepository,
    eventRepository
);

// export const askGPT = async (prompt) => {
//   const askGPTFunction = httpsCallable(functions, 'askGPT');
//   try {
//     const response = await askGPTFunction({ prompt });
//     return response.data;  // This will contain the GPT-3 response
//   } catch (error) {
//     console.error('Error calling GPT-3 through Firebase:', error);
//     throw error;
//   }
// };

// export async function updateUsers() {
//     const collectionRef = collection(database, "users");
//     try {
//         let ids = [];
//         const querySnapshot = await getDocs(collectionRef);

//         querySnapshot.docs.forEach((d) => {
//             ids.push(d.id);
//         });

//         for (const id of ids) {
//             const flashcardSetRef = doc(database, "users", id);

//             await updateDoc(flashcardSetRef, {
//                 newNotifications: 3,
//             });
//         }

//         console.log("doneee");
//     } catch (error) {
//         console.error("Error:", error);
//         return []; // Return an empty array or handle the error as needed
//     }
// }
