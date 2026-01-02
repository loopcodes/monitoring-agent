import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void; // Add onLogout prop
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, isAdmin, onLogout }) => {
  return (
    <nav className="shadow-lg sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-4xl font-bold">R<span className='text-green-600'>M</span></div>
        <div className="space-x-6">
          {!isLoggedIn ? (
            <Link to="/login" className="text-green-600">Signup/Login</Link>
          ) : (
            <>
              <Link to="/" className="text-green-600"></Link>
              {isAdmin ? (
                <Link to="/dashboard" className="text-green-600">Dashboard</Link>
              ) : (
                <>
                  <Link to="/report" className="text-green-600">Report</Link>
                  <Link to="/profile" className="text-green-600">Profile</Link> {/* Profile link for users */}
                </>
              )}
              {/* Logout button */}
              <button onClick={onLogout} className="text-green-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
