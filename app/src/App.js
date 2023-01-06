import './App.css'
import NavBar from './pages/Components/NavBar'
import Home from './pages/Home'
import Contribute from './pages/Contribute'
import UserContributions from './pages/UserContributions'
import GameView from './pages/GameView'
import QuestionsForReview from './pages/QuestionsForReview'
import UserProfile from './pages/Profile'
import Notifications from './pages/Notifications'
import About from './pages/About'
import Footer from './pages/Components/Footer'
import CountryPanel from './pages/Components/SelectCountryPanel'

import React, { useState, useEffect, createContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { domain } from './pages/Components/AsyncRequest'

import useWebSocket from 'react-use-websocket'
import async_http_request from './pages/Components/AsyncRequest'

export const GlobalStates = createContext()

function App() {

  const [loading, set_loading] = useState(true)
  const [country_required, set_country_required] = useState(false)
  const [user_data, set_user_data] = useState()
  const [dashboard_users, set_dashboard_users] = useState()
  const [all_animes, setall_animes] = useState()
  const [notifications, setnotifications] = useState([])
  const [number_of_unseen_notifications, setnumber_of_unseen_notifications] = useState(0)
  const [game_started, setgame_started] = useState(null)
  const [info_message, set_info_message] = useState()
  const [darkmode, setdarkmode] = useState(true)
  const N_Game_Questions = 5

  const close_info_panel = () => {
    set_info_message()
  }

  const SelectStyles = {
    option: (provided) => ({
      ...provided,
      padding: 12,
    }),

    menuList: (base) => ({
      ...base,
      "::-webkit-scrollbar": {
        display: "none",
        width: "0px"
      }
    })

  }

  const { lastMessage } = useWebSocket(`ws://${domain}/ws/socket-server/`, {
    //Will attempt to reconnect on all close events, such as server shutting down
    onOpen: () => console.log('\n connection open \n\n'),
    shouldReconnect: () => true,
  })

  // listening for incoming realtime notifications 
  useEffect(() => {

    if (lastMessage !== null) {

      const new_data = JSON.parse(lastMessage.data)

      if (new_data.payload) {
        console.log(new_data.payload)
        setnotifications(prev_notifications => [new_data.payload, ...prev_notifications])
        setnumber_of_unseen_notifications(prev => prev + 1)
      }

    }
  }, [lastMessage, setnotifications])

  useEffect(() => {

    async function get_home_data() {
      const result = await async_http_request({ path: "gethomedata" })

      if (result === null) {
        set_info_message("network error")
        set_loading(null)
        return
      }

      set_user_data(result.user_data)
      set_country_required(result.user_data.country === null)
      set_dashboard_users(result.leaderboard)
      setnumber_of_unseen_notifications(result.notifications.filter(n => !n.seen).length)
      setnotifications(result.notifications)

      const formated_animes = []

      result.animes.map((anime) =>
        formated_animes.push({
          value: anime.id,
          label: anime.anime_name
        })
      )

      setall_animes(formated_animes)
      set_loading(false)
    }

    get_home_data()
  }, [])


  return (
    <GlobalStates.Provider value={{ SelectStyles, game_started, N_Game_Questions, setgame_started, set_user_data, set_info_message }}>
      <div className="App">

        {loading === false && <div className="loaded_app">
          <NavBar
            country_required={country_required}
            notifications_open={false}
            new_notifications={number_of_unseen_notifications}
            game_started={game_started}
            darkmode={darkmode}
            setdarkmode={setdarkmode}
          />

          {country_required && <CountryPanel set_country_required={set_country_required} />}

          <div className={country_required ? "components_container faded_background" : "components_container"} onClick={close_info_panel}>

            <Routes>
              <Route path="/" element={<Home dashboard_users={dashboard_users} user_data={user_data} />} />

              <Route path="/contribute" element={<Contribute all_animes_options={all_animes} />} />

              <Route path="/mycontributions" element={<UserContributions />} />

              <Route path="/game" element={<GameView />} />

              <Route path="/review" element={<QuestionsForReview />} />

              <Route path="/profile" element={<UserProfile user_data={user_data} />} />

              <Route path="/notifications" element={
                <Notifications all_notifications={notifications}
                  unseen_count={number_of_unseen_notifications}
                  setnumber_of_unseen_notifications={setnumber_of_unseen_notifications} />} />

              <Route path="/about" element={<About />} />
            </Routes>

          </div>

        </div>
        }

        {loading !== false && <div className="app_loading_div">
          <h1>Real Otakus</h1>
          <p> {loading === true ? "loading ..." : info_message} </p>
        </div>
        }

        <Footer />

      </div>
    </GlobalStates.Provider>

  )
}
export default App