import React from 'react'
import {useState,useEffect} from 'react'
import './App.css'
import EachQuestion from './Components/EachQuestion'
import LeaderBoard from './Components/LeaderBoard'
import Profile from './Components/Profile'
import AnimesChoices from './Components/Animes'
import Interface from './Components/Interface'
import Navbar from './Components/Navbar'
import LoginRegisterView from './Components/NotAuth'
import Result from './Components/Result'
import getCookie from './GetCookie'

//Material UI Components :
import {Button, ButtonGroup} from '@material-ui/core'
//import CircularProgress from '@material-ui/core/CircularProgress';
//import Box from '@material-ui/core/Box';
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
  const [InterfaceView,setInterfaceView]  = useState(true)
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
  const [TestsCount,setTestsCount] = useState()
  const [Authenticated,setAuthenticated] = useState()

    
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
    GetUserData();
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
    
    setusername()
    setLevel()
    setTestsCount()
    setPoints()
    ExitTestMode()
    setAuthenticated(false)

    setTestScore()
    setQuestionNumber(0)
    setanimecounter(0)
   
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
  setTestsCount(data.TestsCount)
  setPoints(data.points)

}

//get the DashBoard data (topusers, animes)
const FetchDashBoard  =  async()=>
{  
  const response = await fetch(UsersPathUrl)
  const Users  = await response.json()
  FetchAnimes()
  setUsers(Users)
  setLeaderBoard(true)
  setInterfaceView(false)
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
  setInterfaceView(false)
  setTestView(false)
  
  setAnimesView(true)
}




const showprofile = ()=>
{
  
  setTestView(false)
  setLeaderBoard(false)
  setAnimesView(false)
  setInterfaceView(false)
  setResultView(false)

  

  setProfileView(true)
}

const Home =()=>
{
  setInterfaceView(true)
  setResultView(false)
  setLeaderBoard(false)
  setProfileView(false)
  setAnimesView(false)
}


///////////////////////////////////////////  Quiz Handling Functions   ////////////////////////////////////////////////


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

  setQuestionsLength(questions.length)
  setQuestions(questions)  
  setAnimesView(false)
  setnextbtn( true)
  setTestView(true)

}

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

const HandleAnswerChoose = (answer,question_id) =>
{
  //setUserAnswers([...UserAnswers,{id:question_id,answer:answer}])
  const dict = UserAnswers
  dict[question_id] = answer
  setUserAnswers(dict)
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
    setQuestionNumber(QuestionNumber+1)
  }

}

//end quiz
const Submit =  ()=>
{
  setSubmitLoading(true)
  SendTestResulst()
  setTestView(false)
  setsubmitbtn(false)
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
  setQuestions([])
  setQuestionNumber(0)
  
  setTimeout(()=>{
    setSubmitLoading(false)
  }, 2000);
}

const ExitTestMode = ()=>
{
  setTestScore()
  setQuestionNumber(0)
  setanimecounter(0)
  setSelectedAnimes([])
  setUserAnswers({})
  setQuestions([])
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

          {!InterfaceView&& !TestView&&
                <Button 
                className="ButtonChild"
                onClick={Home} 
                size="small"
                variant="contained" >
                  Home
                </Button>
          }

 
        {InterfaceView&&
            <Button 
            className="ButtonChild"
            onClick={FetchDashBoard} 
            size="small"
            variant="contained"  
            startIcon={<PeopleRounded/>}>
              DashBoard
            </Button>
        }          
          {InterfaceView&&
              <Button 
              className="ButtonChild"
              onClick={ShowAvailableAnimes} 
                size="small"
                variant="contained" >

                {TestsCount !== undefined? TestsCount>=1?
                "take Quiz":
                "take your first Test !"  :""}
              </Button>
            }

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
     
        {InterfaceView&& <Interface />} 

        {ResultView &&
          <Result score={TestScore} NumberOfQuestions={QuestionsLength} passed={Passed} loading={SubmitLoading}/>
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
           question_number={QuestionNumber} onChoose={HandleAnswerChoose}/>}

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
        tests_count={TestsCount}
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
