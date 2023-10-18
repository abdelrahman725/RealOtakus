
"use client";

import Notification from "@/components/notification"
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { useAuthContext } from "@/contexts/GlobalContext";
import RequireAuthentication from "@/components/utils/requireauthentication";

export default function Page() {
    const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
    const [notifications, set_notifications] = useState(null)
    const [show_all, set_show_all] = useState(false)
    const router = useRouter()

    const notification_to_path = {
        "R": "/review",
        "N": "/review",
        "A": "/my-contributions?filter=approved",
        "A1": "/my-contributions?filter=approved",
        "F": "/my-contributions?filter=rejected"
    }

    const change_route = (type) => {
        if (type === null)
            return

        router.push(notification_to_path[type])
    }

    const fetch_notifications = async () => {
        const result = await ReAuthorizedApiRequest({ path: "notifications/get/" })

        if (result === null) {
            return
        }

        if (result.status_code === 401) {
            SetIsAuthenticated(false)
            return
        }

        set_notifications(result.payload)
    }

    useEffect(() => {
        IsAuthenticated && fetch_notifications()
    }, [IsAuthenticated])

    return (

        <RequireAuthentication>
            <div className="notifications">
                {notifications ?
                    notifications.length > 0 ?
                        <div>
                            {notifications.map((each_noti, index) => {
                                if (index < 10 ? true : show_all) {
                                    return <Notification key={index} notification_data={each_noti} navigate={change_route} />
                                }
                            })}
                            {notifications.length > 10 &&
                                <p onClick={() => set_show_all(!show_all)}>
                                    <span className="show" >
                                        {!show_all ? "show all activity" : "show less"}
                                    </span>
                                </p>
                            }
                        </div>
                        : <p>no activity yet</p>
                    : <p>loading</p>
                }
            </div>
        </RequireAuthentication>

    )
}
