import './App.css'

import NavBar from './Components/NavBar'
import Notifications from './Components/Notifications'
import Contripution from './Components/Contripution'
import QuizAnimes from './Components/QuizAnimes'
import TheDashBoard from './Components/TheDashBoard'
import { UserProfile } from './Components/TheProfile/UserProfile'
import async_http_request from './Components/AsyncRequest'

import React,{useState,useEffect,createContext} from 'react'
import useWebSocket from 'react-use-websocket'

export const GamdeModeContext  = createContext()

function App() {
  const [UserData,setUserData] = useState({})
  const [notifications,setnotifications] = useState([])
  const [number_of_unseen_notifications,setnumber_of_unseen_notifications] = useState(0)
  const [GameMode,setGameMode] = useState(false)
  // views :
  const [HomeView,setHomeView] = useState(true)
  const [NotificationsView,setNotificationsView]= useState(false)
  const [ContributionView,setContributionView]= useState(false)
  const [QuizAnimesView,setQuizAnimesView] = useState(false)
  const [ProfileView,setProfileView] = useState(false)
  const NUMBER_OF_QUIZ_QUESTIONS = 5 

  const  domain = "127.0.0.1:8000"
  const  server  = `http://${domain}`
  const  socket = `ws://${domain}/ws/socket-server/`
  
  const  logout_url = `${server}/logout`
  
  const { lastMessage,readyState } = useWebSocket(socket,{

  //Will attempt to reconnect on all close events, such as server shutting down
  onOpen: () => console.log('\n connection open \n\n'),
  shouldReconnect: (closeEvent) => true,
  })
  
  // listening for incoming realtime notifications 

  useEffect(() => {
    if (lastMessage !== null) {
      
      const new_data = JSON.parse(lastMessage.data)
      
      // checking if there is a new notificaation payload
      if (new_data.payload)
      {
        console.log(new_data.payload)
        setnotifications(prev_notifications => [ new_data.payload,...prev_notifications])
        setnumber_of_unseen_notifications(number_of_unseen_notifications+1)
      }

    }
  }, [lastMessage, setnotifications]);

  
  useEffect(()=>{
    GetUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[])

  const Logout = ()=>
  {
    window.location.href = logout_url
  }

  const GetUserData = async()=>{

    const res = await async_http_request({path:"data"})

    if (!res.user_data.country)
    {
      getUserCountryViaApiServiceThenSaveCountry()
    } 

    setUserData(res.user_data)
    setnumber_of_unseen_notifications(res.notifications.filter(n => !n.seen).length)
    setnotifications(res.notifications)
  }
  
  // called if the user doesn't have a saved country (which will always be the case initially for the first login)
  const getUserCountryViaApiServiceThenSaveCountry = async()=>
  {
    
    const fetched_country = await async_http_request({server:"http://ip-api.com/json"})
    
    const country_code = fetched_country.countryCode.toLowerCase()
    console.log(country_code)
    
    // after we get the country successfully 
    // save it to the database so subsequent requests for the same user don't have to query the country from the api service again    
    const save_country  = await async_http_request({
      path:"data",
      method:"POST",
      data: {"country" : country_code}
    })

    console.log(save_country)     
  }
  
  const ManageViews = (View)=>
  {
    
    if (GameMode)
        return
    
    switch(View)
    {

      case "home":
        setHomeView(true)
        setQuizAnimesView(false) 
        setContributionView(false)
        setProfileView(false)
        setNotificationsView(false) 
        return
      
      case "profile" :   

        setProfileView(true) 
        setHomeView(false) 
        setQuizAnimesView(false)
        setContributionView(false)
        setNotificationsView(false) 
        return
       
      case "contribution" :
        setContributionView(true)
        setHomeView(false)
        return
      
      case "quiz" :
        setQuizAnimesView(true)
        setHomeView(false)
        return

      case "notifications" :
        setNotificationsView(true) 
        setQuizAnimesView(false)
        setHomeView(false)
        setContributionView(false)
        setProfileView(false)
        return
      
    }
      
  }


return (
 <div className="App"> 

  <GamdeModeContext.Provider value={{GameMode,NUMBER_OF_QUIZ_QUESTIONS, setGameMode, setUserData}}>

      { UserData && < NavBar 
       data={UserData}
       show={ManageViews}
       new_notifications={number_of_unseen_notifications} /> 
      }

      <div className="upperbuttons">

        <div>{!GameMode&& <button onClick={()=>ManageViews("home")}>Home</button>}</div>

        { HomeView && <button onClick={()=>ManageViews("quiz")}>take a quiz</button> }

        { HomeView && <button onClick={()=>ManageViews("contribution")}>Contribute a question</button> }

        { HomeView && <button onClick={Logout}>Sign Out</button> }

      </div>
      
      { HomeView && <TheDashBoard logged_in_user={UserData.id} />}
      
       { ProfileView && <UserProfile/>}

      { NotificationsView && <Notifications
       notifications={notifications}
       clear_unseen_count = {setnumber_of_unseen_notifications}/>
      }

      { ContributionView && <Contripution />}

      { QuizAnimesView && <QuizAnimes/>} 

  </GamdeModeContext.Provider>

  </div>
 )
}

export default App