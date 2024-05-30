import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ConceptCardStack from "../components/ConceptCardStack/index";
import { QUERY_CONCEPTS } from "../utils/queries";
import Auth from "../utils/auth";

const Home = () => {
  const { loading, data } = useQuery(QUERY_CONCEPTS);

  const concepts = data?.concepts || [];

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="nav-btns">
        {Auth.loggedIn() ? (
          <>
            <Link
              className="btn btn-md btn-light m-2 nav-btn-home mobile-only"
              to="/me"
            >
              {Auth.getProfile()?.username}'s profile
            </Link>
            <button
              className="btn btn-md btn-light m-2 nav-btn-home mobile-only2"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="nav-btns">
            <Link className="nav-btn-home btn m-2 mobile-only2" to="/login">
              Login
            </Link>
            <Link className="nav-btn-home btn m-2 mobile-only" to="/signup">
              Signup
            </Link>
          </div>
        )}
      </div>
      <div className="col-12 col-lg-10">
        <div className="card bg-white mt-2">
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            Welcome to RecallRocket!
          </h4>
          <div className="card-body mx-2">
            <p>
              RecallRocket is a flashcard app that helps you reinforce your
              knowledge of the MERN stack. Choose between MongoDB, Express.js,
              React, or Node.js card sets below to get started! If you find any
              cards that you would like to spend more time reviewing later,
              simply create an account and get access to our handy favoriting
              feature. Your favorite cards will be saved to your profile for
              easy access. Happy studying!
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-10">
        <div className="card bg-white mt-2">
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            MERN Concept Cards:
          </h4>
          <div className="w-100 display-flex flex-wrap align-center py-1 pl-2">
            {concepts.map((concept) => (
              <ConceptCardStack
                key={concept._id}
                concept={concept.concept}
                cards={concept.cards}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
