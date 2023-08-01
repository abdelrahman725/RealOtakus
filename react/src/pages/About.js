import React, { useEffect } from 'react'
import { SlSocialTwitter } from 'react-icons/sl'
import { BsGithub, BsFillQuestionCircleFill } from 'react-icons/bs'
import { SiGmail } from 'react-icons/si'
import { useLocation, Link } from 'react-router-dom'

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

      <p className="love">created with love and enthusiasm by Bedo</p>

      <div>
        <h2>About</h2>
        <p>
          Real Otaku is the platform for anime enthusiasts and fans, founded in 2023,
          it's about contributing anime questions and participate in games
          where users answer mindblowing questions contributed by others !
          one can also be a reviewr of the incoming contributions
          if he/she is eligible.
        </p>
      </div>

      <div id="contribution-guidelines">
        <h2>Contribution Guidelines</h2>
        <p>
          As we always prefer quality questions over quantity
          we have some rules and constraints when it comes to questions shown in tests,
          always keep in mind that the goal of the question is not
          to test whether the person has watched the entire anime
          or if he remembers everything occurred, but rather to test whether the person
          truly understood the events, the characters, their development throughout the story, their personalities and goals,
          the plot twists ..etc.
        </p>

        <p>
          So to make sure that your contributed question
          gets approved make sure to follow the following rules :
        </p>

        <ul>
          <li>Avoid trivial/too-easy questions.</li>
          <li>AI generated questions are not recommended.</li>
          <li>Your question should not depend only on memorizing things like Dates, Characters' names and Places.</li>
          <li>Avoid questions that are based on your personal opinion or theory. </li>
          <li>Make sure to make 4 distinguishable choices.</li >
          <li>The 3 wrong choices must NOT have any common pattern,
            in other words, the right choice shouldn't be too obvious at first glance,
            so the question experience is more interesting and challenging.
          </li>
          <li>Your question must be only relevant to anime and doesn't contain any racist, sexual, political, religious or hate speech content.</li>
          <li>You are allowed to make up to <strong>10</strong> contributions every <strong>24</strong> hours.</li>
          <li>Your question must be in a valid english format. </li>
        </ul>

        <p>Some (not limited to) recommended ideas for questions :</p>
        <ul>
          <li>What is the motivation behind Character X actions, what was the impact of his actions on character Y ? </li>
          <li>Did Character X reach his goals ? (when, how ?)</li>
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

      <div id="review-guidelines">
        <h2>Review Guidelines <span>(for reviewers)</span></h2>
        <p>Reviewing contributed questions is critical for us as it makes sure that only good quality questions exist in RealOtakus,
          with that in mind, you should be aware of the importance of reviewers and their impact on the overall experience in RealOtakus, good reviewers means good content,
          so not taking the role seriously can result in taking the role from you and other consequences.
        </p>
        <p>Things to keep in mind when you are reviewing contributions :</p>
        <ul>
          <li>It's really important to be interested in the anime you are reviewing its question.</li>
          <li>Needless to say, the question should comply with our <Link className="simple_link" to="/about#contribution-guidelines">Contribution Guidelines.</Link></li>
          <li>Don't judge the question and take your decision quickly, be patient, judge wisely and objectively.</li>
          <li>It's always good to review questions ASAP, avoid being inactive for long period.</li>
          <li>It's good to do some research if needed.</li>
          <li>If in doubt don't hesitate to contact us.</li>
        </ul>

      </div>

      <div id="faq">
        <h2 title="frequently asked questions">FAQ &nbsp;<BsFillQuestionCircleFill className="faq_icon icon" /></h2>

        <h3 id="handling-contributions">How we handle Contributions ?</h3>
        <p>
          Contributed questions get validated and reviewed (by reviewers or RealOtakus team) based on the above Guidelines.
        </p>
        <p>
          Please note that Realotakus has the right to modify or delete (if inappropriate) any contributed question before or after being reviewed.
        </p>

        <h3 id="choosing-animes">How available animes are selected ?</h3>
        <p>
          Animes available for <strong>Contribution</strong> are chosen based on anime popularity and number of available reviewers for that anime.
        </p>
        <p>
          Animes available for <strong>Quiz</strong> are different for each user,
          as they are based on the number of approved and not seen questions, so questions that are contributed or reviewed by each user don't count.
        </p>

        <h3 id="become-reviewer">How to become a reviewer ?</h3>
        <p>
          For now RealOtakus team only selects reviewers they know in person and trust their skills,
          but very soon there will be a clear system which allows any user to apply for the rule and gets selected if eligible.
        </p>

        <h3 id="contributions-limit">Why is the number of allowed contributions limited to 10 per day ?</h3>
        <p>As you can see in the above <Link className="simple_link" to="/about#contribution-guidelines">Guidelines</Link> we only accept high quality questions, with that said,
          creating a single question with its choices should take some time, trying to contribute more than 10 questions
          in a single day probably means you didn't put enough time and effort in creating each of them.
        </p>
        <p>For now our application can only handle a certain amount of contributed questions received,
          also we have a limited number of eligible reviewers (we are working on having more).
        </p>

      </div>

      {/* 
      <div>
        <h2>Buy us a cup of Coffee </h2>
        <a href="/" target="_blank" rel="noreferrer"></a>
      </div> */}

      {/* <div>
        <h2>Credits</h2>
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

          <a href="mailto:realotakus1@gmail.com" target="_blank" rel="noreferrer">
            <SiGmail className="icon" /> <span>Gmail</span>
          </a>

        </div>

      </div>
    </div>
  )
}

export default About