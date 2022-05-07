import { GamdeModeContext } from "../App"
import { useContext } from "react"
const Result = ({results,score,setquizstart}) => {

  const {setGameMode} = useContext(GamdeModeContext)

  return (
    <>
    <p>test results </p>
    <p>you scored {score}/5 </p>      
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
      ))}
      <button onClick={()=>{setquizstart(false);setGameMode(false)}}>take another quiz</button>
      </>
  )
}

export default Result