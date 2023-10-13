import Otaku from '@/components/leaderboard_user';
import { useState, useEffect } from "react"
import { useGlobalContext } from '@/contexts/GlobalContext';
import { COUNTRIES } from "@/components/utils/constants";
import { BACKEND_API } from '@/components/utils/constants';
import ConsoleLog from '@/components/utils/custom_console';

export default function LeaderBoard() {

    const { User } = useGlobalContext()
    const [leaderboard, set_leaderboard] = useState()
    const [show_all, set_show_all] = useState(false)

    const fetch_leaderboard = async () => {
        try {
            const result = await fetch(`${BACKEND_API}/leaderboard/`, {
                headers: {
                    'Content-type': 'application/json',
                },
            })

            const leaderboard_data = await result.json()
            set_leaderboard(leaderboard_data)
        }
        catch (error) {
            ConsoleLog(error)
        }
    }

    useEffect(() => { fetch_leaderboard() }, [])

    return (
        <div className="leaderboard_container">
            {leaderboard ?
                leaderboard.length > 0 &&
                <div>
                    <h1>Top otakus</h1>
                    {/* <p>updated every 5 mins</p> */}
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
                :
                <p>loading</p>
            }
        </div>
    )
}

