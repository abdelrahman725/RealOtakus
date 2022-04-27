import './App.css';
import Bar from './Components/Bar' 
import { UserProfile } from './Components/TheProfile/UserProfile';
import Contripution from './Components/Contripution'
import Animes from './Components/AnimesList'
import TheDashBoard from './Components/TheDashBoard'
import AnimesDashBoard from './Components/AnimesDashBoard'

import React, {useState,useEffect,createContext} from 'react'
import getCookie from './GetCookie'
import Countries from './Countries.json' 
export const GamdeModeContext  = createContext()
export const ServerContext  = createContext()

function App() {
  
  const CsrfToken = getCookie('csrftoken')
  
  const[UserData,setUserData] = useState({})
  const[Noti,setNoti] = useState({})
  
  const [HomeView,setHomeView] = useState(true)
  const [ContributionView,setContributionView]= useState(false)
  const [AnimesChoicesView,setAnimesChoicesView] = useState(false)
  const [ProfileView,setProfileView] = useState(false)

  const [GameMode,setGameMode] = useState(false)
  
  const  server  = "http://127.0.0.1:8000"
  const  socket_server = "ws://127.0.0.1:8000/ws/socket-server/"
  const  userdataurl = `${server}/home/data`

  // connect to django via web socket to recieve notifications once they are creaetd
  const mysocket = ()=>
  {
    const socket_connection = new WebSocket(socket_server)
    socket_connection.onmessage = (e)=>{
      const data = JSON.parse(e.data)
      console.log(data)
    }
  }


  // called if the user doesn't have a saved country (which is always the case initially for the first logged)
  const getUserCountryViaApiServiceThenSaveCountry = async()=>
  {
    // after we got the country successfully we save it to the database so subsequent requests for the same user don't have to query the country from the api service again

    const res = await fetch("http://ip-api.com/json")
    const data = await res.json()

    const postcountry = async (country)=>
      {
        const sendcountry = await fetch(userdataurl,{
        
          method : 'POST',
          headers : {
            'Content-type': 'application/json',
            'X-CSRFToken': CsrfToken,
          },
          body: JSON.stringify({
            country:country
          })
        })
        const res  = await sendcountry.json()
        console.log(res)
      }
    
   postcountry(data.countryCode.toLowerCase())

  
  }


  const GetUserData = async()=>
  {
    const res = await fetch(userdataurl)
    const data= await res.json()

    if (!data.user_data.country)
    {
      getUserCountryViaApiServiceThenSaveCountry()
    } 
    
    //console.log(data.user_data)
    setUserData(data.user_data)

    //console.log(data.notifications)
    setNoti(data.notifications)
  }

  
  const ManageViews = (View)=>
  {
    if(View==="home"){
      setHomeView(true);setAnimesChoicesView(false); setContributionView(false); setProfileView(false)
    } 

    if(View==="profile"){
      setProfileView(true); setHomeView(false) ;
      ;setAnimesChoicesView(false); setContributionView(false);
    } 
    
    if(View==="contribution"){
      setContributionView(true); setHomeView(false) ;
    } 
    
    if(View==="quiz"){
      setAnimesChoicesView(true); setHomeView(false) ;
    } 

  }
  
  useEffect(()=>{
    GetUserData()
    //mysocket()
  },[])


    

return (
 <div className="App">
  <br />
  
  {UserData&& <Bar data={UserData} noti = {Noti} showprofile={!GameMode && ManageViews} />}
     
  <ServerContext.Provider value={{server}}>
  <GamdeModeContext.Provider value={{GameMode, setGameMode, setUserData}}>

       { !GameMode&& <button onClick={()=>ManageViews("home")}>Home</button>}

       { HomeView&&<button onClick={()=>ManageViews("quiz")}>test your inner otaku !</button> }

       { HomeView&& <button onClick={()=>ManageViews("contribution")}>Contribute a question</button> }

        { ProfileView && <UserProfile/>}

        { ContributionView && <Contripution />}

        { AnimesChoicesView&& <Animes/>} 
        


        { HomeView&& <TheDashBoard/>}
        {/* {HomeView&& <AnimesDashBoard/>} */}
    

     

  
  </GamdeModeContext.Provider>
  </ServerContext.Provider>
  </div>
 )
}

export default App