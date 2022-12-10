import ContributedQuestion from "./Components/ContributedQuestion"
import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect } from "react"

const UserContributions = () => {
  const [contributions,setcontributions] = useState({})
  const [n_contributions,set_n_contributions] = useState()
  const [n_pending_contributions,set_n_pending_contributions] = useState() 
  const [n_approved_contributions,set_n_approved_contributions] = useState() 
  const [n_rejected_contributions,set_n_rejected_contributions] = useState() 

  
  useEffect(()=>{

    async function get_contributions(){

      const fetched_contributions  = await async_http_request({ path : "get_make_contribution" })
      if (contributions===null)
        return
      
      console.log(fetched_contributions)

      set_n_pending_contributions(fetched_contributions.filter(c => c.approved===null).length)
      set_n_approved_contributions(fetched_contributions.filter(c => c.approved).length)
      set_n_rejected_contributions(fetched_contributions.filter(c => c.approved===false).length) 
      
      const contributions_dict = {}
      fetched_contributions.map( ( contribution ) => {
        if (contribution.question.anime.anime_name in contributions_dict){
          contributions_dict[contribution.question.anime.anime_name] = [...contributions_dict[contribution.question.anime.anime_name], contribution]
        }
        else{
          contributions_dict[contribution.question.anime.anime_name]  = [contribution]
        }
      })
      
      setcontributions(contributions_dict)
      set_n_contributions(fetched_contributions.length)

    }

    get_contributions()
  }
  
  ,[])

return (
    
    <div className="questions_container">
      <h2>{n_contributions} Total contributions</h2>
      {n_contributions > 0 &&
      <div>
        <div className="contributions_summary">
        
          <div className="contribution_state">
            <div className="circle approved"></div> {n_approved_contributions} approved
          </div>

          <div className="contribution_state">
            <div className="circle pending"></div>
            {n_pending_contributions} pending
          </div>          

          <div className="contribution_state">
            <div className="circle rejected"></div>  {n_rejected_contributions} rejected
          </div>
        </div>

        {Object.keys(contributions).map((anime,index) => (
          <div className="user_anime_contributions" key={index}>
            <p className="anime">{anime} &nbsp;<strong>{contributions[anime].length}</strong></p>
            <div>
              {contributions[anime].map((each_contribution, index)=>(
                <ContributedQuestion key={index} contribution={each_contribution}/>
              ))}
            </div>
          </div>
        ))}
      </div>
      }
      { n_contributions === 0 && "no contributions" }
      { n_contributions === undefined && "loading..." }
    </div> 
  )
}

export default UserContributions