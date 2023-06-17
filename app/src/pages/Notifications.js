import EachNotification from "./components/EachNotification"
import async_http_request from "./components/AsyncRequest"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Notifications = ({ notifications, set_new_notifications_count, new_notifications_count }) => {

  const [show_all_notifications, set_show_all_notifications] = useState(false)

  const notification_kind_to_path = {
    "R": "/review",
    "N": "/review",
    "A": "/mycontributions",
    "F": "/mycontributions"
  }

  const naviage_routes = useNavigate()

  const change_route = (kind, filtered_anime) => {
    if (kind === null)
      return

    if (kind === "R" || kind === "N") {
      naviage_routes(
        notification_kind_to_path[kind],
        { state: { value: filtered_anime, label: filtered_anime } }
      )
      return
    }

    if (kind === "A" || kind === "F") {
      naviage_routes(
        notification_kind_to_path[kind],
        { state: kind === "A" }
      )
      return
    }

    naviage_routes(notification_kind_to_path[kind])
  }

  const get_shown_notification = (notification_or_anime_name, kind) => {

    if (!kind) {
      return (
        <p>{notification_or_anime_name}</p>
      )
    }

    if (kind === "NA") {
      return (
        <p>
          <strong>{notification_or_anime_name}</strong> is now available in Quizes!
        </p>
      )
    }

    if (kind === "N") {
      return (
        <p>
          Congratulations! you are now a reviewer of <strong>{notification_or_anime_name}</strong>, please note that
          your own contributions for <strong>{notification_or_anime_name}</strong> still need to be reviewed by other reviewers
        </p>
      )
    }

    if (kind === "R") {
      return (
        <p>
          New contributed question for <strong>{notification_or_anime_name}</strong>
        </p>
      )
    }

    if (kind === "A") {
      return (
        <p>
          Congratulations ! your contribution for <strong>{notification_or_anime_name}</strong> is approved, +10 points
        </p>
      )
    }

    if (kind === "F") {
      return (
        <p>
          Sorry your last contribution for <strong>{notification_or_anime_name}</strong> is rejected
        </p>
      )
    }
  }

  useEffect(() => {

    // update notifications state in the server (which are seen by the user in the  UI) from unseen to seen   
    const update_notifications_state = async () => {
      const notifications_update_state_response = await async_http_request({
        path: "notifications/mark",
        method: "PUT",
        data: {
          "notifications": notifications.filter(n => n.seen === false && n.broad === false).map(n => n.id)
        }
      })

      notifications_update_state_response.status === 200 && set_new_notifications_count(0)
    }

    new_notifications_count > 0 && update_notifications_state()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="notifications">
      {notifications.length > 0 ?
        <div>
          {notifications.map((noti, index) => (
            (index < 10 ? true : show_all_notifications) &&
            <EachNotification
              key={index}
              time={noti.time}
              notification={noti.notification}
              kind={noti.kind}
              navigate={change_route}
              get_shown_notification={get_shown_notification}
            />
          ))}

          {notifications.length > 10 &&
            <p className="simple_link centered_div" onClick={() => set_show_all_notifications(!show_all_notifications)}>
              {!show_all_notifications ? "show all activity" : "show less"}
            </p>}
        </div>
        :
        <p className="centered_div">no activity</p>
      }
    </div>
  )
}

export default Notifications