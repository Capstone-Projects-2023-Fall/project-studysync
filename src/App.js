import './App.css';
/*import {app ,database} from "./firebase.js"*/
/*import {getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword} from "firebase/auth";*/
import Navbar from './js/react/Navbar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardCom from './js/react/DashboardCom.js'; 
import FlashcardComponent from './js/react/flashcardCom.js'; 
import LoginPage from './js/react/LoginPage';
import SignUpForm from './js/react/SignUpForm';
import useUser from './js/react/useUser';

import FlashcardApp from './js/react/flashcardUICom';
import PasswordReset from './js/react/PasswordReset';
import UserProfile from './js/react/UserProfilePage';
import EditUserProfile from './js/react/EditUserProfile';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';


function App() {

  const {user} = useUser();

  const handleLogin = () => {};

  const navbarItemsLoggedOut = [
    { label: 'Log in', link: '/login', action: handleLogin },
    { label: 'Sign Up', link: '/signup' },
  ];


  const navbarItemsLoggedIn = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'StudyTool', link: '/studytool'},
    { label: 'Message', icon: 'message-icon', link: '/messages' },
    { label: 'Profile', link: `/profile/${user && user.uid}` },
    //... add other items
  ];

  // if(user){
  //   navbarItemsLoggedIn.push(
  //     { label:'Logout',action:signOut(auth)}
  //   )
  // }
  // else{
  //   if(navbarItemsLoggedIn[4]){
  //     navbarItemsLoggedIn.splice(4,1);
  //   }
  // }


  return (
    <div className="app">
        <Navbar items={user ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/studytool" element={<FlashcardComponent />} />
            <Route path="/flashcard-ui/:setId" element={<FlashcardApp />} />
            <Route path="/" element={
                user 
                ? <DashboardCom /> 
                : <div className="login-center">Please log in or sign up to continue</div>
            } />
            <Route path='/passwordreset' element={<PasswordReset/>}/>
            <Route path='/signup' element={<SignUpForm/>}/>  
            <Route path='/profile/:UserId' element={<UserProfile/>}/>
            <Route path='/profile/:data/edit' element={<EditUserProfile/>}/>

        </Routes>
    </div>
);
}

export default App;
