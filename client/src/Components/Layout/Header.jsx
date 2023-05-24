import React, { useState } from 'react'
import LOGO from '../../assets/Doc_ai_logo.svg'
import { BsBell } from 'react-icons/bs'

const Header = (props) => {
    const { setToggleHeader } = props

    // const [toggleHeader, setToggleHeader] = useState(false)


    const clickToogle = () => {
        setToggleHeader((state) => !state)
    }
    // const logout = () => {
    //     localStorage.clear()
    //     dispatch(removeUser())
    //     navigate('/login')
    // }

    return (
        <div className='main-header-section'>
            <section className='mainheader'>
                <div className='Top-header'>
                    <div className='header_left'>
                        <span className="material-symbols-outlined menu_bar_icon" onClick={clickToogle}>
                            menu
                        </span>
                        <img src={LOGO} alt="" className='logomain' />
                    </div>
                    <div className='right_side'>
                        <div className='name_space'>
                            <BsBell className='user_icon' />
                        </div>
                        <div className='loginuser'>
                            <div className='loginuser-img'></div>
                            <div className='loginname'>
                                <h6>john Dae</h6>
                                <span>john@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Header