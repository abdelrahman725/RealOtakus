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
      <img id="AnimeImage" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Logo_Death_Note.jpg" alt="logo" 
       width="40" height="50"
       />
      <div className="AnimeName">
      {eachanime.anime_name}
      </div>
      <div>
      </div>
      
    </div>
  )
}

export default EachAnime;
