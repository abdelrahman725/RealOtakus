import React from 'react'
import {useState,useEffect} from 'react'
import './App.css';
import EachQuestion from './Components/EachQuestion';
import LeaderBoard from './Components/LeaderBoard'
import Profile from './Components/Profile'
import AnimesChoices from './Components/Animes'
import SelectedAnimes from './Components/SelectedAnimes'
import NextBtn from './Components/NextBtn'

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

  const NumberOfQuestions = 20
  const ChoicesLimit = 5 
  const [animecounter,setanimecounter] = useState(0) 

  const [points,setPoints] = useState(0) 


  const [TestView,setTestView] = useState(false)
  const [Testended,setTestended] = useState(false)
  const [TheNext,setTheNext]= useState(true)

  const [nextbtn,setnextbtn] = useState(false)
  const [submitbtn,setsubmitbtn]= useState(false)

  const [LeaderBoardView,setLeaderBoard] = useState(false)
  const [AnimesView,setAnimesView] = useState(false)
  const [CurrentAnswer,setCurrentAnswer] = useState(false)



  const [TopOtakus,setUsers] = useState([])
  // const [loading,setLoading] = useState(false)
  const [RightAnswers,setRightAnswers] = useState(0)
  const [QuestionNumber,setNumber] = useState(0)
  // const [Decided,setDecided] = useState(false)
  const [UserQuestions,setQuestions] = useState([])

  const [AllAnimes,setAllAnimes] = useState([])

  const [SelectedAnimes,setSelectedAnimes]=  useState([])

  const [AnimeScore,setAnimeScore] = useState([{}])



//get the leaderboard data
const Getusers  =  async()=>
{
  
  const response = await fetch(UsersPathUrl)
  const Users  = await response.json()
  setUsers(Users)
  
  setLeaderBoard(true)
  setTestView(false)
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
  setTestView(false)

//  console.log(animes)

}
const GetQuestions = async()=>
{
  SelectedAnimes.map((selected_anime)=>(
    selected_anime.score=0
  ))
 

  let anime_ids = SelectedAnimes.map((anime)=>anime.id)
  const response = await fetch((`${QuestionsPathUrl}/${anime_ids}`))
  const questions  = await response.json()

  setQuestions(questions)
  
  setTestView(true)
  setnextbtn( true)
  setLeaderBoard(false)
  setAnimesView(false)


  
}



const ToggleAddRemoveAnime = (id) =>
{
  let animediv = document.getElementById(`${id}`)
  

  // removing anime 
 if( SelectedAnimes.filter((anime)=>(anime.id===id)).length>=1)
 {
   
    //animediv.style.backgroundColor = "cadetblue"
    setSelectedAnimes(SelectedAnimes.filter((anime)=>anime.id!==id))
    setanimecounter(animecounter-1)
  }

 // adding anime
 else
 {
   if(SelectedAnimes.length < ChoicesLimit)
   {
      setSelectedAnimes([...SelectedAnimes,...AllAnimes.filter((anime) =>anime.id===id)])
      setanimecounter(animecounter+1)
     // animediv.style.backgroundColor = "green" 
      //console.log(SelectedAnimes)
    }
  
}

}
const preChoose = (answer)=>
{
  setCurrentAnswer(answer)  
} 

const ActualChoose = (answer,anime_id)=>
{

  if(answer===true && TheNext)
  {
     
      setPoints(points+1) 
      setTheNext(false)
    
    for (let i =0;i<ChoicesLimit;i++)
    {
      if (SelectedAnimes[i].id===anime_id)
      {
        let items = [...SelectedAnimes]
        let item =  {...items[i]}
        item.score +=1
        items[i] = item
        setSelectedAnimes(items)

      }

    } 
      
  }
  

}

const nextquestion =()=>
{
  
  // last question 
  if (QuestionNumber+1 ===UserQuestions.length-1)
  {
    setnextbtn(false)
    setsubmitbtn(true)
  
  }

  if(QuestionNumber < UserQuestions.length-1)
  {
    ActualChoose(CurrentAnswer,UserQuestions[QuestionNumber].anime)
   
    setNumber(QuestionNumber+1)
    setTheNext(true)
  }
    

}

//end quiz
const Submit =()=>
{
  // last question 
  ActualChoose(CurrentAnswer,UserQuestions[QuestionNumber].anime)
  
  setTestended(true)
}

  return (
    <div className="App">

       
        <h1>welcome {Username} </h1>
        <h2>{points}</h2>
    


        {/* <h2> real otakus only !</h2>
        <Profile name={Username} level ={Level} points = {Points} highest_score ={Highest_score}/> */}

         {/* <button onClick={Getusers}>show current otaku competitors</button> */}
        <button onClick={GetAllAnimes}>check available animes</button>

        <button onClick={SelectedAnimes.length===ChoicesLimit?GetQuestions:undefined}>get my customized questions !</button>
      
         {TestView&& <EachQuestion question = {UserQuestions[QuestionNumber]} n={QuestionNumber} onChoose={preChoose}/>}

         {nextbtn&& <NextBtn onClick={nextquestion}/>}

         {submitbtn&&<button onClick={Submit}>
           submit
         </button>}

         <br/>
         <hr />
          {SelectedAnimes.map((a)=>(
            <p>
              {a.anime_name} : {a.score}
            </p>
          ))}
         <hr />
         <br />


        {AnimesView? <AnimesChoices all_animes = {AllAnimes} onSelect= {ToggleAddRemoveAnime}
        choicesnumber={animecounter}/>:""}
 
         
        {/* {LeaderBoardView? <LeaderBoard otakus= {TopOtakus}/>:""}   */}
        <br/>

   
    </div>
  );
}

export default App;
