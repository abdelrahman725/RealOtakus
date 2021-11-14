 import {useState} from "react";
const EachAnime = ({eachanime,onSelect,choicesnumber})=>
{
  const [color,setcolor] = useState("black")

  const onChoose =()=>
  {
      onSelect(eachanime.id)
      color==="black"?
      choicesnumber<5 && setcolor("green"):
      setcolor("black")
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
