import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CurrencySelector from './CurrencySelector';

const Layout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600">Finance Tracker</span>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink 
                    to="/dashboard" 
                    className={({isActive}) => isActive ? 'bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium' : 'text-gray-600 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium'}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/transactions" 
                    className={({isActive}) => isActive ? 'bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium' : 'text-gray-600 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium'}
                  >
                    Transactions
                  </NavLink>
                  <NavLink 
                    to="/receipts" 
                    className={({isActive}) => isActive ? 'bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium' : 'text-gray-600 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium'}
                  >
                    Receipts
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;