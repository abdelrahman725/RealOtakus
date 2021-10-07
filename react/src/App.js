import React from 'react'
import {useState} from 'react'
import './App.css';
import Test from './Components/Test';
import LeaderBoard from './Components/LeaderBoard'
import Profile from './Components/Profile'
import AnimesChoices from './Components/Animes'
import SelectedAnimes from './Components/SelectedAnimes'

  let  Username,Points,Level,Highest_score =""
  if (document.getElementById("username")!= null)
  {
    Username = document.getElementById("username").innerText;
    Points = document.getElementById("points").innerText;
    Highest_score = document.getElementById("highest_score").innerText;
    Level = document.getElementById("level").innerText;
  }



function App() {

  const UsersPathUrl = "http://127.0.0.1:8000/leaderboard"
  const AnimesPathUrl = "http://127.0.0.1:8000/allanimes"
  const QuestionsPathUrl = "http://127.0.0.1:8000/test"

  //const QuestionsCount = 20
  const ChoicesLimit = 5 
  //const [TestStarted,setTestStarted] = useState(false) 


  const [TestView,setshowTest] = useState(false)
  const [LeaderBoardView,setLeaderBoard] = useState(false)
  const [AnimesView,setAnimesView] = useState(false)


  const [TopOtakus,setUsers] = useState([])
  // const [loading,setLoading] = useState(false)
  // const [RightAnswers,setAnswers] = useState(0)
  // const [Decided,setDecided] = useState(false)
  const [UserQuestions,setQuestions] = useState([])

  const [AllAnimes,setAllAnimes] = useState([])

  const [SelectedAnimes,setSelectedAnimes]=  useState([])


//get the leaderboard data
const Getusers  =  async()=>
{
  
  const response = await fetch(UsersPathUrl)
  const Users  = await response.json()
  setUsers(Users)
  
  setLeaderBoard(true)
  setshowTest(false)
  setAnimesView(false)

  //console.log(Users)
  
}

// fetch all the available animes for user to choose from and decide which anime to be in the test 
const GetAllAnimes = async()=>
{
  const response = await fetch(AnimesPathUrl)
  const animes  = await response.json()
  setAllAnimes(animes)

  setAnimesView(true)
  setLeaderBoard(false)
  setshowTest(false)

//  console.log(animes)

}
const GetQuestions = async()=>
{
  let anime_ids = SelectedAnimes.map((anime)=>anime.id)
  const response = await fetch((`${QuestionsPathUrl}/${anime_ids}`))
  const questions  = await response.json()
  setQuestions(questions)
  
  setshowTest(true)
  setLeaderBoard(false)
  setAnimesView(false)
  //console.log(questions)
}



const ToggleAddRemoveAnime = (id) =>
{
  let animediv = document.getElementById(`${id}`)
  

  // removing anime 
 if( SelectedAnimes.filter((anime)=>(anime.id===id)).length>=1)
 {
   
    animediv.style.backgroundColor = "cadetblue"
    setSelectedAnimes(SelectedAnimes.filter((anime)=>anime.id!==id))
 }

 // adding anime
 else
 {
   if(SelectedAnimes.length < ChoicesLimit)
   {
      setSelectedAnimes([...SelectedAnimes,...AllAnimes.filter((anime) =>anime.id===id)])
      animediv.style.backgroundColor = "green" 
    }
 
}


}
  return (
    <div className="App">

       
        <h1>welcome {Username} </h1>
        {/* <h2> real otakus only !</h2>
        <Profile name={Username} level ={Level} points = {Points} highest_score ={Highest_score}/> */}

         {/* <button onClick={Getusers}>show current otaku competitors</button> */}
        <button onClick={GetAllAnimes}>check available animes</button>
        <button onClick={SelectedAnimes.length===ChoicesLimit?GetQuestions:undefined}>get my customized questions !</button>
      
         {TestView?  <Test test_questions = {UserQuestions}/>:""}


        {AnimesView? <AnimesChoices all_animes = {AllAnimes} onSelect= {ToggleAddRemoveAnime}/>:""}
         
        {/* {LeaderBoardView? <LeaderBoard otakus= {TopOtakus}/>:""}   */}
        <br/>

   
    </div>
  );
}

export default App;
