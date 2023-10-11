import { useState,useEffect } from 'react';
import '../../App.css';
import User from '../models/user';
import { BrowserRouter as Router, Switch, 
    Route, Redirect,} from "react-router-dom";
import App from '../../App';


function LoginForm(){

    const[email,setEmail] = useState('');
    const [password,setPassword ] = useState('');




    //replace this 
    const user = new User();

    const handlesubmit = (e) =>{
        e.preventDefault();
        user.email = email;
        user.password = password;
        user.login();
    }
    


    return(
        <div>
            
            <div className='login-header'>
                Log In Here!
            </div>
            <form onSubmit={handlesubmit} className='loginform'>
                <label id='email-label' for="email">Enter email</label>
                <br></br>
                <input id="email" type="text" placeholder="example@gmail.com"
                value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <br></br>
                <label id='password-label' for="password">Enter password</label>
                <br></br>
                <input id="password" type="password" placeholder="Enter your password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required/>                
                <br></br>
                <input id='btn' type="submit" />
            </form>
        </div>
    )
}

export default LoginForm;