"use client";

import Otaku from '@/components/leaderboard_user';
import { COUNTRIES } from "@/components/utils/constants";
import RequireAuthentication from "@/components/utils/requireauthentication";
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import { useAuthContext, useGlobalContext } from "@/contexts/GlobalContext";
import { useState, useEffect } from "react"

export default function Page() {

    const { User } = useGlobalContext()
    const [leaderboard, set_leaderboard] = useState()
    const [show_all, set_show_all] = useState(false)
    const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()

    const fetch_leaderboard = async () => {

        const result = await ReAuthorizedApiRequest({ path: "leaderboard/" })

        if (result === null) {
            return
        }

        if (result.status_code === 401) {
            SetIsAuthenticated(false)
            return
        }

        set_leaderboard(result.payload)
    }

    useEffect(() => { IsAuthenticated && fetch_leaderboard() }, [IsAuthenticated])

    return (
        <RequireAuthentication>
            <div className='centered'>
                {leaderboard ?
                    leaderboard.length > 0 ?
                        <div>
                            <h1>Top otakus</h1>
                            <div className="dashboard_container">
                                <table className="dashboard leaderboard centered">
                                    <thead>
                                        <tr>
                                            <th title="user rank">#</th>
                                            <th> Otaku </th>
                                            <th title="score gained from quizes and approved contributions"> Score </th>
                                            <th> Level </th>
                                            <th title="No. approved contributions"> Contributions </th>
                                            <th> Country </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((competitor, index) => {
                                            if (index < 10 ? true : show_all) {
                                                return <Otaku
                                                    key={index}
                                                    index={index}
                                                    competitor={competitor}
                                                    current_user={User && User.id === competitor.id}
                                                    country_name={COUNTRIES[competitor.country]}
                                                />
                                            }
                                        })}

                                    </tbody>
                                </table>
                                {leaderboard.length > 10 && <p className="simple_link" onClick={() => set_show_all(!show_all)}>{!set_show_all ? "show all Leaderboard" : "show less"}</p>}

                            </div>
                        </div>
                        : <p>no top users yet</p>
                    :
                    <div>loading</div>
                }

            </div>
        </RequireAuthentication>
    )
}
