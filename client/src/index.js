import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store, persistor } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import './styles/globals.css'; 
import HITLInterface from './Screens/HITLinterface.jsx';

// import 'antd/dist/antd.css';
// import 'antd/dist/reset.css'; // For Ant Design v5 and above


// import { AllRoutes } from './Config/routes';
import App from './App'
const root = document.getElementById('root')

ReactDOM.render(<Provider store={store}>
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
</Provider>, root)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
