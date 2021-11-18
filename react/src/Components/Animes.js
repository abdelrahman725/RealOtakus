import EachAnime from "./EachAnime"

const AnimesChoices = ({all_animes,onSelect,choicesnumber})=>
{
  return(
    <div className="AnimesChoices">
      
      pick your favorite 5 animes {" "}
        <strong>
        {choicesnumber}/5:
        </strong>
      <br />
      <br />
      {all_animes.map( (eachanime) =>(
        <EachAnime key= {eachanime.id}
        onSelect = {onSelect}
        eachanime={eachanime}
        choicesnumber={choicesnumber}
        />

      ))}

    </div>
  )
}
export default AnimesChoices
