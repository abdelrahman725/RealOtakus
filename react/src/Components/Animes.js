import EachAnime from "./EachAnime";

const AnimesChoices = ({all_animes,onSelect})=>
{
  return(
    <div className="AnimesChoices">
      <hr/>
      {all_animes.map( (eachanime) =>(
        <EachAnime key= {eachanime.id}
        onSelect = {onSelect}
        eachanime={eachanime}
        />

      ))}
      <hr/>
    </div>
  )
}
export default AnimesChoices;
