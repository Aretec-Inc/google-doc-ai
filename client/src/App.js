import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { useSelector } from 'react-redux'
import Sidenav from './Components/Sidenav'
import Header from './Screens/Header/Header'
import { Home, Files, Flow, Reporting, Submissions, Login, Signup, Case, SearchReult } from '../src/Screens'
import './App.css'
import { manager } from './utils/constants'
import { AllRoutes } from './Config/routes'

const WrapComponent = ({ Component }) => {
  const user = useSelector((state) => state?.authReducer?.user)
  if (!user?.user_id) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      <Header user={user} />
      <div className='App'>
        <Sidenav user={user} />
        <div style={{ height: 'calc(100vh - 80px)', width: '100%', overflow: 'auto', backgroundColor: '#F5F5F5' }}>
          <Component user={user} />
        </div>
      </div>
    </div>
  )
}

function App() {
  // const navigate = useNavigate()
  const userLogin = useSelector((state) => state?.authReducer?.user)


  return (
   <AllRoutes />
  )
}

export default hot(App)