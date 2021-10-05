
const EachAnime = ({eachanime,onSelect})=>
{
  return(
    <div id ={eachanime.id}className="EachAnime" onClick={()=>onSelect(eachanime.id)} selected = {false} >
      {eachanime.anime_name}
    </div>
  )
}

export default EachAnime;
