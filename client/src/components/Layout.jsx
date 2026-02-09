import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  // Check if current page is admin panel to apply different styling
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen ${isAdminPage ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content Only - No Navigation */}
      <main className="min-h-screen">
        <div className={`px-4 sm:px-6 lg:px-8 py-8 ${
          isAdminPage ? '' : 'max-w-7xl mx-auto'
        }`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;