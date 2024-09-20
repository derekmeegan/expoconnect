// @ts-nocheck
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-64 h-screen bg-primary shadow-lg fixed left-0 top-0 p-4 flex flex-col">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold mb-8 text-text">expoConnect</h1>
        {isAdmin && (
          <Link 
            to="/admin" 
            className={`block p-2 rounded ${isActive('/admin') ? 'bg-secondary' : 'hover:bg-secondary'} text-text`}
          >
            Admin Panel
          </Link>
        )}
        <Link 
          to="/" 
          className={`block p-2 rounded ${isActive('/') ? 'bg-secondary' : 'hover:bg-secondary'} text-text`}
        >
          Dashboard
        </Link>
      </div>
      <button 
        onClick={handleLogout}
        className="w-full p-2 bg-logout text-white rounded hover:bg-opacity-90"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;