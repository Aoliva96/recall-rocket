import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack/index";
import { Navigate } from "react-router-dom";

const Profile = () => {
  // Check for token on component mount
  useEffect(() => {
    const token = Auth.getToken();
  }, []);

  // If user is not logged in, display a message
  if (!Auth.loggedIn()) {
    return (
      <div>
        <h4>You must be logged in to view this page.</h4>
      </div>
    );
  }

  // Fetch user data for the logged-in user
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { _id: Auth.getProfile().data._id },
  });

  const user = data?.me || {};
  console.log("user data:", user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Viewing your profile.</h2>
      <h3>User Information</h3>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <h3>Favorites</h3>
      {/* <CardStack cards={user.favorites} title="Favorites" /> */}
    </div>
  );
};

export default Profile;
