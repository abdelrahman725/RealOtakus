import { useState,useEffect } from "react"
function EachQuestion({question,n,onChoose,right_answer,id,choices})
{

const Randomise_Choices = (array)=>
{
  for (let i =array.length-1; i > 0; i--)
  {
    let random_index = Math.floor(Math.random() * (i+1) )
   
    let temp = array[i]
    array[i] = array[random_index]
    array[random_index] = temp
  }
  return array
  
}



const [Selected,setSelected] = useState("")
const [RandomChioces,setRandomChoices] = useState()


  useEffect(()=>{
   setRandomChoices(Randomise_Choices(choices)) 
  
  },[n])
  
  const handleChange = (e)=>
  {
     setSelected(e.target.value)
     onChoose(e.target.value===right_answer?true:false)
  }
  return(
    

   <div className="EachQuestion" >

     <div className="question" >
        <strong className="question_title">
         {n+1}. {question} ?
        </strong> 
    </div>
        <hr />

     {RandomChioces!==undefined&& RandomChioces.map((each_choice,index) =>(
       
            <div className="Choice" key={index}>
                <label>
                  <input type="radio" 
                  onChange={handleChange}
                  name={`choice/${id}`}
                  checked={Selected===each_choice}
                  value={each_choice}
                  className="choice"/>
                  {each_choice}
                </label>
              
            </div>
     ))}
           
        
     </div>
     
  )

}

export default EachQuestion
