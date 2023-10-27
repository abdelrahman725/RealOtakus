"use client";

import Link from 'next/link'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { FaLock } from 'react-icons/fa'
import { useGlobalContext } from '@/contexts/GlobalContext';

export default function Footer() {

  const { QuizStarted } = useGlobalContext()

  if (QuizStarted) { return (null) }

  return (
    <footer>
      <a className="simple_link" href="https://github.com/abdelrahman725/RealOtakus" target="_blank" rel="noreferrer">
        Github
      </a>

      {/* <a className="simple_link" href="https://twitter.com/RealOtakus" target="_blank" rel="noreferrer">
        Twitter
      </a> */}

      <a className="simple_link" href="https://discord.gg/7EXaugpw" target="_blank" rel="noreferrer">
        Discord
      </a>

      <Link href="/terms" className="simple_link icon" target="_blank" shallow><HiOutlineDocumentText />Terms</Link>

      <Link href="/privacy" className="simple_link icon" target="_blank" shallow><FaLock />Privacy</Link>
    </footer>
  )
}
