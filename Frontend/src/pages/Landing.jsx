import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <>
      <div className='landingPageContainer'>
        <nav>
          <div className="navHeader">
            <h2>Apna Video Call</h2>
          </div>
          <div className="navlist">
            <p>Join as a guest</p>
            <Link to="http://localhost:5173/auth/sign-up">Register</Link>
            <div role='button'>
              <Link to="http://localhost:5173/auth/login">Login</Link>
            </div>
          </div>
        </nav>
        <div className="landingMainContainer">
          <div className="text">
            <h2><span style={{ color: "#a058ffff" }}>Connect</span> With Your Loved Ones</h2>
            <p>Video calls are a great way to stay connected with friends and family, no matter where they are in the world.</p>
            <div role='button'>
              <Link to="http://localhost:5173/auth">Get Started</Link>
            </div>
          </div>
          <div className="image">
            <img src="./mobile.png" alt="failed to load" />
          </div>
        </div>
      </div>
    </>

  )
}
