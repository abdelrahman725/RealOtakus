import EachNotification from "./Components/EachNotification"
import async_http_request from "./Components/AsyncRequest"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Notifications = ({ all_notifications, unseen_count, setnumber_of_unseen_notifications }) => {

  const notification_kind_to_path = {
    "R": "/review",
    "N": "/review",
    "A": "/mycontributions",
    "F": "/mycontributions",
  }

  const naviage_routes = useNavigate()

  const change_route = (kind, filtered_anime) => {
    if (kind === null)
      return

    if (kind === "R") {
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

    if (kind === "N") {
      return (
        <p>
          Congratulations! Now you are a reviewer of <strong>{notification_or_anime_name}</strong> contributions, please note that
          your own contributions for <strong>{notification_or_anime_name}</strong> still need to be reviewed by other reviewer
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
          Congratulations ! your contribution for <strong>{notification_or_anime_name}</strong> is approved
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

    if (unseen_count <= 0)
      return

    // clears unseen_notifcations count when user sees them
    setnumber_of_unseen_notifications(0)

    //update notifications state in the server (which are seen by the user in the  UI) from unseen to seen   
    const unseen_notifications = []

    all_notifications.forEach((n) =>
      !n.seen && unseen_notifications.push(n.id)
    )

    const update_notifications_state = async () => {

      const notifications_update_state_response = await async_http_request({
        path: "update_notifications",
        method: "PUT",
        data: {
          "notifications": unseen_notifications
        }
      })

      console.log(notifications_update_state_response)
    }

    update_notifications_state()

  }, [all_notifications])

  return (
    <div className="notifications">
      {all_notifications.length > 0 ? all_notifications.map((noti, index) => (
        <EachNotification
          key={index}
          time={noti.time}
          notification={noti.notification}
          kind={noti.kind}
          navigate={change_route}
          get_shown_notification={get_shown_notification}
        />
      )) :
        <p>no activity</p>
      }
    </div>
  )
}

export default Notifications