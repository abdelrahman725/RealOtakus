import EachAnime from "./EachAnime"

const AnimesChoices = ({all_animes,onSelect,color,choicesnumber})=>
{
  return(
    <div className="AnimesChoices">
      <hr/>
      choose 5 animes where you are confident 
      <br />
      {all_animes.map( (eachanime) =>(
        <EachAnime key= {eachanime.id}
        onSelect = {onSelect}
        eachanime={eachanime}
        choicesnumber={choicesnumber}
        />

      ))}
      <hr/>
    </div>
  )
}
export default AnimesChoices
