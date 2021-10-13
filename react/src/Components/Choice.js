import { useState } from "react";

const Choice = ({choice,right,onChoose,anime_id})=>
{ 
    
  const [color,setcolor]= useState("black")
 
  return(
  
   <div className="Choice" onClick={()=>onChoose(right,anime_id)}>
     <p>
       {choice}
     </p>

   </div>



  )

}

export default Choice
