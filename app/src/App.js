import './App.css';
import {useState,useEffect} from 'react'

function App() {
 
  const[competitors,setcompitotrs] = useState()
  const[Animes,setanimes] = useState()
  const[UserData,setUserData] = useState({})


  const GetUserData = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/data")
    const data= await res.json()
    setUserData(data)
    console.log(UserData)
  }



  const GetCompetitors = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/competitors")
    const data = await res.json()
    setcompitotrs(data)
  }

  const  GetAnimes= async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/animes")
    const animes  = await res.json()
    setanimes(animes)
  }


  useEffect(()=>{
    GetUserData()
    GetCompetitors()
    GetAnimes()
    

  },[])

  return (
    <div className="App">
      <h1>
      {/* signed in as  {UserData.user}      */}
      </h1>
      <h2>
      so you are a real otaku ? lets see
      </h2>

    </div>
  );
}

export default App;
