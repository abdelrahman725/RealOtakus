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
    

    <div id ={eachanime.id}className="EachAnime" onClick={onChoose} 
    style={{backgroundColor:color}}>
      {eachanime.anime_name}
    </div>
  )
}

export default EachAnime;
