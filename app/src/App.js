import './App.css';
//import Competitors from './Components/Dashboard';
import Profile from './Components/Profile';
import Animes from './Components/AnimesList';
import React, {useState,useEffect} from 'react'
import getCookie from './GetCookie.js'
import Game from './Components/Game';

export const GamdeModeContext  = React.createContext()

function App() {
  
  const CsrfToken = getCookie('csrftoken')
 


  //const[AllCompetitors,setCompitotrs] = useState()
  const[AllAnimes,setanimes] = useState()
  const[UserData,setUserData] = useState({})
  const [gamequestions,setgamequestions] = useState()


  const[UserDataLoading,setUserDataLoading] = useState(true)
  //const[DashBoardLoding,setDashBoardLoding] = useState(true)
  
  const[AnimesLoading,setAnimesLoading] = useState(true)
  const[QuestionsLoading,setQuestionsLoading] = useState(true)


  const[GameMode,setGameMode] = useState(false)
  
  const  server  = "http://127.0.0.1:8000"
  const  userdataurl = `${server}/home/data`
  const  animesurl = `${server}/home/animes`
  
  //const  competitorsurl = `${server}/home/competitors`
  const  animegameurl = `${server}/home/getgame`
  //const  sendresultsurl = `${server}/home/sendgame`
  
  const  LogoutUrl = `${server}/logout`
  
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



  const  GetAnimes= async()=>
  {
    const res = await fetch(animesurl)
    const animes  = await res.json()
    setanimes(animes)
    setAnimesLoading(false)
  }

  
  const GetGame = async(selectedanime)=>
  {

    const res = await fetch(`${animegameurl}/${selectedanime}`)
    const anime_questions  = await res.json()
    console.log("questions: ",anime_questions)
    setgamequestions(anime_questions)
    setQuestionsLoading(false)
    setGameMode(true)
    
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
    GetAnimes()
  },[])



  return (
    <div className="App">
     { !UserDataLoading&& <h1> {"welcome =>"}    { UserData.username} </h1>}

      <br /><br />
      {!AnimesLoading&&!GameMode&&
      <div>
      <Animes allanimes={AllAnimes}  startest={GetGame}/>
    
      </div>
      }
      
      <GamdeModeContext.Provider value={{GameMode,setGameMode}}>
        {GameMode&& <Game questions={gamequestions}/>}
      </GamdeModeContext.Provider>

    </div>
  );
}

export default App;
  