import './App.css'

import Home from 'pages/Home'
import GameView from 'pages/GameView'
import Review from 'pages/Review'
import UserProfile from 'pages/Profile'
import UserContributions from 'pages/UserContributions'
import Contribute from 'pages/Contribute'
import Notifications from 'pages/Notifications'
import Terms from 'pages/Terms'
import Privacy from 'pages/Privacy'
import About from 'pages/About'
import Settings from 'pages/Settings'
import NoMatch from 'pages/NoMatch'

import Navbar from 'pages/components/NavBar'
import Footer from 'pages/components/Footer'
import AuthenticatedRoute from 'pages/components/AuthenticatedRoute'
import async_http_request from 'pages/components/AsyncRequest'

import React, { useState, useEffect, createContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import { get_domain } from 'Constants'

export const GlobalStates = createContext()

function App() {
  const [authenticated, set_authenticated] = useState(null)
  const [user_data, set_user_data] = useState()
  const [leaderboard, set_leaderboard] = useState()
  const [all_animes, setall_animes] = useState()
  const [notifications, setnotifications] = useState([])
  const [new_notifications_count, set_new_notifications_count] = useState(0)
  const [game_started, setgame_started] = useState(null)
  const [loading_or_network_error_msg, set_loading_or_network_error_msg] = useState("RealOtakus is loading...")
  const [darkmode, setdarkmode] = useState(true)

  const { lastMessage } = useWebSocket(`ws://${get_domain()}/ws/socket-server/`, {
    //Will attempt to reconnect on all close events, such as server shutting down
    onOpen: () => console.log('\n connection open \n\n'),
    shouldReconnect: () => authenticated === true ? true : false
  },
    false
  )

  // not used yet as connect argument in useWebsocket is false
  // listening for incoming realtime notifications 
  useEffect(() => {
    if (lastMessage !== null) {

      const new_data = JSON.parse(lastMessage.data)

      if (new_data.payload) {
        console.log(new_data.payload)
        setnotifications(prev_notifications => [new_data.payload, ...prev_notifications])
        set_new_notifications_count(prev => prev + 1)
      }
    }
  }, [lastMessage, setnotifications])


  const log_user_out = async () => {

    if (authenticated !== true) {
      return
    }

    const logging_out = await async_http_request({ path: "logout/", method: "DELETE" })

    if (logging_out.status === 200) {
      set_authenticated(false)
    }

    return <Navigate to="/" replace />
  }

  const fetch_client_country_via_api_then_save = async () => {

    const result = await async_http_request({ server: "https://ipapi.co/json/" })

    if (result !== null && result.status === 200) {

      const fetched_country = result.payload.country.toLowerCase()

      set_user_data(prev => ({
        ...prev,
        country: fetched_country
      }))

      // after fetching the user country successfully, now we save it to the db so we don't have to query it again
      async_http_request({
        path: "post_country",
        method: "POST",
        data: { "country": fetched_country }
      })
    }
  }

  const set_fetched_user_data_and_authenticate = (payload) => {
    payload.user_data.country === null && fetch_client_country_via_api_then_save()
    set_user_data(payload.user_data)
    set_new_notifications_count(payload.notifications.filter(n => n.seen === false && n.broad === false).length)
    setnotifications(payload.notifications)
    set_authenticated(true)
  }


  useEffect(() => {

    // also used to check (against the server) whether the user is authenticated or not
    const fetch_home_data = async () => {

      const result = await async_http_request({ path: "main" })

      if (result === null) {
        set_loading_or_network_error_msg("network error")
        return
      }

      if (result.payload.is_authenticated === "true") {
        set_fetched_user_data_and_authenticate(result.payload)
      }

      if (result.payload.is_authenticated === "false") {
        set_authenticated(false)
      }

      setall_animes(
        result.payload.animes.map(anime => ({
          value: anime.id,
          label: anime.anime_name
        }))
      )
      set_leaderboard(result.payload.leaderboard)
    }
    fetch_home_data()
    // eslint-disable-next-line
  }, [])

  return (
    <GlobalStates.Provider
      value={{
        authenticated,
        game_started,
        set_authenticated,
        set_fetched_user_data_and_authenticate,
        set_user_data,
        setgame_started
      }}>

      <div className="App">

        {authenticated === null ? <div className="app_loading_div">{loading_or_network_error_msg}</div>
          :
          <Routes>

            <Route path="/*"
              element={
                <>
                  <Navbar
                    authenticated={authenticated}
                    new_notifications_count={new_notifications_count}
                    game_started={game_started}
                    darkmode={darkmode}
                    setdarkmode={setdarkmode}
                  />

                  <Routes>

                    <Route path="/"
                      element={
                        <Home user_data={user_data} leaderboard={leaderboard} />
                      }
                    />

                    <Route path="/contribute"
                      element={
                        <AuthenticatedRoute>
                          <Contribute all_animes_options={all_animes} />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/mycontributions"
                      element={
                        <AuthenticatedRoute>
                          <UserContributions />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/game"
                      element={
                        <AuthenticatedRoute>
                          <GameView />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/review"
                      element={
                        <AuthenticatedRoute>
                          <Review />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/profile"
                      element={
                        <AuthenticatedRoute>
                          <UserProfile user_data={user_data} />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/notifications"
                      element={
                        <AuthenticatedRoute>
                          <Notifications
                            notifications={notifications}
                            new_notifications_count={new_notifications_count}
                            set_new_notifications_count={set_new_notifications_count}
                          />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/settings"
                      element={
                        <AuthenticatedRoute>
                          <Settings log_user_out={log_user_out} />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path="/about" element={<About />} />

                    <Route path="*" element={<NoMatch />} />

                  </Routes>

                  <Footer />

                </>
              }
            />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

          </Routes>
        }

      </div>
    </GlobalStates.Provider>

  )
}
export default App