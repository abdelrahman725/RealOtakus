import './App.css'
import NavBar from './Components/NavBar'
import Notifications from './Components/Notifications'
import Contripution from './Components/Contripution'
import QuizAnimes from './Components/QuizAnimes'
import TheDashBoard from './Components/TheDashBoard'
import getCookie from './GetCookie'
import { UserProfile } from './Components/TheProfile/UserProfile'

import {useState,useEffect,createContext} from 'react'

export const GamdeModeContext  = createContext()
export const ServerContext  = createContext()

function App() {
  
  const CsrfToken = getCookie('csrftoken')
  
  const [UserData,setUserData] = useState({})
  const [notifications,setnotifications] = useState()
  const [GameMode,setGameMode] = useState(false)
  // views :
  const [HomeView,setHomeView] = useState(true)
  const [NotificationsView,setNotificationsView]= useState(false)
  const [ContributionView,setContributionView]= useState(false)
  const [QuizAnimesView,setQuizAnimesView] = useState(false)
  const [ProfileView,setProfileView] = useState(false)
  const [test,settest] = useState(0)
  const NUMBER_OF_QUIZ_QUESTIONS = 5 
  
  const  server  = "http://127.0.0.1:8000"
  const  socket_server = "ws://127.0.0.1:8000/ws/socket-server/"
  const  userdataurl = `${server}/home/data`

  // connect to django via web socket to recieve realtime notifications 
  const mysocket = ()=>
  {
    const socket_connection = new WebSocket(socket_server)
    socket_connection.onmessage = (e)=>{
    const data = JSON.parse(e.data)
      
    if (data.payload) 
      {
        settest(test+1)
        console.log(data.payload)
        const increment_notifications=()=>{
  
          let notification_counter = document.getElementById("notifications_count")
          if (notification_counter.innerHTML ==="")
          {
            notification_counter.innerHTML = 1
          }
          else{
            notification_counter.innerHTML = parseInt(notification_counter.innerHTML) +1
          }
        }

        increment_notifications()       
        const notification_object_received = data.payload  
        setnotifications(prev_notifications => [ notification_object_received,...prev_notifications])

      }
    else{
        console.log(data)
      }
    }
  }

  const GetUserData = async()=>
  {
    const res  = await fetch(userdataurl)
    const data = await res.json()

    if (!data.user_data.country)
    {
      getUserCountryViaApiServiceThenSaveCountry()
    } 
    
    setUserData(data.user_data)
    setnotifications(data.notifications)
  
    const unseen_count = data.notifications.filter(n => !n.seen).length
    
    if (unseen_count > 0){
      document.getElementById("notifications_count").innerHTML = unseen_count
    }

  }

  // called if the user doesn't have a saved country (which will always be the case initially for the first login)
  const getUserCountryViaApiServiceThenSaveCountry = async()=>
  {
    
    const res = await fetch("http://ip-api.com/json")
    const fetched_country = await res.json()

  // after we get the country successfully we save it to the database so subsequent requests for the same user don't have to query the country from the api service again
    const save_country = await fetch(userdataurl,{
    
      method : 'POST',
      headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': CsrfToken,
      },
      body: JSON.stringify({
        country : fetched_country.countryCode.toLowerCase()
      })
    })
    const counry_res  = await save_country.json()
    console.log(counry_res)
        
  }
  
  const ManageViews = (View)=>
  {

    if (GameMode)
        return
    
      if(View==="home"){
        setHomeView(true)
        setQuizAnimesView(false) 
        setContributionView(false)
        setProfileView(false)
        setNotificationsView(false) 
      } 

      if(View==="profile"){
        setProfileView(true) 
        setHomeView(false) 
        setQuizAnimesView(false)
        setContributionView(false)
        setNotificationsView(false) 
      } 
      
      if(View==="contribution"){
        setContributionView(true)
        setHomeView(false)
      } 
      
      if(View==="quiz"){
        setQuizAnimesView(true)
        setHomeView(false)
      } 

      if(View==="notifications"){
        setNotificationsView(true) 
        setQuizAnimesView(false)
        setHomeView(false)
        setContributionView(false)
        setProfileView(false)
        
      } 
      
    
  }

  useEffect(()=>{
    GetUserData()
    mysocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[])


return (
 <div className="App"> 
  <ServerContext.Provider value={{server}}>
  <GamdeModeContext.Provider value={{GameMode,NUMBER_OF_QUIZ_QUESTIONS, setGameMode, setUserData}}>

      { UserData&& <NavBar data={UserData} show={ManageViews} /> }

      <div className="upperbuttons">

        <div>{!GameMode&& <button onClick={()=>ManageViews("home")}>Home</button>}</div>

        { HomeView && <button onClick={()=>ManageViews("quiz")}>take a quiz</button> }

        { HomeView && <button onClick={()=>ManageViews("contribution")}>Contribute a question</button> }

      </div>
  <h1>{test}</h1>
      { HomeView && <TheDashBoard/>}
      
      { ProfileView && <UserProfile/>}

      { NotificationsView && <Notifications notifications={notifications}/>}

      { ContributionView && <Contripution />}

      { QuizAnimesView && <QuizAnimes/>}

  </GamdeModeContext.Provider>
  </ServerContext.Provider>
  </div>
 )
}

export default App