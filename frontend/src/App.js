import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {useState} from 'react';




function App() {

  const [name,setName] = useState('');
  const [major,setMajor] = useState('');

  //Connect backend to frontend
  async function FetchResponse(){
    const response = await axios.get('/test/Harris');
    const data = response.data;
    setName(data.name);
    setMajor(data.major);
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={FetchResponse}>Click</button>
        <p className='Name'>Name: {name}</p>
        <p className='Major'>Major: {major}</p>
      </header>
    </div>
  );
}

export default App;
