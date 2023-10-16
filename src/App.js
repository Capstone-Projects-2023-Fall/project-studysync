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
import LoginPage from './js/react/LoginPage.js'; 
import FlashcardComponent from './js/react/flashcardCom.jsx'; 
import LoginForm from './js/react/LoginForm';
import SignUpForm from './js/react/SignUpForm';
import useUser from './js/react/useUser';


function App() {

  // const user = new User();
  const {user} = useUser();

  // const [isLoggedIn, setIsLoggedIn] = useState(user);

  
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
            
            <Route path='/signup' element={<SignUpForm/>}/>            
        </Routes>
    </div>
);

// return (<>  
//   Homepage

// </>)





   /* <div className="App">
    
      <input
        name='email'
        placeholder='Email'
        onChange={(event)=> handleInput(event)}/>
      <input
        name='password'
        placeholder='Password'
        onChange={(event)=> handleInput(event)}  
       />  
       <button onClick={handleSubmit}>Auth Button</button>
       <hr></hr>

       <button onClick={database_submit}>Database Button</button>
    </div>*/


}

export default App;
