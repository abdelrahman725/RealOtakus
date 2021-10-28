import React from 'react'
import {useState,useEffect} from 'react'
import './App.css'
import EachQuestion from './Components/EachQuestion'
import LeaderBoard from './Components/LeaderBoard'
import Profile from './Components/Profile'
import AnimesChoices from './Components/Animes'
import NextBtn from './Components/NextBtn'
import Interface from './Components/Interface'
import Navbar from './Components/Navbar'
import Result from './Components/Result'

//Material UI Components :

import {Button, ButtonGroup} from '@material-ui/core'
// //Material Icons :

import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import PeopleRounded  from '@material-ui/icons/PeopleRounded'
import PlayArrowRounded  from '@material-ui/icons/PlayArrowRounded'
import ArrowUpwardIcon   from '@material-ui/icons/ArrowUpward'
import PersonIcon   from '@material-ui/icons/Person'


function App() {

  const getCookie =(name)=> {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  const IP= "192.168.1.5"
  const CsrfToken = getCookie('csrftoken')
  const UsersPathUrl = `http://${IP}:8000/leaderboard`
  const AnimesPathUrl = `http://${IP}:8000/allanimes`
  const QuestionsPathUrl = `http://${IP}:8000/test`
  const UserDataPathUrl = `http://${IP}:8000/userdata`

  const NumberOfQuestions = 20
  const ChoicesLimit = 5 

 // const [Loading,setUserDataLoading] = useState(true)
  const [animecounter,setanimecounter] = useState(0) 
  
  
  const [TestView,setTestView] = useState(false)
  const [AnimesView,setAnimesView] = useState(false)
  const [ProfileView,setProfileView]  = useState(false)
  const [InterfaceView,setInterfaceView]  = useState(true)
  const [ResultView,setResultView]  = useState(false)
  
  const [Testended,setTestended] = useState(false)
  const [TheNext,setTheNext]= useState(true)
  const [nextbtn,setnextbtn] = useState(false)
  const [submitbtn,setsubmitbtn]= useState(false)
  
  const [LeaderBoardView,setLeaderBoard] = useState(false)
  const [CurrentAnswer,setCurrentAnswer] = useState(false)
  

  const [TopOtakus,setUsers] = useState([])

  const [QuestionNumber,setNumber] = useState(0)

  const [UserQuestions,setQuestions] = useState([])
  
  const [AllAnimes,setAllAnimes] = useState([])
  
  const [SelectedAnimes,setSelectedAnimes]=  useState([])
  const [TopAnimes,setTopAnimes] = useState()
  const [TestScore,setTestScore] = useState(0) 
  const [userpoints,setPoints] = useState() 
  const [UserName,setusername] = useState()
  const [Level,setLevel] = useState("")
  const [TestsCount,setTestsCount] = useState()
  const [TopAnimesLoading,setTopAnimesLoading] = useState()
  
  const ExitTestMode = ()=>
{
  setTestScore(0)
  setNumber(0)
  setSelectedAnimes([])
  setQuestions([])
  setCurrentAnswer(false)
  setanimecounter(false)
  setTestView(false)
  setAnimesView(true)
  setanimecounter(0)

}


useEffect(()=>{

  const GetUserData  =  async()=>
  {
  const res = await fetch(UserDataPathUrl)
  const userdata = await res.json()
  
  setTestsCount(userdata.TestsCount)
  setPoints(parseInt(userdata.points,10))
  setusername(userdata.username)
  setLevel(userdata.level)
  
  
}

GetUserData()
// setUserDataLoading(false)


},[])



useEffect(()=>{

  if (Testended===true)
  {    
    // UpdateUserPoints()
    // SendAnimesScores() 
   setPoints(userpoints+TestScore)
      
  }
},[Testended])


//get the leaderboard data
const Getusers  =  async()=>
{
  
  const response = await fetch(UsersPathUrl)
  const Users  = await response.json()
  setUsers(Users)
  
  setLeaderBoard(true)
  setTestView(false)
  setAnimesView(false)
  setProfileView(false)
  setInterfaceView(false)
  //console.log(Users)
}

const topanimes = async()=>
{
  const response = await fetch(`http://${IP}:8000/topanimes`)
  const animes  = await response.json()  
  setTopAnimes(animes)
  setTopAnimesLoading(false)
}


// fetch all the available animes initially once for the user to choose from 
useEffect(()=>{
  const FetchAllAnimes= async()=>
  {
    const response = await fetch(AnimesPathUrl)
    const animes  = await response.json()
    setAllAnimes(animes)
  }

  FetchAllAnimes()
  
},[])

const ShowAllAnimes = async()=>
{
 
  setSelectedAnimes([])
  setAnimesView(true)
  setanimecounter(0)
  setLeaderBoard(false)
  setProfileView(false)
  setInterfaceView(false)
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
  setProfileView(false)

}


const ToggleAddRemoveAnime = (id) =>
{  

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


const ActualChoose = (answer,anime_id,fromsubmit)=>
{

  if(answer===true && TheNext && !Testended)
  {
     
      
      setTestScore(TestScore+1) 
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
    
  fromsubmit&& setTestended(true)

}

const UpdateUserPoints = async()=>
{
 
  const res = await fetch(`http://${IP}:8000/points`,{
    method : 'PUT',
    headers : {
      'Content-type': 'application/json',
      'X-CSRFToken': CsrfToken
    },
    body: JSON.stringify({
      points:userpoints
    })
  })
  const data = await res.json()
  console.log(data)
}


const SendAnimesScores = async()=>
{
 
  const res = await fetch(`http://${IP}:8000/animescore`,{
    method : 'POST',
    headers : {
      'Content-type': 'application/json',
      'X-CSRFToken': CsrfToken
    },
    body: JSON.stringify({
      AnimesResults:SelectedAnimes
    })
  })
  const data = await res.json()
  console.log(data)
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
    ActualChoose(CurrentAnswer,UserQuestions[QuestionNumber].anime,false)
   
    setNumber(QuestionNumber+1)
    setTheNext(true)
  }

  // console.log(SelectedAnimes)
}

//end quiz
const Submit = async ()=>
{
    ActualChoose(CurrentAnswer,UserQuestions[UserQuestions.length-1].anime,true)  
    setTestView(false)
    setResultView(true)
    setsubmitbtn(false)
       
}
const showprofile = ()=>
{
  setProfileView(true)
   
  setTestView(false)
  setLeaderBoard(false)
  setAnimesView(false)
  setInterfaceView(false)
  setTopAnimesLoading(true)
  topanimes()
}

  return (

    // Dev Branch

    <div className="App">

      {/* sticky navbar for main user data */}
      <Navbar username={UserName} level={Level} points={userpoints} 
      showprofile={!TestView&&showprofile}/>
    

     {!TestView&&
      <Button onClick={Getusers} 
      size="small"
      variant="contained"  
      startIcon={<PeopleRounded/>}>
        LeaderBoard
      </Button>
     }


    
      
      {!TestView && !AnimesView&&
        <Button onClick={ShowAllAnimes} 
        size="small"
        variant="contained"  
        startIcon={""}>
              {TestsCount>=1?
            "take Quiz":
            "take your first Test !"  }
        </Button>
        } 

  

        {TestView&&
         <Button onClick={ExitTestMode} 
         variant="outlined"  disableElevation
         startIcon={<ExitToAppRounded/>}>
           exit test mode
         </Button>
        }
      
        
       
      {InterfaceView&& <Interface />} 
      {ResultView&&<Result score={TestScore} NumberOfQuestions={NumberOfQuestions}/>} 
        
        
      {AnimesView && animecounter===ChoicesLimit &&
        <Button onClick={GetQuestions} 
        variant="contained"
        color="primary"  disableElevation
        startIcon={<PlayArrowRounded/>}>
          start
        </Button>
      }
        {AnimesView&& <AnimesChoices all_animes = {AllAnimes} onSelect= {ToggleAddRemoveAnime}
        choicesnumber={animecounter}/>}



        {TestView&& <EachQuestion question = {UserQuestions[QuestionNumber].question}
         id =  {UserQuestions[QuestionNumber].id}
         right_answer = {UserQuestions[QuestionNumber].right_answer}
          choices = {[UserQuestions[QuestionNumber].right_answer,
          UserQuestions[QuestionNumber].choice1,
          UserQuestions[QuestionNumber].choice2,
          UserQuestions[QuestionNumber].choice3,
           ]}
        
         n={QuestionNumber} onChoose={preChoose}/>}




          {TestView &&
          <h3>{UserQuestions.length}</h3>
          }
 

         {TestView&& nextbtn&&
         <Button onClick={nextquestion} 
         size="small"
         style={{color:"revert"}}
         variant="contained"  disableElevation
         endIcon={< NavigateNextRoundedIcon/>}>
           next
         </Button>
        }


         {TestView&&submitbtn&&
         <Button onClick={Submit} variant="contained" endIcon={<ArrowUpwardIcon/>}>
           submit
         </Button>}
       
         { ProfileView && 
        <Profile  level={Level}
        tests_count={TestsCount}
        top_animes = {TopAnimes}
        loading = {TopAnimesLoading} 
        /> } 

         
        {LeaderBoardView&& <LeaderBoard otakus= {TopOtakus}/>}  
        <br/>

   
    </div>
  );
}

export default App;
