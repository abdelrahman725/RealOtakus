import './App.css';
import Competitors from './Components/Dashboard';
import Profile from './Components/Profile';
import Animes from './Components/AnimesList';
import {useState,useEffect} from 'react'
import getCookie from './GetCookie.js'

function App() {
  
  const CsrfToken = getCookie('csrftoken')
  const SessionId = getCookie('sessionid')
 
  const[AllCompetitors,setCompitotrs] = useState()
  const[AllAnimes,setanimes] = useState()
  const[UserData,setUserData] = useState({})
  const [questions,setquestions] = useState()


  const[UserDataLoading,setUserDataLoading] = useState(true)
  const[DashBoardLoding,setDashBoardLoding] = useState(true)
  const[AnimesLoading,setAnimesLoading] = useState(true)
  const[QuestionsLoading,setQuestionsLoading] = useState(true)


  const[GameMode,setGameMode] = useState(false)
  
  const  server  = "http://127.0.0.1:8000"
  const LogoutUrl = `${server}/logout`
  const  userdataurl = `${server}/home/data`
  const  animesurl = `${server}/home/animes`
  //const  competitorsurl = `${server}/home/competitors`

  // const  animegameurl = `${server}/home/getgame`
  //const  sendresultsurl = `${server}/home/sendgame`
  
  
  const SwitchViews = (view)=>
  {
    // to do 
    //set all views to none except the passed view
  }



  const GetUserData = async()=>
  {
    const res = await fetch(userdataurl)
    const data= await res.json()
    setUserData(data)
    setUserDataLoading(false)
  }


  const GetCompetitors = async()=>
  {
    const res = await fetch("")
    const data = await res.json()
    setCompitotrs(data)
    setDashBoardLoding(false)
  }

  
  const  GetAnimes= async()=>
  {
    const res = await fetch(animesurl,{
      credentials:"include"
    })
    const animes  = await res.json()
    setanimes(animes)
    setAnimesLoading(false)
  }

  
  const GetGame = async(anime)=>
  {

  }

  const SendGame = async()=>
  {

    const send = await fetch("",{

      method : 'POST',
      headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': CsrfToken,
      },
      body: JSON.stringify({
        results:"results"
      })
    })
    const res  = await send.json()
    console.log(res)

  }


  useEffect(()=>{
    GetUserData()
  },[])



  return (
    <div className="App">
     { !UserDataLoading&&
        <h1> welcome ya  { UserData.username} </h1>}
      <h2>
       so you are a real otaku ? lets see
      </h2>
  
      <a href={LogoutUrl}><strong>Logout</strong> </a>
      <br /><br />
    {!AnimesLoading&&
    
      <Animes animes={AllAnimes}/>}
    </div>
  );
}

export default App;
  