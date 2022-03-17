import './App.css';
import DashBoard from './Components/Dashboard'
import Bar from './Components/Bar' 
//import Profile from './Components/Profile'
//import Contripution from './Components/Contripution'
import Animes from './Components/AnimesList'
import React, {useState,useEffect,createContext} from 'react'

export const GamdeModeContext  = createContext()
export const ServerContext  = createContext()

function App() {
  const[UserData,setUserData] = useState({})


  const[GameMode,setGameMode] = useState(false)
  const [Contributionsmode,setContributionsmode]= useState(false)
  const [quiz,setquiz] = useState(false)

  const  server  = "http://127.0.0.1:8000"
  const  userdataurl = `${server}/home/data`

  

  const GetUserData = async()=>
  {
    const res = await fetch(userdataurl)
    const data= await res.json()
    setUserData(data)
  }


  useEffect(()=>{
    GetUserData()
  },[])


return (

  <div className="App">

     {UserData&& <Bar data={UserData}/>}

      <h2><a href="http://127.0.0.1:8000/admin" target="_blank" rel="noopener noreferrer">admin</a></h2>

      <ServerContext.Provider value={{server}}>
      
    
      <strong>Dashboard : </strong><hr />
      <DashBoard />
  
       
      <GamdeModeContext.Provider value={{GameMode,setGameMode}}>
        {quiz && <Animes/>}
          {!quiz  && <button onClick={()=>setquiz(true)}>Take quiz !</button> }<br/><br/>


        {/* 
        {!Contributionsmode&& <button onClick={()=>setContributionsmode(true)}>make a contribution !</button>}
        {Contributionsmode&& <Contripution />} 
      */}

      </GamdeModeContext.Provider>

      </ServerContext.Provider>
  </div>
 );
}


export default App;
