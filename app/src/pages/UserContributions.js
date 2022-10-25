import ContributedQuestion from "./Components/ContributedQuestion"
import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect } from "react"

const UserContributions = () => {

  const [approved_contributions,set_approved_contributions]= useState([])
  const [pending_contributions,set_pending_contributions]= useState([])
  const [rejected_contributions,set_rejected_contributions]= useState([])
  const [n_contributions,set_n_contributions] = useState()
  
  useEffect(()=>{

    async function get_contributions(){

      const contributions  = await async_http_request({path:"get_make_contribution"})
      if (contributions===null){
        return
      }

      set_n_contributions(contributions.length)
      
      contributions.map((contribution) =>  {
          contribution.approved===null  && set_pending_contributions(pending =>   [...pending,  contribution])
          contribution.approved===false && set_rejected_contributions(rejected => [...rejected, contribution])
          contribution.approved===true  && set_approved_contributions(approved => [...approved, contribution])  
      })
        
    }

    get_contributions()}
  
  ,[])

return (
    
    <div className="questions_container">
        <h2>{n_contributions && n_contributions} contributions</h2>
        
        {pending_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
        
        {approved_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
        
        {rejected_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
                
    </div> 
  )
}

export default UserContributions