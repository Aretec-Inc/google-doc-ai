import React, { useEffect } from 'react'
import { removeUser } from '../../Redux/actions/authActions'

const Header = (props) => {

    useEffect(() => {
        removeUser()
    }, [])

    return (
        <div className='header_cont'>
            <div className='header_left'>
                <div className='vi_logo' />
                <div className='header-title-div'>
                    <p className='header_title'>Intelligent Document Processing</p>
                </div>
            </div>
        </div>
    )
}

export default Header