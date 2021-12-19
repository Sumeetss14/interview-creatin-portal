import React from 'react'
import {Link} from "react-router-dom"

import "./Home.css"

function Home() {
    return (
        <div className='home'>
            <div className="home__link">
                <Link to="/interview"><h2 className="home__linkHeading">Create new Interview</h2></Link>
            </div>
            <div className="home__link">
                <Link to="/upcoming-interview"><h2 className="home__linkHeading">Upcoming Interview</h2></Link>
            </div>
        </div>
    )
}

export default Home
