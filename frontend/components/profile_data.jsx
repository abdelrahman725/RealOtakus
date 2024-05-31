import get_local_date from "@/components/utils/localdate";

export default function ProfileData({ profile_data }) {

    return (
        <>
            {profile_data ?
                <div className="user_data">
                    <div className="data_row">
                        <div>Username</div>
                        <div>{profile_data.username}</div>
                    </div>

                    <div className="data_row">
                        <div>Email</div>
                        <div>{profile_data.email}</div>
                    </div>

                    <div className="data_row">
                        <div>Country</div>
                        <div>
                            {profile_data.country ?
                                <img
                                    src={`https://flagcdn.com/256x192/${profile_data.country}.png`}
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
                        <div title="date you joined the platform">{get_local_date(profile_data.date_joined)}</div>
                    </div>
                    <hr />
                    <h3>Progress</h3>

                    <div className="data_row">
                        <div>Level</div>
                        <div> {profile_data.level}</div>
                    </div>

                    <div className="data_row">
                        <div>Score</div>
                        <div>{profile_data.score}</div>
                    </div>
                </div>
                :
                <div className="profile_data">loading</div>
            }
        </>
    )
}

