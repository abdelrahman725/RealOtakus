 import {useState} from "react";
 import {FormControlLabel,Checkbox,FormGroup} from '@material-ui/core'


const EachAnime = ({eachanime,onSelect,choicesnumber})=>
{

  const [Checked,setChecked] = useState(false)
  const onCheck =()=>
  {
      onSelect(eachanime.id)
  
      !Checked && choicesnumber < 5 ? setChecked(true) : setChecked(false)

  }

  return(

 
      <div id ={eachanime.id}
      className="EachAnime">
      <FormGroup>
      <FormControlLabel
       control={<Checkbox  color="secondary"
        checked={Checked}
        onChange={onCheck}/>}
      label= {eachanime.anime_name} />  
     </FormGroup>

    </div>
  )
}

export default EachAnime;
