"use client"

import Link from 'next/link';
import ReviewedConributions from '@/components/reviewed_contributions';
import PendingConributions from '@/components/pending_contributions';
import { useState, useEffect } from "react"
import { useAuthContext } from "@/contexts/GlobalContext";
import RequireAuthentication from '@/components/utils/requireauthentication';
import ReAuthorizedApiRequest from "@/components/utils/generic_request";

export default function Page() {

  const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
  const [contributions, set_contributions] = useState(null)
  const [animes, set_animes] = useState()
  const [filter, set_filter] = useState("pending")

  const fetch_contributions = async () => {

    const result = await ReAuthorizedApiRequest({ path: "review-contributions/" })

    if (result === null) {
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    if (result.status_code === 403) {
      set_contributions(false)
      return
    }

    set_animes(result.payload.animes)
    set_contributions(result.payload.contributions)
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
    IsAuthenticated && fetch_contributions()
  }, [IsAuthenticated])


  return (
    <RequireAuthentication>
      <div className="review centered">

        {contributions &&
          <div className="reviewer_container">

            <div className="dashboard_container">
              <h2>assigned animes</h2>
              <table className="dashboard centered">
                <thead>
                  <tr>
                    <th> anime</ th>
                    <th title="number of contributions that need review"> No. pending </th>
                    <th title="number of reviewed contributions"> No. reviewed </th>
                  </tr>
                </thead>
                <tbody>
                  {animes.map((anime, index) => (
                    <tr key={index}>
                      <td>{anime.name}</td>
                      {/* pending contributions */}
                      <td>
                        {contributions.filter(c => c.anime.id === anime.id && c.state === "pending").length}
                      </td>
                      {/* reviewed contributions */}
                      <td>
                        {contributions.filter(c => c.anime.id === anime.id && c.state !== "pending").length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filter === "pending" ?
              <PendingConributions
                contributions={contributions.filter(c => c.state === "pending")}
                set_contributions={set_contributions}
                set_animes={set_animes}
                set_filter={set_filter}
              />
              :
              <ReviewedConributions
                contributions={contributions.filter(c => c.state !== "pending")}
                set_filter={set_filter}
              />
            }
          </div>
        }

        {contributions === null && "loading"}

        {contributions === false &&
          <div>
            <h1>You are not a reviewer</h1>
            <Link href="/about#become-reviewer" target="_blank" shallow>How to become a reviewr</Link>
          </div>
        }

      </div>
    </RequireAuthentication>
  )
}
