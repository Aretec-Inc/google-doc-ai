import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'antd/lib/button'
import Result from 'antd/lib/result'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Submission, Dashboard, Configuration } from '../Screens'
import { Header, Sidenav } from '../Components'
import { getAllProcessors, getAllSubmissions } from '../Redux/actions/docActions'
import SelectedDocument from '../Components/SelectedDocument/SelectedDocument'
import allPaths from './paths'

let data = {
    file_name: 'form-f7bcc597-5fca-40c4-a586-078d202e233c-dd2875_form1(1)(2).pdf',
    artifact_size: '0.0898 mb',
    artifact_type: 'pdf',
    created_at: '2022-09-20T10:52:01.629Z',
    dataset_csv: null,
    executed: false,
    explicit_content: null,
    file_address: "https://storage.googleapis.com/elaborate-howl-285701_context_primary/Forms/NotProcessed/form-f7bcc597-5fca-40c4-a586-078d202e233c-dd2875_form1%281%29%282%29.pdf?GoogleAccessId=artifact-mansoor-dev%40elaborate-howl-285701.iam.gserviceaccount.com&Expires=1683398605&Signature=s1IqbMBSxZwDHL5Icgz6QQ286fNpSlb5hSz6QFKoWSIus8Tc%2BBcxaka6sLbUIhIiUDDnaSgXrb2LLbk1ejXQg8IXnFtvZVo0NuwS4ZRoFclLc58aG4NzVgWSKhBZY6La3l0oifSTFI5jtzx6CruvRvR3rMvSfAtNdEWOvyy9AQtzvuNfyXaCrf2201B6iY6OagXjDKdRQWhCKDxPxGvrUvkVWnd4Kq6u%2Bli2LCuya4NI6l4H1EwOSGOOmDz2n18ktN2CQPcZlhl1%2B3A92l%2FWeLM%2BgSkoG0MZZEuRVevMIBVUiZzeRQMXg1cJqhQqr7YT3LH8EhgWegOEFwujyi4VgQ%3D%3D",
    file_type: "form",
    folder_id: "71d3fb0b-e7bc-4eb2-8ede-cd15faef9aaf",
    folder_name: "Form",
    id: "f7bcc597-5fca-40c4-a586-078d202e233c",
    is_completed: true,
    is_validate: null,
    md5: null,
    original_file_name: "pp.pdf",
    original_file_address: null,
    project_id: "0188e8d9-13bb-4cdb-802c-9298670b64c4",
    shared: false,
    form_name: null,
    training_operation_name: null,
    user_id: "97e355c4-96c5-4c0c-9cb5-6ba6febce289"
}

const Page404 = (props) => {
    const navigate = useNavigate()
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, the page you visited does not exist.'
            extra={<Button
                type='primary'
                className='form-button'
                onClick={() => navigate('/')}
            >Back Home</Button>}
        />
    )
}

const WrapComponent = ({ Component, ...props }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllProcessors())
        dispatch(getAllSubmissions())
    }, [])

    return (
        <div className='main_container'>
            <Header />
            <section className='main-screen'>
                <Sidenav />
                <div className='main-section'>
                    <div className='main-container'>
                        <Component {...props} dispatch={dispatch} />
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
                {/* <Route path="/" element={<Home />} /> */}
                <Route path={allPaths?.DASHBOARD} element={<WrapComponent Component={Dashboard} />} />
                <Route path={allPaths?.SUBMISSION} element={<WrapComponent Component={Submission} />} />
                <Route path={allPaths?.CONFIGURATION} element={<WrapComponent Component={Configuration} />} />
                <Route path={'/document'} element={<WrapComponent Component={SelectedDocument} getData={() => console.log('Hello')} openModal={false} disableBack={true} closeModal={() => console.log(false)} artifactData={data} />} />
                <Route path='/:page404' exact element={<Page404 />} />
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