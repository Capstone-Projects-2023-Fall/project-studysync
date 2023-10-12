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
import DashboardCom from './js/models/user.js'; 
import LoginForm from './js/react/LoginForm';
import SignUpForm from './js/react/SignUpForm';
function App() {

  const user = new User();
  const [isLoggedIn, setIsLoggedIn] = useState(user.isLoggedIn);

  

  const handleLogin = () => {
    user.login();  
    setIsLoggedIn(user.isLoggedIn);
  };

  const navbarItemsLoggedOut = [
    { label: 'Login', link: '/login', action: handleLogin },
    { label: 'Sign Up', link: '/signup' },
  ];

  const navbarItemsLoggedIn = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'StudyTool', link: '/studytool', submenu: [
      { label: 'Submenu 1', link: '/submenu1' },
      { label: 'Submenu 2', link: '/submenu2' },
    ]},
    { label: 'Message', icon: 'message-icon', link: '/messages' },
    //... add other items
  ];

  return (
    <div className="app">
        <Navbar items={isLoggedIn ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
        <Routes>
            <Route path="/" element={
                isLoggedIn 
                ? <DashboardCom /> 
                : <div className="login-center">Please log in or sign up to continue</div>
            } />
            <Route path='/login' element={<LoginForm user={user}/>}/>
            <Route path='/signup' element={<SignUpForm/>}/>            
        </Routes>
    </div>
);

// return (<>  
//   Homepage

// </>)


 
}

export default App;
