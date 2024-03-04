"use client";

import Link from "next/link";
import { useAuthContext } from "@/contexts/GlobalContext";
import { FcIdea, FcDatabase } from 'react-icons/fc'

import { MdQuiz, MdOutlineRateReview, MdLeaderboard } from 'react-icons/md'
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function Page() {
  const { IsAuthenticated } = useAuthContext()
  const { IsReviewer } = useGlobalContext()

  return (
    <div className="home centered">

      {IsAuthenticated === false &&
        <div>
          <h1>Welcome to our Otakus Hub 😃</h1>
          <div className="intro">
            <div className="description">
              <h3 className="title_color">As an Otaku here you can: </h3>
              <p>Test your knowledge by taking mind blowing quizes in your favorite animes.</p>
              <p>Create an anime question of your own, so it can appear in others quizes.</p>
              <p>Become a reviewr by reviewing other users contributed questions.</p>
            </div>
            <div className="auth_links_container">
              <Link href="/auth/login" className="nav_link" shallow>Login</Link>
              <Link href="/auth/register" className="nav_link" shallow>create account</Link>
            </div>
          </div>
        </div>
      }

      {IsAuthenticated &&
        <div className="navigation_links">
          <Link href="/contribute" className="nav_link" shallow>
            <FcIdea className="icon" />Contribute
          </Link>

          <Link href="/quiz" className="nav_link" shallow>
            <MdQuiz className="icon" />Take Quiz
          </Link>

          <Link href="/my-contributions" className="nav_link" shallow>
            <FcDatabase className="icon" /> My Contributions
          </Link>

          {IsReviewer &&
            <Link href="/review" className="nav_link" shallow>
              <MdOutlineRateReview className="icon" /> Review
            </Link>
          }

          <Link href="/leaderboard" className="nav_link" shallow>
            <MdLeaderboard className="icon" />Leaderboard
          </Link>
        </div>
      }
    </div>
  )
}
