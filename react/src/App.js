import React from 'react'
import {useState,useEffect} from 'react'
import './App.css'
import EachQuestion from './Components/EachQuestion'
import LeaderBoard from './Components/LeaderBoard'
import Profile from './Components/Profile'
import AnimesChoices from './Components/Animes'
import Navbar from './Components/Navbar'
import LoginRegisterView from './Components/NotAuth'
import Result from './Components/Result'
import getCookie from './GetCookie'

//Material UI Components :
import {Button, ButtonGroup} from '@material-ui/core'

// //Material Icons :
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import PeopleRounded  from '@material-ui/icons/PeopleRounded'
import PlayArrowRounded  from '@material-ui/icons/PlayArrowRounded'
import ArrowUpwardIcon   from '@material-ui/icons/ArrowUpward'

function App() {

  const CsrfToken = getCookie('csrftoken')
  const IP = "127.0.0.1"
  const UsersPathUrl = `http://${IP}:8000/leaderboard`
  const AnimesPathUrl = `http://${IP}:8000/animes`
  const AnimesOrderedPathUrl = `http://${IP}:8000/sorted_animes`
  const QuestionsPathUrl = `http://${IP}:8000/test`
  const SubmitTestPathUrl = `http://${IP}:8000/submit`
  const UserDataPathUrl = `http://${IP}:8000/userdata`
  const LogoutPathUrl = `http://${IP}:8000/logout`
  const ChoicesLimit = 5 

 // views
  const [LeaderBoardView,setLeaderBoard] = useState(false)
  const [TestView,setTestView] = useState(false)
  const [AnimesView,setAnimesView] = useState(false)
  const [ProfileView,setProfileView]  = useState(false)
  const [ResultView,setResultView]  = useState(false)
  const [nextbtn,setnextbtn] = useState(false)
  const [submitbtn,setsubmitbtn]= useState(false)

  const [SubmitLoading,setSubmitLoading]= useState(false)
  const [TestScore,setTestScore] = useState() 
  const [Passed,setPassed] = useState()
  
  const [AvailableAnimes,setAvailableAnimes]= useState([])
  const [SelectedAnimes,setSelectedAnimes]=  useState([])
  const [animecounter,setanimecounter] = useState(0) 
  const [UserQuestions,setQuestions] = useState([])
  const [QuestionNumber,setQuestionNumber] = useState(0)
  const [QuestionsLength,setQuestionsLength] = useState(0)
  const [UserAnswers,setUserAnswers] = useState({})

  const [TopOtakus,setUsers] = useState([])
  const [AnimesData,setAnimesData] = useState([])

  const [userpoints,setPoints] = useState() 
  const [UserName,setusername] = useState()
  const [Level,setLevel] = useState("")
  const [TestsCompleted,setTestsCompleted] = useState()
  const [TestsStarted,setTestsStarted] = useState()
  const [BestScore,setBestScore] = useState()

  const [Authenticated,setAuthenticated] = useState()
  const [quiztimer,setQuizTimer] = useState(5)

  const [LoadingQuiz,setLoadingQuiz]= useState(false)
  const [Time_over,setTime_over] = useState(false)
    
// authenticate user and load base data
const AuthenticateUser = ()=>
{
  // save session in local storage
  localStorage.setItem("Logged",true)
  GetUserData()
  setAuthenticated(true) 
}
 

// on loading get basic user data if he is authenticated
useEffect(() => {

  const Logged = localStorage.getItem("Logged");
  if (Logged)
  {
    setAuthenticated(true)
    GetUserData()
  }
  else
  {
    setAuthenticated(false)
    
  }
  
}, []);



const Logout =  async()=>{

    const logout = await fetch(LogoutPathUrl)
    const response = await logout.json()
    console.log(response.msg)

    // clear local storage
    localStorage.removeItem("Logged");
    
    ExitTestMode()
    setusername()
    setLevel()
    setTestsCompleted()
    setTestsStarted()
    setPoints()
    setBestScore()
    setAuthenticated(false)

    setTestScore()
    setQuestionNumber(0)
    setanimecounter(0)
    setProfileView(false)
    setTestView(false)
    setAnimesView(false)
  }


 const GetUserData = async()=>
{
  const res = await fetch(UserDataPathUrl,{
    method:'GET'
  })
  const data = await res.json()
  setusername(data.username)
  setLevel(data.level)
  setTestsCompleted(data.tests_completed)
  setTestsStarted(data.tests_started)
  setPoints(data.points)
  setBestScore(data.best_score)

}

//get the DashBoard data (topusers, animes)
const FetchDashBoard  =  async()=>
{  
  const response = await fetch(UsersPathUrl)
  const Users  = await response.json()
  FetchAnimes()
  setUsers(Users)

  setAnimesView(false)
  setLeaderBoard(true)
}

//fetch sorted animes for the dashboard
const FetchAnimes  =  async()=>
{ 
  const res = await fetch(AnimesOrderedPathUrl)
  const animes = await res.json()
  setAnimesData(animes)
}


// show available animes for the user to choose from
const ShowAvailableAnimes = async()=>
{
  const res = await fetch(AnimesPathUrl)
  const animes = await res.json()
  setAvailableAnimes(animes)
  setSelectedAnimes([])
  setanimecounter(0)
  setTestScore()
  setResultView(false)
  setTestView(false)
  setLeaderBoard(false )
  setAnimesView(true)
}


const showprofile = ()=>
{
  setTestView(false)
  setLeaderBoard(false)
  setAnimesView(false)
  setResultView(false)
  setProfileView(true)
}

///////////////////////////////////////////  Quiz Handling Functions   ////////////////////////////////////////////////

const ToggleAddRemoveAnime = (id) =>
{  


  // removing anime 
 if( SelectedAnimes.filter((anime)=>(anime.id===id)).length>=1)
 {
   
    setSelectedAnimes(SelectedAnimes.filter((anime)=>anime.id!==id))
    setanimecounter(animecounter-1)
  }

 // adding anime
 else
 {
   if(SelectedAnimes.length < ChoicesLimit)
   {
      setSelectedAnimes([...SelectedAnimes,...AvailableAnimes.filter((anime) =>anime.id===id)])
      setanimecounter(animecounter+1)  
    }
}

}



const GetQuestions = async()=>
{
  
  const res = await fetch(QuestionsPathUrl,{
    method : 'POST',
    headers : {
      'Content-type': 'application/json',
      'X-CSRFToken': CsrfToken,
    },
    body: JSON.stringify({
      selectedanimes:SelectedAnimes
    })
  })

  const questions = await res.json()
  console.log(questions)

  setQuestionsLength(questions.length)
  setQuestions(questions)  
  setAnimesView(false)
  setLoadingQuiz(true)


}

useEffect(()=>{
  if (LoadingQuiz)
  {

    const QuizCountDown = setInterval(()=>{
      setQuizTimer(quiztimer-1)
    },1000)
    
    if (quiztimer===0)
    {
      setLoadingQuiz(false)
      setTestView(true)
      setnextbtn( true)
      clearInterval(QuizCountDown)
    } 
    return ()=>clearInterval(QuizCountDown)
  }
    
},[quiztimer,LoadingQuiz])


const [seconds,setseconds]= useState(0)
const [minutes,setminutes]= useState(2)

const reset_question_timer = ()=>
{
  setseconds(0)
  setminutes(2)
} 

const submit_view = ()=>
{
  setnextbtn(false)
  setsubmitbtn(true)  
}
useEffect(()=>{
  if(TestView)
  { 
    const timer = setTimeout(()=>{

      // 00:00
      seconds===0 &&  minutes>0 && setseconds(59)
      seconds >=1 && minutes>=0 && setseconds(seconds-1)

      minutes >0 && seconds===0 && setminutes(minutes-1)
    },100)
    

    if( minutes===0 && seconds===0 )
    {
      if ( QuestionNumber+1 ===UserQuestions.length )
      {
        setTime_over(true)
        alert("Times up, over, blaow !")
        return ()=>clearTimeout(timer)

      }
      else
      {
        reset_question_timer()
        setQuestionNumber(QuestionNumber+1)
      }
    }
    
    return ()=>clearTimeout(timer)
  }
},[seconds,minutes,QuestionNumber,TestView])


const reset_things = ()=>
{
  setQuizTimer(5)
  reset_question_timer()
  setQuestionNumber(0)
  setQuestions([])
  setSelectedAnimes([])
  setTime_over(false)
  setsubmitbtn(false)
  setanimecounter(0)
}


const HandleAnswerChoose = (answer,question_id) =>
{
  const dict = UserAnswers
  dict[question_id] = answer
  setUserAnswers(dict)
}

const nextquestion =()=>
{
 
  if(QuestionNumber < UserQuestions.length-1)
  {
    setQuestionNumber(QuestionNumber+1)
    reset_question_timer()
  }

}
useEffect(()=>
{
  if (QuestionNumber+1 ===UserQuestions.length)
  {
    submit_view()
  }

},[QuestionNumber])

//end quiz
const Submit =  ()=>
{
  console.log(UserAnswers)
  reset_things()
  setSubmitLoading(true)
  SendTestResulst()
  setTestView(false)
  setResultView(true)
}

const  SendTestResulst = async()=>
{
  const res = await fetch(SubmitTestPathUrl,{
    method : 'POST',
    headers : {
      'Content-type': 'application/json',
      'X-CSRFToken': CsrfToken,
    },
    body: JSON.stringify({
      results:UserAnswers,
      questionslength:QuestionsLength
    })
  })

  
  const result = await res.json()
  
  console.log(result)
  setTestScore(result.testscore)
  setPassed(result.passed)
  result.passed && setPoints(userpoints+result.testscore)
  setUserAnswers({})

  
  setTimeout(()=>{
    setSubmitLoading(false)
  }, 2000);
}

const ExitTestMode = ()=>
{
  reset_things()
  setTestScore()
  setUserAnswers({})
  setTestView(false)
  setAnimesView(true)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


 if(Authenticated)
 {

   return (
    <div className="App"> 

      <Navbar username={UserName} level={Level} points={userpoints} 
      showprofile={showprofile} test={TestView}/>
    
      
    <ButtonGroup orientation="vertical" className="ButtonsGroup" > 

            {!TestView &&  !LoadingQuiz&& <Button 
            className="ButtonChild"
            onClick={FetchDashBoard} 
            size="small"
            variant="contained"  
            startIcon={<PeopleRounded/>}>
              DashBoard
            </Button>
            }
              {!TestView && !LoadingQuiz&&<Button 
              className="ButtonChild"
              onClick={ShowAvailableAnimes} 
                size="small"
                variant="contained" >
                {TestsCompleted !== undefined? TestsCompleted>=1?
                "take Quiz":
                "take your first Test !"  :""}
              </Button>}
            

             {AnimesView && animecounter===ChoicesLimit &&
             <Button
              className="ButtonChild"
              onClick={GetQuestions} 
              variant="contained"
              color="primary"  disableElevation
              startIcon={<PlayArrowRounded/>}>
                start
              </Button>
        }
  
          {TestView&&
          <Button 
          className="ButtonChild"
          onClick={ExitTestMode} 
          variant="outlined"  disableElevation
          startIcon={<ExitToAppRounded/>}>
            exit test mode
          </Button>
          }
        </ButtonGroup>
        {LoadingQuiz && <div>
          <p>
            quiz starts in 
          </p>
          <p>
            {quiztimer}
          </p>
          </div>}
     

        {ResultView &&
          <Result score={TestScore} NumberOfQuestions={QuestionsLength} passed={Passed} loading={SubmitLoading} highest_score={BestScore}/>
        } 



        {AnimesView&& <AnimesChoices all_animes = {AvailableAnimes} onSelect= {ToggleAddRemoveAnime}
        choicesnumber={animecounter}/>}

        {TestView&& <EachQuestion question = {UserQuestions[QuestionNumber].question}
          id =  {UserQuestions[QuestionNumber].id}
          choices = {[UserQuestions[QuestionNumber].choice1,
          UserQuestions[QuestionNumber].choice4,
          UserQuestions[QuestionNumber].choice3,
          UserQuestions[QuestionNumber].choice2,
           ]}        
           question_number={QuestionNumber}
           test_end={Time_over}
           onChoose={HandleAnswerChoose}seconds= {seconds} minutes={minutes}/>
           }

      <ButtonGroup orientation="vertical" className="ButtonsGroup">  

            {TestView&& nextbtn&& 
            <Button onClick={nextquestion} 
            className="ButtonChild"
            size="small"
            variant="contained"  disableElevation
            endIcon={< NavigateNextRoundedIcon/>}>
              next
            </Button>
            }

            {TestView&&submitbtn&& 
            <Button className="ButtonChild" onClick={Submit} variant="contained" endIcon={<ArrowUpwardIcon/>}>
              submit
            </Button>}

      </ButtonGroup>

         { ProfileView && 
        <Profile  
        tests_completed={TestsCompleted}
        tests_started = {TestsStarted}
        best_score = {BestScore}
        logout={Logout}
        /> } 

         
        {LeaderBoardView&& <LeaderBoard otakus= {TopOtakus} username={UserName} animes={AnimesData}/>  }  
        <br/>
    </div>

  );
}




else
{
    return(    

        <LoginRegisterView csrftoken={CsrfToken} IP={IP} 
        authenticated={Authenticated}
        authenticate={AuthenticateUser}/>
    );
  }
  
}

export default App;
