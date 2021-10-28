import { useState } from "react";
const EachAnime = ({eachanime,onSelect,choicesnumber})=>
{
  const [color,setcolor] = useState("cadetblue")
  const onChoose =()=>
  {
      onSelect(eachanime.id)
      color==="cadetblue"?
      choicesnumber<5 && setcolor("green"):
      setcolor("cadetblue")
  }
  return(
 

      <div id ={eachanime.id}
      className="EachAnime" onClick={onChoose} 
       style={{backgroundColor:color}}>
      <div className="AnimeName">
      {eachanime.anime_name}
      </div>
 
    </div>
  )
}

export default EachAnime;
