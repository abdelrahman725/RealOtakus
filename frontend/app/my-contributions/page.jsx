"use client";

import ContributedQuestion from "@/components/contribution";
import RequireAuthentication from "@/components/utils/requireauthentication";
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import { useAuthContext } from "@/contexts/GlobalContext";
import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Page() {

    const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
    const [contributions, setcontributions] = useState()
    const router = useRouter()
    const pathname = usePathname()
    const search_params = useSearchParams()
    const filter = search_params.get("filter")

    const contribution_states = {
        true: "approved",
        false: "rejected",
        null: "pending",
    }

    const feedback_value_to_label = {
        "irr": "not relevant",
        "eas": "too easy",
        "bad": "bad choices",
        "inv": "invalid/wrong information"
    }

    const set_url_filter = (filter) => {
        router.replace(filter === null ? pathname : pathname + `?filter=${filter}`)
    }

    const get_button_class = (btn) => {
        return `${btn} ` + (filter === btn ? "darker_background" : "")
    }


    const fetch_contributions = async () => {
        const result = await ReAuthorizedApiRequest({ path: "contributions/" })

        if (result === null) {
            return
        }

        if (result.status_code === 401) {
            SetIsAuthenticated(false)
            return
        }
        setcontributions(result.payload)
    }

    useEffect(() => { IsAuthenticated && fetch_contributions() }, [IsAuthenticated])

    return (
        <RequireAuthentication>
            <div className="my-contributions centered">
                {contributions ?
                    contributions.length > 0 ?
                        <div>
                            <div className="contributions_filter_buttons">
                                <button className={get_button_class("all")}
                                    onClick={() => set_url_filter(null)}>
                                    All
                                </button>

                                <button className={get_button_class("pending")}
                                    onClick={() => set_url_filter("pending")}>
                                    pending
                                </button>

                                <button className={get_button_class("approved")}
                                    onClick={() => set_url_filter("approved")}>
                                    approved
                                </button>

                                <button className={get_button_class("rejected")}
                                    onClick={() => set_url_filter("rejected")}>
                                    rejected
                                </button>
                            </div>


                            <h2>
                                {contributions.filter(c => filter === null ? true : contribution_states[c.approved] === filter).length}
                                &nbsp;
                                {filter || "total"} Contributions
                            </h2>

                            <div className="questions_container">
                                {contributions.map((contribution, index) => {
                                    if (filter === null || contribution_states[contribution.approved] === filter) {
                                        return <ContributedQuestion key={index} contribution={contribution} feedback_value_to_label={feedback_value_to_label} />
                                    }
                                })}
                            </div>

                        </div>
                        :
                        <div>no contributions yet</div>
                    :
                    "loading"
                }

            </div>
        </RequireAuthentication>
    )
}
