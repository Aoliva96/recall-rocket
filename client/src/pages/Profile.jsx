import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";
import { useParams } from "react-router-dom";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack";
import UpdateForm from "../components/UpdateForm";

const Profile = () => {
	const { username: userParam } = useParams();
	const [showUpdateForm, setShowUpdateForm] = useState(false);

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
	const { loading, data, refetch } = useQuery(QUERY_ME);

	const [updateUser] = useMutation(UPDATE_USER);

	// If no user data, return empty object
	const user = data?.me || {};

	// Check if loading
	if (loading) {
		return <div>Loading...</div>;
	}

	const toggleUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm);
	};

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

	const handleUpdateUser = async (userData) => {
		try {
			const { data } = await updateUser({
				variables: {
					username: userData.username,
					email: userData.email,
					password: userData.password,
				},
			});

			if (data?.updateUser) {
				// Refetch user data after update
				refetch();
				// Hide update form after successful update
				setShowUpdateForm(false);
			}
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

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
					{!showUpdateForm && (
						<button
							className="btn btn-sm btn-primary text-white mt-1 mb-3 nav-btn"
							onClick={toggleUpdateForm}
						>
							Update
						</button>
					)}
					{showUpdateForm && (
						<UpdateForm user={user} onUpdate={handleUpdateUser} />
					)}
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
