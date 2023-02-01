import { SlSocialTwitter } from 'react-icons/sl'
import { BsGithub } from 'react-icons/bs'
import React from 'react'

const About = () => {
  return (
    <div className="about">
      <div>
      <h2>About</h2>
        <p>
          Real Otaku is a platform for anime enthusiasts and fans founded by <strong>my name</strong>  in 2023,
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
          truly understood the events, the characters, their development throughout the anime, their personalities and goals,
          the plot twists ..etc. <br />
          So Questions like
          <strong> Why did Character X do that, what was the impact of his actions on character Y ? </strong>
          ,&nbsp;
          <strong> Did Character X reach his goals, if yes, how ? if no, why ?  </strong>
          are good examples as they require a good understanding of character X.<br /><br />

          So in order to make sure that your contributed question
          gets approved make sure to follow the following rules :
        </p>

        <ul>
          <li>avoid trivial/too easy questions.</li>
          <li>your question should not depends only on memorizing things like (dates, characters names, places).</li>
          <li>try to avoid questions that are based on your personal opinion or theory. </li>
          <li>make sure to make 4 distinguishable choices.</li >
          <li>the 3 wrong choices must not have any common pattern,
            in other words, the right choice shouldn't be too obvious at first glance,
            so the question experience is more interesting and challenging.
          </li>
          <li>your question must be only relevant to anime and doesn't contain any racist, sexual, political, religious or hate speech content.</li>
          <li>your question must be in a valid english format. </li>
        </ul>

        <h3>Trivial/bad questions &#128577;</h3>
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
        <h2>Review Guidelines</h2>
        <p>
          to do ...
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