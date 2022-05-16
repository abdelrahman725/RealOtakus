const Anime = ({eachanime,onchoose,selected}) => {

  return (
    <div className="eachanime" 
    onClick={()=>onchoose(eachanime.id)}
     
    style={{backgroundColor:selected===eachanime.id?"#ff4500":"#262F36"}}>
    <strong>{eachanime.anime_name} </strong>
    </div>
  )
}

export default Anime


