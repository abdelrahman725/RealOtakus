import './App.css';
import Competitors from './Components/Dashboard';
import Profile from './Components/Profile';
import {useState,useEffect} from 'react'

function App() {
 
  const[AllCompetitors,setCompitotrs] = useState()
  const[Animes,setanimes] = useState()
  const[UserData,setUserData] = useState({})

  const[UserDataLoading,setUserDataLoading] = useState(true)
  const[DashBoardLoding,setDashBoardLoding] = useState(true)
  const[AnimesLoading,setAnimesLoading] = useState(true)


  const GetUserData = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/data")
    const data= await res.json()
    setUserData(data)
  }


  const GetCompetitors = async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/competitors")
    const data = await res.json()
    setCompitotrs(data)
    setDashBoardLoding(false)
  }

  const  GetAnimes= async()=>
  {
    const res = await fetch("http://127.0.0.1:8000/home/animes")
    const animes  = await res.json()
    setanimes(animes)
  }


  useEffect(()=>{
    GetUserData()
    GetAnimes()
    // GetCompetitors()

  },[])

  return (
    <div className="App">
      <h1>
        welcome ya  { UserData.username}
      </h1>
      <h2>
       so you are a real otaku ? lets see
      </h2>
      {!DashBoardLoding &&<Competitors competitors={AllCompetitors}/>}
      

    </div>
  );
}

export default App;
