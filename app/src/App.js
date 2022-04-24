import './App.css';
import Bar from './Components/Bar' 
import Profile from './Components/Profile'
import Contripution from './Components/Contripution'
import Animes from './Components/AnimesList'
import TheDashBoard from './Components/TheDashBoard'
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
  const [DashBoardView,setDashBoardView] = useState(true)
  const [ContributionView,setContributionView]= useState(false)
  const [QuizView,setQuizView] = useState(false)
  const [ProfileView,setProfileView] = useState(false)


  const [GameMode,setGameMode] = useState(false)
  
  const [getcountry,setgetcountry] = useState(false)

  const  server  = "http://127.0.0.1:8000"
  const  socket_server = "ws://127.0.0.1:8000/ws/socket-server/"
  const  userdataurl = `${server}/home/data`
  const getUserCountryViaApiService = async()=>
  {
    // after we got the country successfully we save it to the database so subsequent requests for the same don't have to ask the api service again
    const usercountry = "es"
    postcountry(usercountry)
  }

  const postcountry =async (country)=>
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

  

  const GetUserData = async()=>
  {
    const res = await fetch(userdataurl)
    const data= await res.json()

    if (!data.user_data.country)
    {
      getUserCountryViaApiService()
    } 
    
    //console.log(data.user_data)
    setUserData(data.user_data)

    //console.log(data.notifications)
    setNoti(data.notifications)
  }







  const mysocket = ()=>
  {
    const socket_connection = new WebSocket(socket_server)
    socket_connection.onmessage = (e)=>{
      const data = JSON.parse(e.data)
      console.log(data)
    }
  }




  useEffect(()=>{
    GetUserData()
    //mysocket()

  },[])

  const ManageViews = (View)=>
  {
    if(View==="home"){
      setHomeView(true);setQuizView(false); setContributionView(false); setProfileView(false)
    } 

    if(View==="profile"){
      setProfileView(true); setHomeView(false) ;
      ;setQuizView(false); setContributionView(false);
    } 
    
    if(View==="contribution"){
      setContributionView(true); setHomeView(false) ;
    } 

    
    if(View==="quiz"){
      setQuizView(true); setHomeView(false) ;
    } 

  }

return (
 <div className="App">
  <br />
  {UserData&& <Bar data={UserData} country={Countries[UserData.country]} noti = {Noti} showprofile={setProfileView} switch_to_profile = {ManageViews}/>}
     
  <ServerContext.Provider value={{server}}>
  <GamdeModeContext.Provider value={{GameMode, setGameMode, setUserData}}>

  <button onClick={()=>ManageViews("home")}>Home</button>



        {HomeView&&<button onClick={()=>ManageViews("quiz")}>test your inner otaku !</button> }
        {QuizView&& <Animes/>} 

         
        {HomeView&& <button onClick={()=>ManageViews("contribution")}>Contribute a question</button> }

        { ContributionView && <Contripution />}

        { ProfileView && <Profile />}

    
   

        {HomeView&&<TheDashBoard/>}
     

  



  </GamdeModeContext.Provider>
  </ServerContext.Provider>
  </div>
 )
}

export default App
