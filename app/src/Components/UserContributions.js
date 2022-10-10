import ContributedQuestion from "./ContributedQuestion"
import async_http_request from "./AsyncRequest"
import {  useState, useEffect, useRef } from "react"

const UserContributions = () => {

  const [approved_contributions,set_approved_contributions]= useState([])
  const [pending_contributions,set_pending_contributions]= useState([])
  const [rejected_contributions,set_rejected_contributions]= useState([])
  const [n_contributions,set_n_contributions] = useState()
  
  const get_contributions = async()=>{

    const contributions  = await async_http_request({path:"contribution"})

    set_n_contributions(contributions.length)
    
    contributions.map((contribution) =>  {
        contribution.approved===null  && set_pending_contributions(pending =>   [...pending, contribution])
        contribution.approved===false && set_rejected_contributions(rejected => [...rejected, contribution])
        contribution.approved===true  && set_approved_contributions(approved => [...approved, contribution])  
    })
      
  }

  useEffect(()=>{  get_contributions()},[])

return (
    
    <div className="contributions">
        <h2>your contributions</h2>
        
        {pending_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
        
        <br />
        
        {approved_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
        
        <br />
        
        {rejected_contributions.map((c,index)=> <ContributedQuestion contribution={c} key={index} /> )}
                
    </div> 
  )
}

export default UserContributions