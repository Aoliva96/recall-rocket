import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ConceptCardStack from "../components/ConceptCardStack";
import { QUERY_CONCEPTS } from "../utils/queries";
import Auth from "../utils/auth";
import ExpandableNav from "../components/ExpandableNav";

const Home = () => {
  const { loading, data } = useQuery(QUERY_CONCEPTS);

  const concepts = data?.concepts || [];

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  if (loading) {
    return <div className="w-100 text-center">Loading...</div>;
  }

  return (
    <>
      <div className="nav-btns">
        {Auth.loggedIn() ? (
          <>
            <Link
              className="btn mobile btn-md btn-light m-2 nav-btn-home nav-btn "
              to="/me"
            >
              My profile
            </Link>
            <button
              className="btn btn-md btn-light m-2 mobile  nav-btn-home nav-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="nav-btns">
            <Link className=" btn mobile nav-btn-home m-2 nav-btn" to="/login">
              Login
            </Link>
            <Link className="nav-btn-home mobile btn m-2 nav-btn" to="/signup">
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
          <div className="card-body mx-3">
            <p>
              RecallRocket is a flashcard app that helps you reinforce your
              knowledge of the MERN stack. Choose between the MongoDB,
              Express.js, React, or Node.js card sets below to get started! If
              you find any cards that you would like to spend more time
              reviewing later, simply create an account and you'll see that each
              flashcard now has a favorite button in the top right. Cards tagged
              as a favorite will be saved to your profile for easy access. Happy
              studying!
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-10">
        <div className="card bg-white mt-2">
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            MERN Concept Cards:
          </h4>
          <div className="card-main card-mobile pl-2">
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
      {/* ExpandableNav for mobile */}
      <ExpandableNav />
    </>
  );
};

export default Home;
