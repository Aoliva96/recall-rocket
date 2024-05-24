import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

import { QUERY_THOUGHTS } from '../utils/queries';
import Auth from '../utils/auth';
const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <main>
       <div className='nav-btns '>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-md btn-light m-2 nav-btn-home mobile-only " to="/me">
                {Auth.getProfile().data.username}'s profile
              </Link>
              <button className="btn btn-md btn-light m-2 nav-btn-home mobile-only2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className='nav-btns '>
              <Link className=" nav-btn-home btn m-2 mobile-only" to="/login">
                Login 
              </Link>
              <Link className=" nav-btn-home btn m-2 mobile-only2" to="/signup">
                Signup
              </Link>
            </div>
          )}
        </div>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <ThoughtForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
