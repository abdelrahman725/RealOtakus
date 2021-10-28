import EachAnime from "./EachAnime"

const AnimesChoices = ({all_animes,onSelect,color,choicesnumber,number})=>
{
  return(
    <div className="AnimesChoices">
      
      choose 5 animes you are confident about{" "}
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
