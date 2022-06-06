import React from 'react'
import getCookie from "../../GetCookie"
import { ServerContext } from "../../App"
import { useContext, useState } from "react"

const EachQuestion = ({anime,question,reviewstate,setreviewstate}) => {

const {server} = useContext(ServerContext)  
const CsrfToken = getCookie('csrftoken')

const [loading,setloading] = useState(false) 


const ReviewContribution = async(state,question)=>{

    setloading(true)

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
    setreviewstate(prev => ({...prev,[question]:`${state}state`}))
    setloading(false)

    }
  

 
return (
    <div  className={`eachquestion ${reviewstate}`}>
        <p>
            <span><strong>{anime}</strong></span><br />
            {question.question}
        </p>   
        <button  onClick={()=>ReviewContribution("approve",question.id)}
         disabled={reviewstate!=="reviewstate"} style={{cursor:reviewstate==="reviewstate"?"pointer":"default"}}
         className="approve_btn">approve</button>&nbsp;   
       
        <button onClick={()=>ReviewContribution("decline",question.id)}
         disabled={reviewstate!=="reviewstate"} style={{cursor:reviewstate==="reviewstate"?"pointer":"default"}}
        className="decline_btn">decline</button>   
    </div>
  )
}

export default EachQuestion