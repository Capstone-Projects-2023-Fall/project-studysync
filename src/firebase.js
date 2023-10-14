// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {keys} from "./keys";


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
export const database = getFirestore(app);

const quizRepository = new QuizRepository(database)
const userRepository = new UserRepository(database, quizRepository)



export function getData(){
  userRepository.getAllUsers().then((users)=>{
    console.log("get all users: ", users)
  }).catch((error)=>{
    console.log("get all users error is: ", error)
  })

  userRepository.getUserByEmail("testing123@gmail.com").then((res)=>{
    console.log("res is: ", res)
  })

  // userRepository.getUserById("8ICTcrOvXgEEPeLCM4UJ").then((user)=>{
  //   console.log("user is: ", user)
  // }).catch((err)=>{
  //   console.log("err banchekry", err)
  // })

  // quizRepository.getAllQuizes().then((quizes)=>{
  //   console.log("quizes: ", quizes)
  // }).catch((error)=>{
  //   console.log("error is: ", error)
  // })

  // userRepository.getUserQuizes("8ICTcrOvXgEEPeLCM4UJ").then((quizes)=>{
  //   console.log("user quizes: ", quizes)
  // }).catch((error)=>{
  //   console.log("error is: ", error)
  // })
}

