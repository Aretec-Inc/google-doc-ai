import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { useSelector } from 'react-redux'
import { Home, Files, Flow, Reporting, Submissions, Login, Signup, Case, SearchReult } from '../src/Screens'
import './App.css'
import { manager } from './utils/constants'
import { AllRoutes } from './Config/routes'

function App() {
  // const navigate = useNavigate()
  const userLogin = useSelector((state) => state?.authReducer?.user)


  return (
   <AllRoutes />
  )
}

export default hot(App)