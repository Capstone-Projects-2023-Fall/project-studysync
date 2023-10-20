import './App.css';
/*import {app ,database} from "./firebase.js"*/
/*import {getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword} from "firebase/auth";*/
import {useEffect, useState} from "react";
/*import {collection, addDoc} from 'firebase/firestore';*/
/*import keys from './keys';*/
import Navbar from './js/react/Navbar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './js/models/user.js'; 
import DashboardCom from './js/react/DashboardCom.js'; 
import FlashcardComponent from './js/react/flashcardCom.jsx'; 
import LoginPage from './js/react/LoginPage';
import SignUpForm from './js/react/SignUpForm';
import useUser from './js/react/useUser';
import PasswordReset from './js/react/PasswordReset';
import { getItemById, addItemToArrayField,removeItemFromArrayField, setField} from './js/utils/sharedRepositoryFunctions';
import { database, flashcardRepository, notificationRepository, userRepository } from './firebase';
import { Notification } from './js/models/notification';
import { FlashCardRepository } from './js/repositories/FlashCardRepository';
import { FlashcardItem, FlashcardSet } from './js/models/flashcard';

function App() {

  const {user} = useUser();


  
  const handleLogin = () => {

  };

  const navbarItemsLoggedOut = [
    { label: 'Log in', link: '/login', action: handleLogin },
    { label: 'Sign Up', link: '/signup' },
  ];


/*
  const database_submit= ()=>{
    
    //add a collection called users if it does not exists, 
    //add email and password to users collection if it exists already
    addDoc(collectionRef,{
      email: data.email,
      password: data.password
    }).then(()=>{
      alert("Data added");
    }).catch((err)=>{
      alert(err.message);
    })
  }*/

  const navbarItemsLoggedIn = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'StudyTool', link: '/studytool'},
    { label: 'Message', icon: 'message-icon', link: '/messages' },
    //... add other items
  ];


   const flashCardItems = [
    new FlashcardItem("a", "b"),
    new FlashcardItem("c", "d"),
    new FlashcardItem("e", "f"),
    new FlashcardItem("g", "h")
   ]

  //  const flashcardSet = new FlashcardSet("TEST FLASHCARD","Nps6CcZIzRbXn5rZecg4GsJok4s1", flashCardItems)
  //  flashcardRepository.addFlashCard(flashcardSet)
  //  .then((res)=>{console.log("res: ", res)})
  //  .catch((err)=>{console.log("err: ", err)})

  flashcardRepository.addToSharedWith("40RtXasadj3DqoL0HoUL", "Nps6CcZIzRbXn5rZecg4GsJok4s1")
   
  return (
    <div className="app">
        <Navbar items={user ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/studytool" element={<FlashcardComponent />} />
            <Route path="/" element={
                user 
                ? <DashboardCom /> 
                : <div className="login-center">Please log in or sign up to continue</div>
            } />
            <Route path='/passwordreset' element={<PasswordReset/>}/>
            <Route path='/signup' element={<SignUpForm/>}/>            
        </Routes>
    </div>
);



}

export default App;
