import Contripution from "./Contribution"

const Contributions = ({approved,pending}) => {
  return (
  <>
      <h2>Your Contributions</h2><br />
      <div className="questionscontainer">
   
    { pending.length > 0 || approved.length > 0 ?
    
    <div className="contributions">
        
      <p>pending  </p>
      {pending.map((q,index)=>(
        <Contripution 
        key={index}
        question={q}
        is_approved={q.approved}/>
      ))}
      <br />
      <p>approved  </p>
      {approved.map((q,index)=>(
        <Contripution
        key={index} 
        question={q}
        is_approved={q.approved}/>
      ))}
          
    </div>
      
      :
      
      "no contributions yet"
    }
    </div>
  
  </>
  )
}

export default Contributions