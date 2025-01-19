import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Dashboard,
  Home,
  Submission,
  Configuration
} from './Screens';
import HITLInterface from './Screens/HITLinterface.jsx';
import Breadcrumb from './Components/Breadcrumb/Breadcrumb';
import Layout from './Components/Layout/Layout';

const App = () => {
  const dispatch = useDispatch();

  // Wrap each component with the Layout
  const withLayout = (Component) => (props) => (
    <Layout>
      <Component {...props} dispatch={dispatch} />
    </Layout>
  );

  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main routes with layout */}
        <Route path="/dashboard" element={withLayout(Dashboard)()} />
        <Route path="/home" element={withLayout(Home)()} />
        <Route path="/submission/*" element={withLayout(Submission)()} />
        <Route path="/configuration" element={withLayout(Configuration)()} />
        <Route path="/hitlinterface" element={withLayout(HITLInterface)()} />
        
        {/* Add a catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;