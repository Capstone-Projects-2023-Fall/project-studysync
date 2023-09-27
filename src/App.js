import './App.css';
import {app ,database} from "./firebase.js"
import {getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword} from "firebase/auth";
import {useState} from "react";
import {collection, addDoc} from 'firebase/firestore';
import keys from './keys';

function App() {


  let auth = getAuth();
  const [data,setData] = useState({});
  //Database collection called users
  const collectionRef = collection(database,'users');

  const handleInput = (event)=>{
    let newInput = {[event.target.name]: event.target.value };
    setData({...data,...newInput});
  }

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
       <button onClick={handleSubmit}>Auth Button</button>
       <hr></hr>

       <button onClick={database_submit}>Database Button</button>
    </div>
  );
}

export default App;
