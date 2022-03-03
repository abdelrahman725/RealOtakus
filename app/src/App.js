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

  const[GameMode,setGameMode] = useState(false)

  const server  = "http://127.0.0.1:8000"
  
  const LogoutUrl = `${server}/logout`

  const GetUserData = async()=>
  {
    const res = await fetch(`${server}/home/data`)
    const data= await res.json()
    setUserData(data)
  }


  const GetCompetitors = async()=>
  {
    const res = await fetch(`${server}/home/competitors`)
    const data = await res.json()
    setCompitotrs(data)
    setDashBoardLoding(false)
  }

  const  GetAnimes= async()=>
  {
    const res = await fetch(`${server}/home/animes`)
    const animes  = await res.json()
    setanimes(animes)
  }


  useEffect(()=>{
    GetUserData()
   // GetAnimes()
    // GetCompetitors()
  },[])



  const SwitchViews = (view)=>
  {
    // to do 
    //set all views to none except the passed view
  }
  return (
    <div className="App">
      <h1>
        welcome ya  { UserData.username}
      </h1>
      <h2>
       so you are a real otaku ? lets see
      </h2>
      <a href={LogoutUrl}><strong>Logout</strong> </a>
      {!DashBoardLoding &&<Competitors competitors={AllCompetitors}/>}
      
    </div>
  );
}

export default App;
  