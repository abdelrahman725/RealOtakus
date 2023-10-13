import get_local_date from "@/components/utils/localdate";

export default function ProfileData({ user_data }) {

    return (
        <>
            {user_data ?
                <div className="user_data">
                    <div className="data_row">
                        <div>Username</div>
                        <div>{user_data.user.username}</div>
                    </div>

                    <div className="data_row">
                        <div>Email</div>
                        <div>{user_data.user.email}</div>
                    </div>

                    <div className="data_row">
                        <div>Country</div>
                        <div>
                            {user_data.country ?
                                <img
                                    src={`https://flagcdn.com/256x192/${user_data.country}.png`}
                                    width={30}
                                    height={20}
                                    alt="country flag"
                                    title="your country"
                                />
                                : "N/A"
                            }
                        </div>
                    </div>
                    <div className="data_row">
                        <div>Otaku since </div>
                        <div title="date you joined the platform">{get_local_date(user_data.user.date_joined)}</div>
                    </div>
                    <hr />
                    <h3>Progress</h3>

                    <div className="data_row">
                        <div>Level</div>
                        <div> {user_data.level}</div>
                    </div>

                    <div className="data_row">
                        <div>Score</div>
                        <div>{user_data.points}</div>
                    </div>

                    <div className="data_row">
                        <div>Quizes Started</div>
                        <div>{user_data.tests_started}</div>
                    </div>

                    <div className="data_row">
                        <div>Quizes Completed</div>
                        <div>{user_data.tests_completed}</div>
                    </div>
                </div>
                :
                <div className="user_data">loading</div>
            }
        </>
    )
}

