const Animes = ({animes,GetTest}) => {

  return (
    <> 
   <div>
    {animes.map((anime,index)=>(
    <div className="eachanime" onClick={()=>GetTest(anime.id)} key={index}>
      {anime.anime_name}
    </div>
    ))}
      
   </div>
    </>
  )
}

export default Animes