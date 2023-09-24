import logo from './logo.svg';
import './App.css';
import {app } from "./firebase.js"
import {getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword} from "firebase/auth";
import {useState} from "react";

function App() {

  let auth = getAuth();
  const [data,setData] = useState({});

  const handleInput = (event)=>{
    let newInput = {[event.target.name]: event.target.value };
    setData({...data,...newInput});
  }

  const handleSubmit= ()=>{
    // createUserWithEmailAndPassword(auth, data.email,data.password)
    signInWithEmailAndPassword(auth, data.email,data.password)      
    .then((response)=>{
        console.log(response.user);
      })
      .catch((err)=>{
        alert(err.message);
      });
  };

  const abc = ()=>{
    console.log('Buttom worked!')
  }

  return (
    <div className="App">
      <input
        name='email'
        placeholder='Email'
        onChange={(event)=> handleInput(event)}/>
      <input
        name='password'
        placeholder='Password'
        onChange={(event)=> handleInput(event)}  
       />  
       <button onClick={handleSubmit}>Button</button>
    </div>
  );
}

export default App;
