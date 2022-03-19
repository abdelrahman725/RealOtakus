import Question from "./Question"
import { GamdeModeContext,ServerContext } from "../App"
import { useContext, useState, useEffect } from "react"
import getCookie from "../GetCookie"

const Game = ({questions,setgameresults}) => {
  
  const CsrfToken = getCookie('csrftoken')
  const {setGameMode} = useContext(GamdeModeContext)
  const {server} = useContext(ServerContext)
  const [Answers,setAnswer] = useState({})
  const [timeout,settimout] = useState(false)

  const[index,setindex] = useState(0)
  const len = questions.length
  const[minutes,setminutes] = useState(2)
  const [seconds,setseconds]= useState(0) 
  const nextquestion = ()=>index <len-1 && setindex(index+1)

  const resettimer = ()=>
  {
    if (index < len-1){ setseconds(0) ;setminutes(2) }
   }

  const Next = ()=>{nextquestion() ;resettimer() }


  useEffect(()=>{
    const myInterval = setInterval(() => {
            if (seconds > 0) {
                setseconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    if(index===len-1)
                    {
                      settimout(true)
                    }
                    nextquestion()
                    resettimer()
                    clearInterval(myInterval)
                } else {
                    setminutes(minutes - 1);
                    setseconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
     
    })


  const onAnswer = (id,useranswer)=>
  {
    const new_answers = Answers
    new_answers[id] = useranswer
    setAnswer(new_answers)
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
        results:Answers
      })
    })
    const res  = await send.json()
    setgameresults(res.answers,res.score,res.level)
  }


  return (
    <>    
    <div className="Game"> 
    <strong>
      time left <br />{minutes}:{seconds}
    </strong>

      <br /><br />
     {!timeout?  <Question  each_question={questions[index]} i={index} onselect={onAnswer}/>: <strong>time is up</strong>}
     <br />

     {index<len-1?
     <button onClick={Next} className="next">next</button>:
     <button onClick={SubmitGame}> submit</button>
     }
     <br />
     <button onClick={()=>setGameMode(false)}>Cancel </button>
     </div>

    </>
  )
}

export default Game