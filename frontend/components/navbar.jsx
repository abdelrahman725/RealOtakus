"use client"

import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai'
import { FaInfo } from 'react-icons/fa'
import { useAuthContext, useGlobalContext } from '@/contexts/GlobalContext';
import Link from "next/link"

export default function Navbar() {

  const { QuizStarted } = useGlobalContext()
  const { IsAuthenticated } = useAuthContext()

  if (QuizStarted) { return (null) }

  return (
    <div className="navbar">
      <div>
        <div className="logo_container" title="Home">
          <Link href="/" className="logo" shallow>
            <strong>Real Otakus</strong>
          </Link>
        </div>

        <div title="about">
          <Link href="/about" shallow>
            <FaInfo className="nav_icon" />
          </Link>
        </div>
      </div>

      {IsAuthenticated &&
        <div>
          <div className="nav_icon_container" title="activity">
            <Link href="/notifications" shallow >
              <IoMdNotifications className="nav_icon" />
            </Link>
          </div>

          <div className="nav_icon_container" title="your profile">
            <Link href="/profile" shallow>
              <BsPersonFill className="nav_icon" />
            </Link>
          </div>

          <div className="nav_icon_container" title="settings">
            <Link href="/settings" shallow >
              <AiFillSetting className="nav_icon" />
            </Link>
          </div>
        </div>
      }
    </div>
  )
}
