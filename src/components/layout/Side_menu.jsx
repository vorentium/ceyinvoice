import React from 'react';
import { Link } from 'react-router-dom';
import UserProfilecard from '../atoms/UserProfilecard';
import { supabase } from '../../utils/supabaseClient';
import './Side_menu.css'; // Import the CSS file

const Side_menu = ({ 
  user, 
  activePage, 
  setActivePage, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      
      // Force redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <>
      {/* Hamburger Menu for Mobile/Tablet */}
      <div className="lg:hidden bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-30">
        <h2 className="text-xl font-poppins-bold text-gray-800">CeyInvoice</h2>
        <button 
          onClick={toggleSidebar}
          className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white shadow-md z-20 fixed lg:sticky inset-0 top-0 lg:h-screen sticky-sidebar`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center lg:block">
            <h2 className="text-xl font-poppins-bold text-gray-800 mb-6">CeyInvoice</h2>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <UserProfilecard user={user} />
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="mt-8 flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard?utm_source=sidebar&utm_medium=navigation&utm_campaign=dashboard_access"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${activePage === 'dashboard' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                  onClick={(e) => {
                    setActivePage('dashboard');
                    setSidebarOpen(false);
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard?page=invoices&utm_source=sidebar&utm_medium=navigation&utm_campaign=invoices_access" 
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${activePage === 'invoices' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                  onClick={(e) => {
                    setActivePage('invoices');
                    setSidebarOpen(false);
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Invoices
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard?page=clients&utm_source=sidebar&utm_medium=navigation&utm_campaign=clients_access"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${activePage === 'clients' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                  onClick={(e) => {
                    setActivePage('clients');
                    setSidebarOpen(false);
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Clients
                </Link>
              </li>
              <li>
                <Link 
                  to="/creator-studio?utm_source=sidebar&utm_medium=navigation&utm_campaign=creator_studio_access" 
                  target="_blank"
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard?page=templates&utm_source=sidebar&utm_medium=navigation&utm_campaign=templates_access"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${activePage === 'templates' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                  onClick={(e) => {
                    setActivePage('templates');
                    setSidebarOpen(false);
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                  </svg>
                  Templates
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings?utm_source=sidebar&utm_medium=navigation&utm_campaign=settings_access"
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard?page=help&utm_source=sidebar&utm_medium=navigation&utm_campaign=help_support_access"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${activePage === 'help' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => {
                    setActivePage('help');
                    setSidebarOpen(false);
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  Help & Support
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Logout Button */}
          <div className="mt-8 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-red-600 rounded-md hover:bg-red-50"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Side_menu; 