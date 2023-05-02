import React, { useState, useEffect } from 'react'
import Input from 'antd/lib/input'
import { FaUserAlt } from 'react-icons/fa'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { removeUser } from '../../Redux/actions/authActions'

const Header = (props) => {
    const { user } = props
    const location = useLocation()
    const [search, setSearch] = useState(new URLSearchParams(location?.search)?.get('search') || '')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        let searchVal = new URLSearchParams(location?.search)?.get('search') || ''
        setSearch(searchVal)
    }, [location?.search])

    const logout = () => {
        localStorage.clear()
        dispatch(removeUser())
        navigate('/login')
    }

    const onEnter = (e) => {
        if (e?.keyCode === 13 && search?.length) {
            return navigate(`/search-result?search=${search}`)
        }
    }

    return (
        <div className='header_cont'>
            <div className='header_left'>
                <div className='vi_logo' />
                <div className='header-title-div'>
                    <p className='header_title margin_header'>Intelligent Document Processing</p>
                </div>
            </div>
            {user?.role === 'manager' ? <div className='head_center'>
                <Input
                    placeholder='Search File...'
                    className='header-search'
                    onChange={(e) => setSearch(e?.target?.value)}
                    value={search}
                    onKeyUp={onEnter}
                    size='large'
                // addonAfter={<span onClick={() => navigate(`/search-result?search=${search}`)}><SearchIcon /></span>}
                />
            </div> : null}
            <div className='right_side'>
                <div className='name_space'>
                    <FaUserAlt className='user_icon' />
                    <p className='header-user'>{user?.name}</p>
                    <div onClick={logout}>
                        <LogoutIcon className='logout-icon' />
                    </div>
                </div>
            </div>
        </div>
    )


}

export default Header