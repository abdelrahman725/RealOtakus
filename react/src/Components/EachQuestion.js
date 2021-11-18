import { useState} from "react"
import {RadioGroup,FormControlLabel,Radio} from '@material-ui/core'


function EachQuestion({question,question_number,onChoose,id,choices})
{

  const [Selected,setSelected] = useState()

  
const handleChange = (e)=>
  {
     setSelected(e.target.value)
     onChoose(e.target.value,id)
  }
  return(
  
   <div className="EachQuestion" >

        <div className="question" >
            <strong className="question_title">
            {question_number+1}. {question} ?
            </strong> 
        </div> 


         <RadioGroup className="Choices"name='question_choices' >
              {choices!==undefined&&
                  choices.map((each_choice,index) =>(    
                      <FormControlLabel value={each_choice} control={<Radio size="small"
                       color="secondary"
                      />} label={each_choice} key={index} className="choice"
                      checked={Selected===each_choice}
                      onChange={handleChange}/>
                   ))
              } 
          </RadioGroup>
        
     </div>
     
  )

}

export default EachQuestion