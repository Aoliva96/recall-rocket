import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack/index";
import useDeviceType from "../components/useDeviceType";

const Profile = () => {
  // const isMobile = useDeviceType();

  // Check for token on component mount
  useEffect(() => {
    const token = Auth.getToken();
  }, []);

  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return (
      <div className="flex-row justify-center mb-4">
        <h4 className="m-5 p-5">You must be logged in to view this page.</h4>
      </div>
    );
  }

  // Fetch data for logged-in user
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: "Emily Davis" },
  });

  const user = data?.me || {};
  console.log("user data:", user);

  // Check if loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Update user data
  function updateUserData() {
    // Update user data here
    console.log("Update button clicked");
  }

  return (
    <div className="col-12 col-lg-10">
      <div className="card bg-white mt-2">
        <h4 className="card-header bg-primary text-white p-2 pl-3">
          Welcome to your profile page, {user.username}!
        </h4>
        <div className="card-body mx-2">
          <div className="display-flex align-center">
            <h4>User Information</h4>
          </div>
          <hr className="mb-3" />
          <p style={{ fontWeight: "bold" }}>Username: {user.username}</p>
          <p style={{ fontWeight: "bold" }}>Email: {user.email}</p>
          <button
            className="btn btn-sm btn-primary text-white mt-1 mb-3 nav-btn"
            onClick={updateUserData}
          >
            Update
          </button>
          <h4>Your Cards</h4>
          <hr className="mb-3" />
          {!user.cards ? (
            <p>You haven't created any cards yet.</p>
          ) : (
            <p>User cards placeholder</p>
            /* <CardStack cards={user.cards} /> */
          )}
          <Link
            to="/cards"
            className="btn btn-sm btn-primary text-white mt-1 mb-3"
          >
            Create a new card
          </Link>
          <h4>Your Favorites</h4>
          <hr className="mb-3" />
          {!user.cards ? (
            <p>You haven't saved any favorites yet.</p>
          ) : (
            <p>User favorites placeholder</p>
            /* <CardStack cards={user.favorites} /> */
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
