import { SlSocialTwitter } from 'react-icons/sl'
import { BsGithub } from 'react-icons/bs'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const About = () => {

  const { pathname, hash, key } = useLocation()

  useEffect(() => {

    // scroll to the required section by id
    if (hash !== '') {
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 0)
    }

  }, [pathname, hash, key])

  return (
    <div className="about">

      <p className="love">created with love by Bedo</p>

      <div>
        <h2>About</h2>
        <p>
          Real Otaku is the platform for only anime enthusiasts and fans, founded in 2023,
          it's about contributing anime questions and participate in games
          where you answer questions contributed by others,
          one can also be a reviewr of the incoming contributions
          if he/she is eligible.
        </p>
      </div>

      <div id="contribution-guidelines">
        <h2>Contribution Guidelines</h2>
        <p>
          As we always prefer quality questions over quantity
          we have some rules and constraints when it comes to questions shown in tests,
          always keep in mind that the goal of quizes is not
          to test whether the person has watched the entire anime
          or if he remembers everything happend but to test whether the person
          truly understood the events, the characters, their development throughout the series, their personalities and goals,
          the plot twists ..etc.
        </p>

        <p>
          So in order to make sure that your contributed question
          gets approved make sure to follow the following rules :
        </p>

        <ul>
          <li><strong>getting a question from google is the fastest way for your contribution to be rejected !</strong></li>
          <li>You are allowed to make a maximum of <strong>10</strong> contributions every <strong>24</strong> hours.</li>

          <li>avoid trivial/too easy questions.</li>
          <li>your question should not depend only on memorizing things like (Dates, Characters names, Places).</li>
          <li>try to avoid questions that are based on your personal opinion or theory. </li>
          <li>make sure to make 4 distinguishable choices.</li >
          <li>the 3 wrong choices must not have any common pattern,
            in other words, the right choice shouldn't be too obvious at first glance,
            so the question experience is more interesting and challenging.
          </li>
          <li>your question must be only relevant to anime and doesn't contain any racist, sexual, political, religious or hate speech content.</li>
          <li>your question must be in a valid english format. </li>
        </ul>

        <p>Some (not limited to) recommended ideas for questions :</p>
        <ul>
          <li>What is the motivation behind Character X actions, what was the impact of his actions on character Y ? </li>
          <li>Did Character X reach his goals? (when or how )</li>
          <li>What would happen if .. ?</li>
        </ul>

        <h3>examples </h3>

        <h4>Trivial/bad questions &#128577;</h4>
        <ul>
          <li>(Attack on Titans) What was the name of Eren's mother ?</li>
          <li>(Dragon Ball) What species of fighters does Goku belong to ?</li>
        </ul>

        <h4>Good questions &#128512;</h4>

        <ul>
          <li>(One Piece) Why most people don't know about wano ?</li>
          <li>(Attack on Titans) In season 4, During detention of zeke yeager by Levi, why did Levi specifically choose a place like the forest ?</li>
        </ul>

      </div>

      <div>
        <h2>How we handle Contributions</h2>
        <p>
          Contributed questions get validated and reviewed (by reviewers or RealOtakus team) based on the above Guidelines.
        </p>
        <p>
          Please note that Realotakus has the right to modify or delete (if inappropriate) any contributed question before or after being reviewed.
        </p>
      </div>

      <div id="become-reviewer">
        <h2>How to become a reviewer</h2>
        <p>
          to be determined
        </p>
      </div>

      {/* <div>
        <h2>Buy us a cup of Coffee </h2>
        <a href="/" target="_blank" rel="noreferrer">
          <FaDonate className="icon" />
        </a>
      </div> */}

      <div>
        <h2>Stay in touch</h2>

        <div className="community_links">
          <a href="https://github.com/abdelrahman725/RealOtakus" target="_blank" rel="noreferrer">
            <BsGithub className="icon" /> <span>Github</span>
          </a>

          <a href="https://twitter.com/RealOtakus" target="_blank" rel="noreferrer">
            <SlSocialTwitter className="icon" /> <span>Twitter</span>
          </a>
        </div>

      </div>
    </div>
  )
}

export default About