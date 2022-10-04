import Contripution from "./Contribution"

const Contributions = ({approved,pending,rejected}) => {
  return (
  <>
      <h2>Your Contributions</h2><br />
      <div className="questionscontainer">
   
    { pending.length > 0 || approved.length > 0 ?
    
    <div className="contributions">
        
      <p>pending  </p>
      
      {pending.map((c,index)=>(
        <Contripution 
        key={index}
        question={c.question}
        is_approved={null}/>
      ))}

      <br />
      
      <p>approved  </p>
      {approved.map((c,index)=>(
        <Contripution
        key={index} 
        question={c.question}
        is_approved={true}/>
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