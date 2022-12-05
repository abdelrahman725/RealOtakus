import { FaDonate } from 'react-icons/fa'
import { SlSocialTwitter } from 'react-icons/sl'
import { BsGithub } from 'react-icons/bs'
import React from 'react'

const About = () => {
  return (
    <div className="centered_div about">
      <div>
        <h2>About</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor eros fermentum faucibus iaculis. Cras eget dui id turpis tincidunt auctor. Aliquam erat volutpat. In non erat elit. Praesent vulputate est et rhoncus lobortis. Morbi mollis ante ut felis convallis consectetur. Integer ornare sapien magna, non maximus nisi imperdiet non. Donec tincidunt iaculis lectus eu hendrerit. Proin vel posuere lectus. Nulla ac nisi pretium, volutpat elit a, facilisis nibh</p>
      </div>
      
      <div id="section">
        <h2>Contribution Guidelines</h2>
        <p>Integer fringilla augue congue accumsan accumsan. Aliquam in vulputate ligula. Vestibulum rutrum dui ac egestas accumsan. Nunc sed lorem vel purus vulputate lobortis in ut nisi. Praesent eget maximus ligula, nec sodales turpis. Nullam sed neque interdum, condimentum mi in, hendrerit urna. Vestibulum vitae turpis dolor. In risus mi, fringilla vitae eros sit amet, finibus scelerisque odio. Donec sed semper enim, nec vehicula purus.</p>
      
        <h3>what to do</h3>
        <p>to do ...</p>
      
        <h3>what not to do</h3>
        <p>to do ...</p>
      </div>
      
      <div>
        <h2>Support</h2>
        <a href="https://www.buymeacoffee.com">
          <FaDonate className="icon"/> 
        </a>
      </div>

      <div>
        <h2>Stay in touch</h2>
        <div className="community_links">

          <a href="https://github.com/abdelrahman725/RealOtakus" target="_blank">
            <BsGithub className="icon" /> <span>Github</span> 
          </a>

          <a href="https://twitter.com" target="_blank">
            <SlSocialTwitter className ="icon"/> <span>Twitter</span> 
          </a>
        </div>
      </div>
    </div>
  )
}

export default About