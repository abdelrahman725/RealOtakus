import './App.css';
//import DashBoard from './Components/Dashboard'
//import Profile from './Components/Profile'
import Contripution from './Components/Contripution'
import Animes from './Components/AnimesList'
import React, {useState,useEffect,createContext} from 'react'
//import getCookie from './GetCookie.js'

export const GamdeModeContext  = createContext()

export const ServerContext  = createContext()

function App() {

  const[UserData,setUserData] = useState({})
  const[AllAnimes,setanimes] = useState()
  //const[AllCompetitors,setCompitotrs] = useState()

  const[UserDataLoading,setUserDataLoading] = useState(true)
  //const[DashBoardLoding,setDashBoardLoding] = useState(true)
  
  const[AnimesLoading,setAnimesLoading] = useState(true)

  const[GameMode,setGameMode] = useState(false)

  const [Contributionsmode,setContributionsmode]= useState(false)
  const[takequizmode,settakequizmode] = useState(false)

  
  const  server  = "http://127.0.0.1:8000"
  const  userdataurl = `${server}/home/data`
  const  animesurl = `${server}/home/animes`
  
  //const  competitorsurl = `${server}/home/competitors`
  
  //const  sendresultsurl = `${server}/home/sendgame`
  
  const  LogoutUrl = `${server}/logout`
  


  const GetUserData = async()=>
  {
    const res = await fetch(userdataurl)
    const data= await res.json()
    setUserData(data)
    setUserDataLoading(false)
  }



  // animes with questions
  const  GetAnimes= async()=>
  {
    const res = await fetch(animesurl)
    const animes  = await res.json()
    setanimes(animes)
    setAnimesLoading(false)
  }


  useEffect(()=>{
    GetUserData()
    GetAnimes()
  },[])


return (

  <div className="App">

      <ServerContext.Provider value={{server}}>

     {!UserDataLoading&& <h1>{"welcome => "}{UserData.username}</h1>}<br/><br/>
  
      <GamdeModeContext.Provider value={{GameMode,setGameMode}}>

   
       {takequizmode && <Animes allanimes={AllAnimes} />}
       {!takequizmode && <button onClick={()=>settakequizmode(true)}>Take quiz !</button> }<br/><br/>

      {!takequizmode&&<><strong>Dashboard : </strong><hr /></> }<br/> 


      
      {/* {!Contributionsmode&& <button onClick={()=>setContributionsmode(true)}>make a contribution !</button>}
      {Contributionsmode&& <Contripution />} */}
    

      </GamdeModeContext.Provider>

      </ServerContext.Provider>
  </div>
 );
}


export default App;
