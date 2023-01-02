import { FaDonate } from 'react-icons/fa'
import { SlSocialTwitter } from 'react-icons/sl'
import { BsGithub } from 'react-icons/bs'
import React from 'react'

const About = () => {
  return (
    <div className="centered_div about">
      <div>
        <h2>About</h2>
        <p>
          Real Otaku is a platform for anime enthusiasts and fans founded in 2023 by <strong>my name</strong>,
          it's about contributing anime questions and participate in games
          where you answer questions contributed by others,
          one can also be a reviewr of the incoming contributions
          if he/she is eligible.
        </p>
      </div>

      <div>
        <h2>Contribution Guidelines</h2>
        <p>
          As we always prefer quality questions over quantity
          we have some rules and constraints when it comes to questions shown in tests,
          always keep in mind that the goal of questions is not
          to test whether the person has watched the entire anime
          or if he remembers everything happend but to test whether the person
          truly understood the events, the characters, their developemnt throughout the anime, their personalities and goals,
          the plot twists ..etc. <br />

          A question like <strong> Do you think character X would kill character Y if he has the chance ? </strong>
          is a really good example as it requires the person to have a good understanding of character X.<br /><br />

          So in order to make sure that your contributed question
          gets approved make sure to follow the following rules :
        </p>

        <ul>
          <li>avoid trivia/too easy questions.</li>
          <li>your question should not be solely depend on memorizing things like (dates, characters names, places).</li>
          <li>try to avoid questions that are based on your personal opinion or theory. </li>
          <li>make sure to make 4 distinguishable choices.</li >
          <li>the 3 wrong choices must not have any common pattern,
            in other words, the right choice shouldn't be too obvious at first glance,
            so the question experience is more interesting and challenging.
          </li>
          <li>your question must be in a valid english format (e.g. not a gibberish text) otherwise you will immediately get banned from the platform. </li>
        </ul>

        <h3>Trivia/bad questions &#128577;</h3>
        <ul>
          <li>(Attack on Titans) What was the name of Eren's mother ?</li>
          <li>(Dragon Ball) What species of fighters does Goku belong to ?</li>
        </ul>

        <h3>Good questions &#128512;</h3>

        <ul>
          <li>(One Piece) Why most people don't know about wano ?</li>
          <li>(Attack on Titans) In season 4, During detention of zeke yeager by Levi, why did Levi specifically choose a place like the forest ?</li>
        </ul>

      </div>

      <div>
        <h2>How to become a reviewer</h2>
        <p>
          to do ...
        </p>
      </div>

      <div>
        <h2>Buy us a cup of Coffee </h2>
        <a href="https://www.buymeacoffee.com" target="_blank" rel="noreferrer">
          <FaDonate className="icon" />
        </a>
      </div>

      <div>
        <h2>Stay in touch</h2>

        <div className="community_links">

          <a href="https://github.com/abdelrahman725/RealOtakus" target="_blank" rel="noreferrer">
            <BsGithub className="icon" /> <span>Github</span>
          </a>

          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <SlSocialTwitter className="icon" /> <span>Twitter</span>
          </a>
        </div>

      </div>
    </div>
  )
}

export default About