import './App.css'

import NavBar from './Components/NavBar'
import Notifications from './Components/Notifications'
import Contribute from './Components/Contribute'
import QuizAnimes from './Components/QuizAnimes'
import TheDashBoard from './Components/TheDashBoard'
import QuestionsForReview from './Components/QuestionsForReview'
import InfoMessage from './Components/InfoMessage'
//import UserContributions from './Components/UserContributions'

import { UserProfile } from './Components/TheProfile/UserProfile'
import { domain } from './Components/AsyncRequest'
import async_http_request from './Components/AsyncRequest'
import React,{useState,useEffect,createContext} from 'react'
import useWebSocket from 'react-use-websocket'

export const GlobalStates  = createContext()

function App() {
  const [user_data,set_user_data] = useState()
  const [notifications,setnotifications] = useState([])
  const [number_of_unseen_notifications,setnumber_of_unseen_notifications] = useState(0)
  const [info_message, set_info_message] = useState()
  const [all_animes,setall_animes] = useState()
  const [GameMode,setGameMode] = useState(false)
  
  // component views :
  const [HomeView,setHomeView] = useState(true)
  const [ReviewView,setReviewView] = useState(false)
  const [NotificationsView,setNotificationsView]= useState(false)
  const [ContributionView,setContributionView]= useState(false)
  const [QuizAnimesView,setQuizAnimesView] = useState(false)
  const [ProfileView,setProfileView] = useState(false)
  
  const N_Game_Questions = 5 
  
  const socket = `ws://${domain}/ws/socket-server/`
   
  const { lastMessage,readyState } = useWebSocket(socket,{
    
    //Will attempt to reconnect on all close events, such as server shutting down
    onOpen: () => console.log('\n connection open \n\n'),
    shouldReconnect: (closeEvent) => true,
  })
  
  // listening for incoming realtime notifications 
  useEffect(() => {
    if (lastMessage !== null) {
      
      const new_data = JSON.parse(lastMessage.data)
      
      if (new_data.payload){
        console.log(new_data.payload)
        setnotifications(prev_notifications => [ new_data.payload,...prev_notifications])
        setnumber_of_unseen_notifications( prev => prev + 1)
      }

    }
  }, [lastMessage, setnotifications]);

  
  const Logout = ()=>  window.location.href = `http://${domain}/logout`
   
  // called if the user doesn't have a saved country (which will always be the case initially for the first login)
  const getUserCountryViaApiServiceThenSaveCountry = async()=>{  
    
     const fetched_country = await async_http_request({server:"http://ip-api.com/json"})
     
     const country_code = fetched_country.countryCode.toLowerCase()
     console.log(country_code)
     
     // after we get the country successfully 
     // save it to the database so subsequent requests for the same user don't have to query the country from the api service again    
     const saving_country_res  = await async_http_request({
       path:"data",
       method:"POST",
       data: {"country" : country_code}
     })
 
     console.log(saving_country_res)     
   }
   
   useEffect(()=>{

    async function GetUserData(){
      const result = await async_http_request({path:"data"})
     
      if (result===null){
        set_info_message("network error")
        return
      }
  
      if (!result.user_data.country){
        getUserCountryViaApiServiceThenSaveCountry()
      } 
      
      set_user_data(result.user_data)
      setnumber_of_unseen_notifications(result.notifications.filter(n => !n.seen).length)
      setnotifications(result.notifications)

      const formated_animes = []

      result.animes.map((anime) => 
        formated_animes.push({
          value:anime.id,
          label:anime.anime_name,
        })
      )

      setall_animes(formated_animes)
  
    }

    GetUserData()
  },[])
  

  const ManageViews = (pressed_view)=>
  {
    
    if (GameMode)
        return
    
    switch(pressed_view)
    {
      case "home":
        setHomeView(true)
        setReviewView(false)
        setQuizAnimesView(false) 
        setContributionView(false)
        setProfileView(false)
        setNotificationsView(false) 
        return
      
      case "profile" :
        setProfileView(true) 
        setReviewView(false)
        setHomeView(false) 
        setQuizAnimesView(false)
        setContributionView(false)
        setNotificationsView(false) 
        return
       
      case "contribution" :
        setContributionView(true)
        setHomeView(false)
        return

      case "review" :
        setReviewView(true)
        setHomeView(false)
        return
      
      case "quiz" :
        setQuizAnimesView(true)
        setHomeView(false)
        return

      case "notifications" :
        setNotificationsView(true)
        setReviewView(false) 
        setQuizAnimesView(false)
        setHomeView(false)
        setContributionView(false)
        setProfileView(false)
        return 
      
      default:
        return
    }
      
  }

return (
  <div className="App"> 

    <GlobalStates.Provider value={{GameMode, N_Game_Questions, setGameMode, set_user_data, set_info_message}}>

        < NavBar 
          user={user_data}
          show={ManageViews}
          notifications_open = {NotificationsView}
          new_notifications={number_of_unseen_notifications} 
        /> 
        
        <div className="navigation_buttons">

          { !HomeView && !GameMode&& <button onClick={()=>ManageViews("home")}>Home</button>} 
  
          { HomeView && <button onClick={()=>ManageViews("contribution")}>Contribute</button> }
  
          { HomeView && <button onClick={()=>ManageViews("quiz")}>take a quiz</button> }

          { user_data && user_data.is_reviewer && HomeView && <button onClick={()=>ManageViews("review")}>Review contributions</button> }

        </div>

        <InfoMessage msg={info_message}/>
        
        <br /> 
        
        { HomeView && <TheDashBoard current_user= {user_data && user_data.id} />}
        
        
        { ProfileView && <UserProfile />}

        
        { QuizAnimesView && <QuizAnimes/>} 
        
        
        { ContributionView && <Contribute all_animes_options={all_animes} />}
        
        { ReviewView &&  <QuestionsForReview/> }


        { NotificationsView && 

        <Notifications 
          all_notifications={notifications}
          unseen_count = {number_of_unseen_notifications}
          clear_unseen_count = {setnumber_of_unseen_notifications} 
        />
        }


    </GlobalStates.Provider>

  </div>
 )
}

export default App
