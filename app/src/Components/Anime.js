const Anime = ({eachanime,onchoose,selected}) => {

  return (
    <div className="eachanime" 
    onClick={()=>onchoose(eachanime.id)}
     
    style={{backgroundColor:selected===eachanime.id?"green":"black"}}>
    <strong>{eachanime.anime_name} </strong>
    </div>
  )
}

export default Anime