import React from 'react';
import './LandingPage.css';

import { RiMotorbikeFill } from 'react-icons/ri';
import { IconContext } from "react-icons";



const LandingPage = () => {
    return (
        <div className="landing-page">
            <h1>Welcome to our B2C Food Delivery Driver Managment Platform</h1>
            <IconContext.Provider value={{ color: 'white', size: '100px' }}>
                <RiMotorbikeFill className='bike_icon'/>
            </IconContext.Provider>
        </div>
    );
}

export default LandingPage;
