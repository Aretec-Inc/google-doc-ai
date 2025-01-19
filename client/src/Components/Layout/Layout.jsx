import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Remove Header from here if it exists */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;