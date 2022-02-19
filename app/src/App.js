import './App.css';
import {useState,useEffect} from 'react'
import NotAuth from './NotAuth'

function App() {

  const[authenticated,setauthenticated] =useState(true)

  return (
    <div className="App">
      <h1>
        My Frontend
      </h1>
      {authenticated && <NotAuth/>}
    </div>
  );
}

export default App;
