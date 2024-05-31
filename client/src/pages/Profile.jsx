import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Link, useParams } from "react-router-dom";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack";

const Profile = () => {
	const { username: userParam } = useParams();
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
	const { loading, data } = useQuery(QUERY_ME);

	// If no user data, return empty object
	const user = data?.me || {};

	// Check if loading
	if (loading) {
		return <div>Loading...</div>;
	}

	// Update user data
	function updateUser() {
		// Update user data here
		console.log("Update button clicked");
	}

	// Add an Admin owned card
	function addAdminCard() {
		// Add an admin card data here
		console.log("Create a new admin card button clicked");
	}

	// Add a User owned card
	function addUserCard() {
		// Add user card data here
		console.log("Create a new card button clicked");
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
						onClick={updateUser}
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
					{!user.admin && (
						<button
							to="/cards"
							className="btn btn-sm btn-primary text-white mt-1 mb-3"
							onClick={addUserCard}
						>
							Create a new card
						</button>
					)}
					{user.admin && (
						<button
							to="/cards"
							className="btn btn-sm btn-secondary text-white mt-1 mb-3"
							onClick={addAdminCard}
						>
							Create a new admin card
						</button>
					)}
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
