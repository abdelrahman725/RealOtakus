import './App.css'
import  NavBar from './pages/Components/NavBar'
import  Home  from './pages/Home' 
import  Contribute  from './pages/Contribute'
import  UserContributions from './pages/UserContributions'
import  GameView from './pages/GameView'
import  QuestionsForReview  from './pages/QuestionsForReview'
import  UserProfile  from './pages/Profile'
import  Notifications  from './pages/Notifications'
import  About  from './pages/About'
import  Footer from "./pages/Components/Footer"

import  React, { useState, useEffect, createContext} from 'react'
import { Route, Routes } from 'react-router-dom'
import { domain } from './pages/Components/AsyncRequest'

import useWebSocket from 'react-use-websocket'
import async_http_request from './pages/Components/AsyncRequest'
import fetch_user_country from './pages/Components/fetch_user_country'

export const GlobalStates  = createContext()

function App(){

  const [user_data,set_user_data] = useState()
  const [dashboard_users,set_dashboard_users] = useState()  
  const [all_animes,setall_animes] = useState()
  const [notifications,setnotifications] = useState([])
  const [number_of_unseen_notifications,setnumber_of_unseen_notifications] = useState(0)
  const [darkmode,setdarkmode] = useState(true)
  const [game_started,setgame_started] = useState()
  const [info_message, set_info_message] = useState()
  const N_Game_Questions = 5   

  const { lastMessage,readyState } = useWebSocket(`ws://${domain}/ws/socket-server/`,{
    //Will attempt to reconnect on all close events, such as server shutting down
    onOpen: () => console.log('\n connection open \n\n'),
    shouldReconnect: () => true,
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


  useEffect(()=>{

    async function get_home_data(){
      const result = await async_http_request({path:"gethomedata"})
     
      if (result===null){
        set_info_message("network error")
        return
      }

      //!result.user_data.country && fetch_user_country() 
      
      set_user_data(result.user_data)
      set_dashboard_users(result.leaderboard)
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

    get_home_data()
  },[])
  
  return(
    <GlobalStates.Provider value={{game_started, N_Game_Questions, setgame_started, set_user_data, set_info_message}}>
    <div className="App">

      <NavBar 
        user={user_data}
        notifications_open = {false}
        new_notifications={number_of_unseen_notifications} 
        darkmode={darkmode}
        setdarkmode = {setdarkmode}/> 
      <div className="spaced_div"></div>
      
      <p>{info_message}</p>

      <Routes>
        
        <Route path="/" element={ <Home dashboard_users={dashboard_users} user_data={user_data}/> }/>
        
        <Route path="/contribute" element={<Contribute all_animes_options={all_animes}/>}/>
        
        <Route path="/mycontributions" element={<UserContributions />}/>
        
        <Route path="/game" element={<GameView/>}/>
        
        { user_data && user_data.is_reviewer && <Route path="/review" element={<QuestionsForReview />}/>}
        
        <Route path="/profile" element={<UserProfile is_reviewer={ user_data && user_data.is_reviewer} />}/>
        
        <Route path="/notifications" element={
          <Notifications all_notifications={notifications}
          unseen_count={number_of_unseen_notifications}
          setnumber_of_unseen_notifications = {setnumber_of_unseen_notifications}/>}/>
        
        <Route path="/about" element={<About />}/>
      
      </Routes>

      <Footer/>
    </div>
    </GlobalStates.Provider>
    
  ) 
}
export default App