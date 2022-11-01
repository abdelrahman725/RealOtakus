import ContributedQuestion from "./Components/ContributedQuestion"
import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect } from "react"

const UserContributions = () => {
  const [contributions,setcontributions] = useState({})
  const [n_contributions,set_n_contributions] =useState() 
  
  useEffect(()=>{

    async function get_contributions(){

      const contributions  = await async_http_request({ path : "get_make_contribution" })
      if (contributions===null)
        return
            
      const contributions_dict = {}
      contributions.map( ( contribution ) => {
        if (contribution.question.anime.anime_name in contributions_dict){
          contributions_dict[contribution.question.anime.anime_name] = [...contributions_dict[contribution.question.anime.anime_name], contribution]
        }
        else{
          contributions_dict[contribution.question.anime.anime_name]  = [contribution]
        }
      })
      
      setcontributions(contributions_dict)
      set_n_contributions(contributions.length)

    }

    get_contributions()
  }
  
  ,[])

return (
    
    <div className="questions_container">
        <h2>{n_contributions && n_contributions} Contributions for {Object.keys(contributions).length} animes</h2>
        
        {Object.keys(contributions).length > 0 &&
          Object.keys(contributions).map((anime,index) => (
            <div className="user_anime_contributions" key={index}>
              <p className="anime">{anime} &nbsp;<strong>{contributions[anime].length}</strong></p>
              <div>
                {contributions[anime].map((each_contribution,index)=>(
                  <ContributedQuestion key={index} contribution={each_contribution}/>
                ))}
              </div>
            </div>
          ))
        }
    </div> 
  )
}

export default UserContributions