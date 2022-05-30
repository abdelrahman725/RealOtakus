import getCookie from "../../GetCookie"
import { ServerContext } from "../../App"
import { useContext, useState, useEffect,useRef } from "react"



const QuestionsForReview = ({questions}) => {
  
  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')


 const ReviewContribution = async(state,question)=>{
    
      const send = await fetch(`${server}/home/review`,{
        method : 'POST',
        headers : {
          'Content-type': 'application/json',
          'X-CSRFToken': CsrfToken,
        },
        body: JSON.stringify({
          state:state,
          question:question

        })
      })
  
      const res  = await send.json()
      console.log(res)

    }



  return (
    <div> your responsibility to review these questions</div>
  )
}

export default QuestionsForReview