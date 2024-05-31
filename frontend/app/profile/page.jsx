"use client";

import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import RequireAuthentication from "@/components/utils/requireauthentication";
import Interactions from "@/components/interactions";
import ProfileData from "@/components/profile_data";
import FetchCountry from "@/components/utils/fetch_country";
import { useEffect, useState } from "react";
import { useAuthContext } from '@/contexts/GlobalContext';

export default function Page() {
  const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
  const [quiz_score_percentage, setquiz_score_percentage] = useState()
  const [interactions, set_interactions] = useState()
  const [profile, set_profile] = useState()

  const sort_then_set_interactions = (interactions_payload) => {

    const interactions_dict = {}
    let n_correct_answers = 0

    interactions_payload.forEach((interaction) => {
      if (interaction.anime.name in interactions_dict === false) {
        interactions_dict[interaction.anime.name] = { "correct": 0, "wrong": 0 }
      }

      if (interaction.correct_answer) {
        interactions_dict[interaction.anime.name].correct += 1
        n_correct_answers += 1
      }

      else {
        interactions_dict[interaction.anime.name].wrong += 1
      }
    })

    const sorted_interactions = Object.entries(interactions_dict).sort((a, b) => b[1]["correct"] - a[1]["correct"])

    set_interactions(sorted_interactions)
    setquiz_score_percentage(Math.round((n_correct_answers / interactions_payload.length) * 100))
  }

  const fetch_profile = async () => {
    const result = await ReAuthorizedApiRequest({ path: "profile/" })

    if (result === null) {
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    if (result.payload.profile.country === null) {
      FetchCountry()
    }

    sort_then_set_interactions(result.payload.interactions)
    set_profile(result.payload.profile)
  }

  useEffect(() => { IsAuthenticated && fetch_profile() }, [IsAuthenticated])

  return (
    <RequireAuthentication>
      <div className="profile">
        <ProfileData profile_data={profile} />
        <Interactions profile_data={profile} interactions={interactions} quiz_score_percentage={quiz_score_percentage}
        />
      </div>
    </RequireAuthentication >
  )
}
