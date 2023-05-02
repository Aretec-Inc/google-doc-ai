import { Button, Input, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { Link } from 'react-router-dom'
import LOGO from '../../assets/icons/logo.svg'
import COVER from '../../assets/login-cover.jpeg'
import { POST } from '../../utils/apis'
import { FcGoogle } from '../../utils/icons'
import LoginHeader from '../Header/LoginHeader'

export default function Signup() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const onChange = (e, setState) => {
        setState(e?.target?.value)
    }

    const handleSubmit = () => {
        setLoading(true)
        let gotEmail = email
        let gotPass = password
        let gotName = name

        axios.post(POST?.SIGNUP, { name: gotName, email: gotEmail, password: gotPass })
            .then((data) => {
                message.success("Registration Success!")
                setLoading(false)
                navigate('/login')
                setName(null)
                setEmail(null)
                setPassword(null)
            })
            .catch((err) => {
                message.error("Registration Failed!")
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
                            <h3>Sign up</h3>
                        </div>
                        <div className='main-cont'>

                            <div className='col-inp-field'>
                                <Input className='login-inp-field' value={name} onChange={(e) => onChange(e, setName)} type='name' placeholder='User Name' />
                            </div>
                            <div className='col-inp-field'>
                                <Input className='login-inp-field' value={email} onChange={(e) => onChange(e, setEmail)} type='email' placeholder='Email' />
                            </div>
                            <div className='col-inp-field'>
                                <Input className='login-inp-field' value={password} onChange={(e) => onChange(e, setPassword)} type='password' placeholder='Password' />
                            </div>
                            <div className='login-btn-cont'>
                                <Button disabled={loading} loading={loading} className='upload-submit-btn' onClick={(e) => handleSubmit()}>Signup</Button>
                            </div>
                            <center>
                                Already have account? <Link to={'/login'}>Login</Link>
                            </center>
                            <div className='login-break'>
                                <div className="strike">
                                    <span>OR</span>
                                </div>
                            </div>
                            <div className='login-btn-cont'>
                                <Button className='google-login-btn' icon={<FcGoogle className='google-lgn-icon' />} onClick={(e) => handleSubmit()}>Continue with Google</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}