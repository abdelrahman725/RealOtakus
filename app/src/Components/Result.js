import { GamdeModeContext } from "../App"
import { useContext } from "react"
const Result = ({results,score}) => {

  const {setGameMode} = useContext(GamdeModeContext)

  return (
    <>
      <h2>test results </h2>
  <h3>you scored {score}/5 </h3>      
      {results.map((res,index)=>(
        <div key={index}>

        <strong key={index}>
          {res.question}
        </strong>
        <p>
          {res.right_answer}
        </p>
        <hr /><br />
        </div>
      ))

      }
      <button onClick={()=>setGameMode(false)}>take another quiz</button>
      </>
  )
}

export default Result