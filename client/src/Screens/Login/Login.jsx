import { Button, Checkbox, Input, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import LOGO from '../../assets/icons/logo.svg'
import COVER from '../../assets/login-cover.jpeg'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { POST } from '../../utils/apis'
import { FcGoogle } from '../../utils/icons'
import LoginHeader from '../Header/LoginHeader'

export default function Login(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    useEffect(() => {
        // dispatch(removeUser())
        removeUser()
    }, [])

    const onChange = (e, setState) => {
        setState(e?.target?.value)
    }

    const handleSubmit = () => {
        setLoading(true)
        let gotEmail = email
        let gotPass = password

        axios.post(`${POST?.LOGIN}`, { email: gotEmail, password: gotPass })
            .then((res) => {
                const { data, headers } = res
                localStorage.setItem('accesstoken', headers['accesstoken'])
                setLoading(false)
                setEmail(null)
                setPassword(null)
                if (data?.success) {
                    localStorage.setItem('accessToken', data?.userData?.access_token)
                    message.success("Login Success!")
                    axios.post(`${POST?.UPDATE_LAST_LOGIN}`, { user_id: data?.userData?.user_id })
                        .then((res) => {
                            const { data } = res
                            if (data?.success) {
                            }
                            else {
                                message.error(data?.error || 'Something Went Wrong!')
                            }
                        })
                        .catch((err) => {
                            // message.error("Login Failed!")
                        })
                    dispatch(loginUser(data?.userData))
                    navigate('/')
                }
                else {
                    message.error(data?.error || 'Something Went Wrong!')
                }
            })
            .catch((err) => {
                message.error("Login Failed!")
                setLoading(false)
            })
    }

    return (
        <div>
            <LoginHeader />
            <div className='login-base'>
                <div className='login-cont'>
                    <div className='base-cont-cols'>
                        <img src={COVER} className='login-cover-img' />
                        <div className='logo-cover'>
                            <img alt='logo' className='vi_logo_update' src={LOGO} />
                            <label className='logo-tagline-cover'>Intelligent Document Processing</label>
                        </div>
                    </div>
                    <div className='login-cont-cols'>
                        <div className='login-heading'>
                            <h3>Sign in</h3>
                        </div>
                        <div className='main-cont'>

                            <div className='col-inp-field'>
                                <Input className='login-inp-field' value={email} onChange={(e) => onChange(e, setEmail)} type='email' placeholder='Email' />
                            </div>
                            <div className='col-inp-field'>
                                <Input className='login-inp-field' value={password} onChange={(e) => onChange(e, setPassword)} type='password' placeholder='Password' />
                            </div>
                            <div className='col-rem-field'>
                                <div className='login-rem-txt'>
                                    <div><Checkbox />
                                        <label className='rem-txt'>
                                            Remember me
                                        </label></div>
                                    <div><label className='forgot-txt'>
                                        Forgot password?
                                    </label></div>

                                </div>
                            </div>
                            <div className='login-btn-cont'>
                                <Button disabled={loading} loading={loading} className='upload-submit-btn' onClick={(e) => handleSubmit()}>Login</Button>
                            </div>
                            <br />
                            <center>
                                Don't have an account? <Link to={'/signup'}>Sign up</Link>
                            </center>
                            <div className='login-break'>
                                <div className="strike">
                                    <span>OR</span>
                                </div>
                            </div>
                            <div className='login-btn-cont'>
                                <Button className='google-login-btn' icon={<FcGoogle className='google-lgn-icon' />} onClick={(e) => handleSubmit()}>Login with Google</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}