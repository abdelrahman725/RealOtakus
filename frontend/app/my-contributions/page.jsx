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
    const [filtered_contributions, set_filtered_contributions] = useState()
    const router = useRouter()
    const pathname = usePathname()
    const search_params = useSearchParams()
    const filter = search_params.get("filter")

    const set_url_filter = (filter) => {
        router.replace(filter === null ? pathname : pathname + `?filter=${filter}`)
    }

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

    useEffect(() => {
        if (contributions) {
            set_filtered_contributions(
                contributions.filter(
                    c => filter === null ? true : contribution_states[c.approved] === filter
                )
            )
        }

    }, [filter, contributions])


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
                                <button className={`all ${filter === null && "darker_background"}`}
                                    onClick={() => set_url_filter(null)}>
                                    All
                                </button>

                                <button className={`pending ${filter === "pending" && "darker_background"}`}
                                    onClick={() => set_url_filter("pending")}>
                                    pending
                                </button>

                                <button className={`approved ${filter === "approved" && "darker_background"}`}
                                    onClick={() => set_url_filter("approved")}>
                                    approved
                                </button>

                                <button className={`rejected ${filter === "rejected" && "darker_background"}`}
                                    onClick={() => set_url_filter("rejected")}>
                                    rejected
                                </button>
                            </div>

                            {filtered_contributions &&
                                <h2>{filtered_contributions.length} {filter || "total"} Contributions</h2>
                            }

                            <div className="questions_container">
                                {filtered_contributions && filtered_contributions.map((contribution, index) => (
                                    <ContributedQuestion key={index} contribution={contribution} feedback_value_to_label={feedback_value_to_label} />
                                ))}
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
