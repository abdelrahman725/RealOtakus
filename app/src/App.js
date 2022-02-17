import './App.css';
import {useState,useEffect} from 'react'
function App() {


  const getUsers = async()=>{
  const res = await fetch("http://localhost:8000/leaderboard")
  const data=await res.json()
  console.log(data)
  }

  useEffect(()=>{
  getUsers()
  },[])
  return (
    <div className="App">
      <h1>
        My Frontend
      </h1>
    </div>
  );
}

export default App;
