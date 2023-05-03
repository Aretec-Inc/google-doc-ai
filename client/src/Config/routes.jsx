import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Submission, Dashboard } from '../Screens'
import { Header, Sidenav } from '../Components'
import allPaths from './paths'
import React from 'react'

const Page404 = (props) => {
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
    // const user = useSelector((state) => state)
    return (
        <div className='main_container'>
            <Header />
            <section className='main-screen'>
                <Sidenav />
                <div className='main-section'>
                    <div className='main-container'>
                        <Component {...props} />
                    </div>
                </div>
            </section>
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
                <Route path={allPaths?.DASHBOARD} element={<WrapComponent Component={Dashboard} />} />
                <Route path={allPaths?.SUBMISSION} element={<WrapComponent Component={Submission} />} />
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