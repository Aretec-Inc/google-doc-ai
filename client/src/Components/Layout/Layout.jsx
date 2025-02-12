import React from 'react';
import Chatbot from '../Chatbot/Chatbot';  // Add this import

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
      <Chatbot />  {/* Add the Chatbot component */}
    </div>
  );
};

export default Layout;