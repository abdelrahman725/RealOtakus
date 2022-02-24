import './App.css';
import {useState,useEffect} from 'react'

function App() {
  const [name,setname] = useState()
  const[competitors,setcompitotrs] = useState()
  const LoadUserData = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/data")
    const data = await res.json()
    setname(data.username)
    console.log(data)
  }



  const LoadCompetitors = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/competitors")
    const data = await res.json()
    setcompitotrs(data)

  }


  useEffect(()=>{
   LoadUserData()
   LoadCompetitors()
  },[])

  return (
    <div className="App">
      <h1>
        welcome otakus
      </h1>
      <h2>
        signed in as  {name}
      </h2>
   <h3>
     current competitors : 
   </h3>
   {competitors &&
    <div>

      {competitors.map((competitor)=>(
        <p>
        {competitor.username}
        </p>
      ))}
     
      </div>
  }
  
    </div>
  );
}

export default App;
