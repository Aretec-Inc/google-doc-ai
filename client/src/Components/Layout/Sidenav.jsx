import React from 'react'
import { Link } from 'react-router-dom'
import HOME from '../../assets/home.svg'
import FORWARD from '../../assets/forward.svg'
import MENU from '../../assets/menu.svg'
import allPaths from '../../Config/paths'

const Sidenav = (props) => {

    return (
        <div className='sidenav_sidenav'>
            <div className='sidebar-sub'>
                <div className='navlink-menu'>
                    <Link to={allPaths?.DASHBOARD}><img src={HOME} alt='' /></Link>
                    <span>Dashboard</span>
                </div>
                <div className='navlink-menu'>
                    <Link to={allPaths?.SUBMISSION}><img src={FORWARD} alt='' /></Link>
                    <span>Submissions</span>
                </div>
                <div className='navlink-menu'>
                    <Link to={allPaths?.DASHBOARD}><img src={FORWARD} alt='' /></Link>
                    <span>Upload</span>
                </div>
                <div className='navlink-menu'>
                    <Link to={allPaths?.CONFIGURATION}><img src={MENU} alt='' /></Link>
                    <span>Configuration</span>
                </div>
            </div>
        </div>
    )
}

export default Sidenav