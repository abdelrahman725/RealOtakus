import Question from "./Question"
import Result from "./Result"
//import Loading from "./Loading"

import getCookie from "../GetCookie"

import { GamdeModeContext,ServerContext } from "../App"
import { useContext, useState, useEffect } from "react"

const Game = ({questions,setgamestarted}) => {

  const CsrfToken = getCookie('csrftoken')
  const {server} = useContext(ServerContext)
  const {setGameMode,setUserData,GameMode} = useContext(GamdeModeContext)
  
  const [useranswers,setuseranswers] = useState({})
  const [index,setindex] = useState(0)
  const questions_length = questions.length
  
  const [quizresults,setquizresults] = useState({}) 
  const [gamescore,setgamescore] = useState()
  
  
  useEffect(()=>{
  if (GameMode)
  {
    window.addEventListener('beforeunload', alertUserbeforeleaving)
    return () => {
      window.removeEventListener('beforeunload', alertUserbeforeleaving)
    }
  } 
},[GameMode])

  const alertUserbeforeleaving = e => {
    e.preventDefault()
    e.returnValue = ''
  }
      

  const nextquestion = ()=>index < questions_length-1 && setindex(index+1)

  const onAnswer = (id,each_new_answer)=>
  {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const SubmitGame = async()=>
  {
    const send = await fetch(`${server}/home/sendgame`,{
      
      method : 'POST',
      headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': CsrfToken,
      },
      body: JSON.stringify({
        results:useranswers
      })
    })
    const results  = await send.json()
    
    setquizresults(results.rightanswers)
    console.log(results.rightanswers)
    setgamescore(results.newscore)
    setUserData(prev => ({...prev, points : prev.points + results.newscore }))    
    setGameMode(false)
  }

  return (
    <>
    {GameMode ?
    <div className="Quiz">   
        <Question
        each_question={questions[index]}
        Q_no={index}
        onselect={onAnswer}
        questions_length={questions_length}
        nextquestion={nextquestion}/>
        
        <br /> 
        
        <div className="buttoncontainer">
            <button onClick={()=>{
              setgamestarted(false)
              setGameMode(false)
              }}>
            exit
            </button>
            
            {index===questions_length-1&& 
            <button onClick={SubmitGame}>
            submit
            </button>}
            
            <button
            onClick={nextquestion}
            className={index===questions_length-1?"faded":""}
            disabled={index===questions_length-1}>
            next
            </button>            
        </div>
    </div> 
    :
    <Result
    results={quizresults}
    useranswers={useranswers}
    score={gamescore}
    questions={questions}/> 
  }
  </>
  )
}

export default Game