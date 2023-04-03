import React from 'react'
import { Link } from "react-router-dom"
import '../404.css'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

const E404 = () => {
    return (
        <div className="mainbox">
            <div className="err">
                4
                <HelpOutlineRoundedIcon className='far clockwiseSpin' style={{fontSize:'14vw'}}/>
                4
            </div>
            <div className="msg">Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?<p>Let's go <Link to={'/'}>Home</Link> and try from there.</p></div>
        </div>
    )
}

export default E404