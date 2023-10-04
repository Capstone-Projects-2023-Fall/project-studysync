import './App.css';
/*import {app ,database} from "./firebase.js"*/
/*import {getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword} from "firebase/auth";*/
import {useState} from "react";
/*import {collection, addDoc} from 'firebase/firestore';*/
/*import keys from './keys';*/
import Navbar from './js/react/Navbar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './js/models/user.js'; 
import DashboardCom from './js/models/user.js'; 


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
            {/* other routes */}
        </Routes>
    </div>
);



  /*let auth = getAuth();
  const [data,setData] = useState({});
  //Database collection called users
  const collectionRef = collection(database,'users');

  const handleInput = (event)=>{
    let newInput = {[event.target.name]: event.target.value };
    setData({...data,...newInput});
  }

  const navbarItems = [
    { label: 'Login', link: '/login' },
    { label: 'Sign Up', link: '/signup' },
  ];

  const handleSubmit= ()=>{
    //createUserWithEmailAndPassword(auth, data.email,data.password)
    signInWithEmailAndPassword(auth, data.email,data.password)      
    .then((response)=>{
        console.log(response.user);
        alert('Signed in!');
      })
      .catch((err)=>{
        alert(err.message);
      });
  };


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
