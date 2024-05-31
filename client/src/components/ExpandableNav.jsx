import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';


const ExpandableNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <div className={`expandable-nav ${isExpanded ? 'expanded' : ''}`}>
      <button className="expand-nav-btn" onClick={handleToggle}>
        {isExpanded ? 'Close Nav' : 'Expand Nav'}
      </button>
      {isExpanded && (
        <div className="nav-links">
          {Auth.loggedIn() ? (
            <>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
              <Link className="nav-btn" to="/me">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-btn" to="/login">
                Login
              </Link>
              <Link className="nav-btn" to="/signup">
                Signup
              </Link>
            </>
          )}
          <Link className="nav-btn" to="/about">
            About
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExpandableNav;
