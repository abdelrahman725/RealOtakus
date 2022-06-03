import Question from "./Question"
import { GamdeModeContext,ServerContext } from "../App"
import { useContext, useState, useEffect } from "react"
import getCookie from "../GetCookie"
// import Prompt from 'react-router-dom' 

const Game = ({questions,setquizstart,setgameresults}) => {
  
  const CsrfToken = getCookie('csrftoken')
  const {setGameMode,GameMode} = useContext(GamdeModeContext)
  const {server} = useContext(ServerContext)
  const [Answers,setAnswer] = useState({})
  const[index,setindex] = useState(0)
  const len = questions.length

  const nextquestion = ()=>index <len-1 && setindex(index+1)


  const alertUserbeforeleaving = e => {
    e.preventDefault()
    e.returnValue = ''
  }
      

useEffect(()=>{
  window.addEventListener('beforeunload', alertUserbeforeleaving)
  return () => {
    window.removeEventListener('beforeunload', alertUserbeforeleaving)
  }
},[])


  const onAnswer = (id,useranswer)=>
  {
    const new_answers = Answers
    new_answers[id] = useranswer
    setAnswer(new_answers)
  }

  const SubmitGame = async()=>
  {
    setGameMode(false)
    const send = await fetch(`${server}/home/sendgame`,{

      method : 'POST',
      headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': CsrfToken,
      },
      body: JSON.stringify({
        results:Answers
      })
    })
    const res  = await send.json()

    setgameresults(res.answers,res.score,res.level,Answers)
  
  }


  return (
    <>    
    
     <div className="Quiz">   

            <Question  each_question={questions[index]} Q_no={index} onselect={onAnswer} questions_length={len} nextquestion={nextquestion}/>
            <br />

            
            <div className="buttoncontainer">
                <button onClick={()=>{setquizstart(false);setGameMode(false)}}>Cancel </button>
                {index===len-1&& <button onClick={SubmitGame}> submit</button>}
                <button onClick={nextquestion} className={index===len-1?"faded":""} disabled={index===len-1} >next</button>
                              
            </div>
        </div>
    

    </>
  )
}

export default Game