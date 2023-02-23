import async_http_request from './components/AsyncRequest'
import Result from './components/Result'
import Game from './components/Game'
import { FiAlertTriangle } from 'react-icons/fi'
import Select from 'react-select'
import { GlobalStates } from 'App'
import { SelectStyles, N_Game_Questions } from 'Constants'
import { useState, useContext, useEffect, useRef } from 'react'

const GameView = () => {

  const { game_started, setgame_started, set_user_data } = useContext(GlobalStates)
  const [animesoptions, setanimesoptions] = useState()
  const [gamequestions, setgamequestions] = useState()
  const [selected_anime, setselected_anime] = useState()
  const [quizresults, setquizresults] = useState({})
  const [useranswers, setuseranswers] = useState({})
  const [game_score, setgame_score] = useState()
  const [game_info, set_game_info] = useState()

  const anime_select = useRef(null)

  // get selected anime questions
  const GetGame = async () => {

    setgame_started(true)
    setgamequestions()
    setquizresults({})
    setuseranswers({})

    const game_response = await async_http_request({ path: `getgame/${selected_anime.value}` })

    if (game_response.status !== 200) {
      set_game_info("no available questions for this anime")
      setgame_started(null)
      return
    }

    setselected_anime()
    setgamequestions(game_response.payload.game_questions)

    set_user_data(prev => ({
      ...prev,
      tests_started: prev.tests_started + 1,
    }))

  }

  const on_anime_select = (selected) => {
    setselected_anime(selected)
    anime_select.current.blur()
  }

  const hide_anime = (n_interactions, anime_active_questions) => {
    if ((anime_active_questions - n_interactions) >= N_Game_Questions) {
      return false
    }
    return true
  }

  useEffect(() => {

    async function get_available_quiz_animes() {

      const game_animes_response = await async_http_request({ path: "getgameanimes" })

      if (game_animes_response === null) {
        return
      }

      setanimesoptions(
        game_animes_response.payload.animes.map(anime => ({
          value: anime.id,
          label: anime.anime_name,
          user_interactions: anime.n_user_interactions,
          anime_questions: anime.n_active_questions
        }))
      )

    }

    get_available_quiz_animes()

    return () => {
      setgame_started(null)
    }

  }, [])

  return (
    <div className="game_view_container">
      {game_started === null &&

        <div className="pre_game_container">
          <h1>Get ready for the <span>5</span> questions Quiz</h1>
          <div className="res_info">{game_info && game_info}</div>

          <div className="container">

            <div className="instructions">
              <h2>instructions</h2>
              <p>you have 1:40 min for each question.</p>
              <p>avoid starting tests without submitting them.</p>
              <p>
                <FiAlertTriangle className="warning_icon" />
                After start do not leave the page (e.g. switch tabs) before submission, your progress will be lost.
              </p>
            </div>

            <div className="start_game">
              <Select
                styles={SelectStyles}
                className="react_select"
                placeholder="select anime"
                value={selected_anime}
                isClearable={true}
                options={animesoptions}
                isLoading={animesoptions ? false : true}
                onChange={on_anime_select}
                isOptionDisabled={(option) => hide_anime(option.user_interactions, option.anime_questions)}
                ref={anime_select}
              />

              <button className="submit_btn" onClick={() => selected_anime ? GetGame() : anime_select.current.focus()} >
                Start
              </button>
            </div>
          </div>
        </div>
      }

      {game_started === true &&
        <Game
          questions={gamequestions}
          setgame_score={setgame_score}
          setquizresults={setquizresults}
          setuseranswers={setuseranswers}
          useranswers={useranswers}
          set_game_info={set_game_info}
        />
      }

      {game_started === false &&
        <Result
          results={quizresults}
          useranswers={useranswers}
          questions={gamequestions}
          score={game_score}
        />
      }

    </div>
  )
}

export default GameView
