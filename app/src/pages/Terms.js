import React from 'react'
import { Link } from 'react-router-dom'

const Terms = () => {

  return (
    <div className="terms">
      <h1>Terms of Service </h1>
      <p className="date">Last updated on 2023-03-01</p>

      <div>
        <p>These terms and conditions outline the rules and regulations for the use of our platform.
          By accessing this website, accessible from realotakus.com, we assume you accept these terms and conditions.
          DO NOT CONTINUE TO USE RealOtakus IF YOU DO NOT AGREE TO TAKE ALL OF THE TERMS AND CONDITIONS STATED ON THIS PAGE.
        </p>
      </div>

      <div>
        <h2>Cookies</h2>
        <p>We employ the use of "Cookies". A Cookie is small piece of data stored by your web browser on your device. By accessing realotakus, you agreed to use cookies in agreement with the RealOakus's <Link to="/privacy" className="simple_link" target={"_blank"}>Privacy Policy.</Link> </p>
        <p>
          Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
          Some of our affiliate/advertising partners may also use cookies.
        </p>
      </div>

      <div>
        <h2>Limitations</h2>

        <p>
          Unless otherwise stated, RealOakus and/or its licensors own the intellectual property rights for all material on realotakus.
          All intellectual property rights are reserved. You may access this from realotakus for your own personal use subjected to restrictions set in these terms and conditions.
        </p>

        <p>You must not :</p>
        <ul>
          <li>Republish material from realotakus</li>
          <li>Sell, rent or sub-license material from realotakus</li>
          <li>Reproduce, duplicate or copy material from realotakus</li>
          <li>Redistribute content from realotakus</li>
        </ul>

      </div>

      <div>
        <h2>Intellectual Property</h2>
        <p>To do ...</p>
      </div>

      <div>
        <h2>Your Privacy</h2>
        <p>If you use our Platform, you must abide by our <Link to="/privacy" className="simple_link" target={"_blank"}>Privacy Policy.</Link></p>
      </div>

      <div>
        <h2>Removal of content from our platform</h2>

        <p>
          If you find any content (e.g. anime question) on realotakus that is offensive for any reason, you are free to contact and inform us any moment.
          We will consider requests to remove it but we are not obligated to or so or to respond to you directly.
        </p>

        <p>
          We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy;
          nor do we promise to ensure that the website remains available.
        </p>
      </div>

      <div>
        <h2>External Links</h2>
        <p>
          RealOtakus is not responsible for the contents of any linked sites.
          we recommend you to review the Terms & Conditions of the websites you are visiting.
        </p>
      </div>

      <div>
        <h2>Reservation of Rights</h2>
        <p>
          We reserve the right to monitor all content published (e.g. Questions ) and to remove any which can be considered inappropriate, offensive or causes breach of these Terms and Condition.
        </p>
      </div>

      <div>
        <h2>Disclaimer</h2>
        <p>
          This website offer an opportunity for users to create questions and exchange opinions and information.
          While RealOakus do filter, edit and review Contributed Questions prior to their presence on the website,
          RealOakus does not filter, edit, publish or review Comments.
          Questions and Comments do not reflect the views and opinions of RealOakus or its team.
          Question and Comments reflect the views and opinions of the person who post them. To the extent permitted by applicable laws.
          RealOakus reserves the right to monitor all Questions and Comments and to remove any Questions and Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
        </p>

        <p>
          We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available.
        </p>

        <p>
          Under no circumstances shall we be liable for any damage or loss, direct or indirect, arising ouf of the use of our platform and its services.
        </p>
      </div>


      <div>
        <h2>Changes to our Terms</h2>

        <p>
          RealOtakus may revise these Terms of Service at any time without prior notice.
          By using our platform you are agreeing to be bound by the current version of these Terms of Service.
        </p>
      </div>

      <p className="credit">Our Terms and Conditions were created with the help of the <a href="https://www.termsandconditionsgenerator.com/">Free Terms and Conditions Generator</a>.</p>

    </div>
  )
}

export default Terms