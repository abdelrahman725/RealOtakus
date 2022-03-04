import './App.css';
import Competitors from './Components/Dashboard';
//import Profile from './Components/Profile';
import Animes from './Components/AnimesList';
import {useState,useEffect} from 'react'

function App() {
 
  const[AllCompetitors,setCompitotrs] = useState()
  const[AllAnimes,setanimes] = useState()
  const[UserData,setUserData] = useState({})
  const [questions,setquestions] = useState()



  const[UserDataLoading,setUserDataLoading] = useState(true)
  const[DashBoardLoding,setDashBoardLoding] = useState(true)
  const[AnimesLoading,setAnimesLoading] = useState(true)
  const[QuestionsLoading,setQuestionsLoading] = useState(true)

  //const[GameMode,setGameMode] = useState(false)

  const server  = "http://127.0.0.1:8000"
  
  const LogoutUrl = `${server}/logout`

  const GetUserData = async()=>
  {
    const res = await fetch(`${server}/home/data`)
    const data= await res.json()
    setUserData(data)
    setUserDataLoading(false)
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
    setAnimesLoading(false)
  }


  useEffect(()=>{
    GetUserData()
    GetAnimes()
    // GetCompetitors()
  },[])

const FetchGame= async(anime) =>{
  const res = await fetch(`${server}/home/game/${anime}`)
  const requested_questions  = await res.json()
  
  console.log(requested_questions)

  setquestions(requested_questions)
  setQuestionsLoading(false)

}


  const SwitchViews = (view)=>
  {
    // to do 
    //set all views to none except the passed view
  }
  return (
    <div className="App">
     { !UserDataLoading&&<h1>
        welcome ya  { UserData.username}
      </h1>}
      <h2>
       so you are a real otaku ? lets see
      </h2>
      <a href={LogoutUrl}><strong>Logout</strong> </a>
      <br /><br />
      {/* {!DashBoardLoding &&<Competitors competitors={AllCompetitors}/>} */}
      {!AnimesLoading &&<Animes animes={AllAnimes} GetTest={FetchGame}/>}
      
    </div>
  );
}

export default App;
  