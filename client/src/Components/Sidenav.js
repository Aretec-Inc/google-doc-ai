import { useState } from 'react'
import styles from './sidenav.module.css'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { manager } from '../utils/constants'
// import { navData, navDataApp } from './lib/navData'

export default function Sidenav() {
    const [open, setopen] = useState(true)
    // const location = useLocation()
    // console.log(location.pathname)
    // const active = 'active'
    const userLogin = useSelector((state) => state.authReducer.user)

    return (
        <div className={styles.sidenav}>
            {/* <button className={styles.menuBtn} onClick={toggleOpen}>
                {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
            </button> */}
            {/* <div style={{ margin: '30px auto' }}>
                {userLogin?.role == manager ? navData?.map(item => {
                    return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
                        {item.icon}
                        <span className={styles.linkText}>{item.text}</span>
                    </NavLink>
                }) : navDataApp?.map(item => {
                    return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
                        {item.icon}
                        <span className={styles.linkText}>{item.text}</span>
                    </NavLink>
                })}
            </div> */}
        </div>
    )
}