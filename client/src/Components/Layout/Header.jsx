import React from 'react'
import LOGO from '../../assets/logo.svg'
import { BsBell } from 'react-icons/bs'

const Header = (props) => {

    // const logout = () => {
    //     localStorage.clear()
    //     dispatch(removeUser())
    //     navigate('/login')
    // }

    return (
        <div>
            <section className='mainheader'>
                <div className='Top-header'>
                    <div className='header_left'>
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