import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Navigate, useParams } from "react-router-dom";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack/index";
import useDeviceType from "../components/useDeviceType";

const Profile = () => {
  const { username: userParam } = useParams();
  const isMobile = useDeviceType();

  // Check for token on component mount
  useEffect(() => {
    const token = Auth.getToken();
  }, []);

  // If user is not logged in, display a message
  if (!Auth.loggedIn()) {
    return (
      <div className="flex-row justify-center mb-4">
        <h4 className="m-5 p-5">You must be logged in to view this page.</h4>
      </div>
    );
  }

  // Fetch user data for the logged-in user
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || {};
  console.log("user data:", user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10 p-5 m-5">
        <div className="card bg-white">
          <h2 className="card-header bg-primary text-light p-2">
            Viewing your profile.
          </h2>
          <div className="card-body">
            <h3>User Information</h3>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <h3>Your Cards</h3>
            {/* Display user-added cards */}
            {/* <CardStack cards={user.cards} /> */}
            <h3>Your Favorites</h3>
            {/* Display favorite cards */}
            {/* <CardStack cards={user.favorites} /> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
