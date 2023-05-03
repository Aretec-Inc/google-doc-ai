import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, Submission } from '../Screens'
import allPaths from './paths'
import React, { useState, useEffect } from 'react'

const Page404 = (props) => {
    const { history } = props
    return (
        // <Result
        //     status='404'
        //     title='404'
        //     subTitle='Sorry, the page you visited does not exist.'
        //     extra={<Button
        //         type='primary'
        //         className='form-button'
        //         onClick={() => history.push('/')}
        //     >Back Home</Button>}
        // />
        <h1>
            BACK HOME
        </h1>
    )
}

const WrapComponent = ({ Component, ...props }) => {
    const user = useSelector((state) => state)
    console.log('******************************************************', user)
    return (
        <div style={{ height: '90vh', width: '100%', overflow: 'auto' }}>
            <Component {...props} />
        </div>
    )
}

const AllRoutes = () => {
    // const navigate = useNavigate()
    // useEffect(() => {
    //     if (!localStorage.getItem('accessToken')?.length) {
    //         navigate('/login')
    //     }
    //     else {
    //         console.log('has token')
    //     }
    // })

    return (
        <BrowserRouter>
            {/* <ScrollToTop /> */}
            <Routes>
                {/* <Route path='/:page404' exact component={Page404} /> */}
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/" element={<Submission />} />
                {/* <Route path="/submission" element={<WrapComponent Component={Submissions} />} />
                <Route path="/files" element={<Files />} />
                <Route path="/flows" element={<Flow />} />
                <Route path="/reporting" element={<WrapComponent Component={Reporting} />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export {
    AllRoutes,
    Page404
}