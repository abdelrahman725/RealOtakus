import './App.css'

import AuthenticatedRoute from 'pages/AuthenticatedRoute'
import NotAuthenticated from 'pages/NotAuthenticated'
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

import CountryPanel from 'pages/components/SelectCountryPanel'
import TheDashBoard from 'pages/components/TheDashBoard'
import getCookie from 'pages/components/getCookie'
import Navbar from 'pages/components/NavBar'
import Footer from 'pages/components/Footer'
import async_http_request from 'pages/components/AsyncRequest'

import React, { useState, useEffect, createContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import { OUR_DOMAIN } from 'Constants'

export const GlobalStates = createContext()

function App() {
  const [authenticated, set_authenticated] = useState(null)
  const [country_required, set_country_required] = useState(false)
  const [user_data, set_user_data] = useState()
  const [dashboard_users, set_dashboard_users] = useState()
  const [all_animes, setall_animes] = useState()
  const [notifications, setnotifications] = useState([])
  const [number_of_unseen_notifications, setnumber_of_unseen_notifications] = useState(0)
  const [game_started, setgame_started] = useState(null)
  const [info_message, set_info_message] = useState("loading")
  const [darkmode, setdarkmode] = useState(true)

  // const { lastMessage } = useWebSocket(`ws://${OUR_DOMAIN}/ws/socket-server/`, {
  //   //Will attempt to reconnect on all close events, such as server shutting down
  //   onOpen: () => console.log('\n connection open \n\n'),
  //   shouldReconnect: () => true,
  // })

  //listening for incoming realtime notifications 
  // useEffect(() => {

  //   if (lastMessage !== null) {

  //     const new_data = JSON.parse(lastMessage.data)

  //     if (new_data.payload) {
  //       console.log(new_data.payload)
  //       setnotifications(prev_notifications => [new_data.payload, ...prev_notifications])
  //       setnumber_of_unseen_notifications(prev => prev + 1)
  //     }

  //   }
  // }, [lastMessage, setnotifications])

  const log_user_out = async () => {

    if (authenticated !== true) {
      return
    }

    const logging_out = await async_http_request({ path: "logout/", method: "DELETE" })

    console.log(logging_out)

    if (logging_out.status === 200) {
      set_authenticated(false)
    }

  }

  const fetch_csrf_token = async () => {
    const token_response = await async_http_request({ path: "get_csrf/" })
    console.log(token_response)
  }

  // also used to check (against the server) whether the user is authenticated or not
  const fetch_unauthenticated_data = async () => {
    const result = await async_http_request({ path: "main" })
    if (result === null) {
      set_info_message("network error")
      return
    }

    console.log(result.payload)

    if (result.payload.is_authenticated === "true") {
      fetch_authenticated_user_data()
    }

    if (result.payload.is_authenticated === "false") {
      set_authenticated(false)
    }

    set_dashboard_users(result.payload.leaderboard)

    setall_animes(
      result.payload.animes.map(anime => ({
        value: anime.id,
        label: anime.anime_name
      }))
    )

  }

  const fetch_authenticated_user_data = async () => {
    const result = await async_http_request({ path: "get_user_data" })

    if (result === null) {
      set_info_message("network error")
      return
    }

    console.log(result.payload)

    set_user_data(result.payload.user_data)
    set_country_required(result.payload.user_data.country === null)
    setnumber_of_unseen_notifications(result.payload.notifications.filter(n => !n.seen).length)
    setnotifications(result.payload.notifications)
    set_authenticated(true)
  }

  useEffect(() => {
    if (getCookie('csrftoken') === null) {
      fetch_csrf_token()
    }

    fetch_unauthenticated_data()

  }, [])

  return (
    <GlobalStates.Provider
      value={{
        authenticated,
        game_started,
        fetch_authenticated_user_data,
        setgame_started,
        set_user_data
      }}>

      <div className="App">

        <Navbar
          authenticated={authenticated}
          country_required={country_required}
          notifications_open={false}
          new_notifications={number_of_unseen_notifications}
          game_started={game_started}
          darkmode={darkmode}
          log_user_out={log_user_out}
          setdarkmode={setdarkmode}
        />

        {country_required && <CountryPanel set_country_required={set_country_required} />}

        {authenticated === null ?
          <div className="app_loading_div">{info_message}</div>
          :
          <Routes>

            <Route exact path="/" element={<Home user_data={user_data} dashboard_users={dashboard_users} />} />

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
                    all_notifications={notifications}
                    unseen_count={number_of_unseen_notifications}
                    setnumber_of_unseen_notifications={setnumber_of_unseen_notifications}
                  />
                </AuthenticatedRoute>
              }
            />

            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

          </Routes>
        }

        <Footer />

      </div>
    </GlobalStates.Provider>

  )
}
export default App