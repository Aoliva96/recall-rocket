import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import useDeviceType from "../components/useDeviceType";

import { QUERY_ME, QUERY_USER } from "../utils/queries";
import Auth from "../utils/auth";
import ConceptCardStack from "../components/ConceptCardStack/index";

const Profile = () => {
	const { username: userParam } = useParams();
	const isMobile = useDeviceType();
	const [selectedConcept, setSelectedConcept] = useState(null);

	const isLoggedInUserProfile =
		!userParam || Auth.getProfile()?.username === userParam;

	// Fetch user data based on whether it's the logged-in user's profile or another user's
	const { loading, data } = useQuery(
		isLoggedInUserProfile ? QUERY_ME : QUERY_USER,
		{
			variables: { username: userParam },
		}
	);

	const user = data?.me || data?.user || {};
	console.log("User Data:", user);

	// Check for token on component mount
	useEffect(() => {
		const token = Auth.getToken();
		console.log("Token in Profile Component:", token);
	}, []);

	// If user is logged in and viewing their own profile, redirect to /me
	if (
		Auth.loggedIn() &&
		(!userParam || Auth.getProfile()?.username === userParam)
	) {
		return <Navigate to="/me" />;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user?.username) {
		return (
			<h4>
				{isMobile
					? "You need to be logged in to see this. Use the navigation links below to sign up or log in!"
					: "You need to be logged in to see this. Use the navigation links above to sign up or log in!"}
			</h4>
		);
	}

	const handleConceptClick = (concept) => {
		setSelectedConcept(concept);
	};

	return (
		<div>
			<div className="flex-row justify-center mb-3">
				<h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
					Viewing {userParam ? `${user.username}'s` : "your"} profile.
				</h2>
				<div className="col-12 col-md-10 mb-5">
					<div className="btn-group">
						<button
							className="btn btn-primary"
							onClick={() => handleConceptClick("Mongo")}
						>
							Mongo
						</button>
						<button
							className="btn btn-primary"
							onClick={() => handleConceptClick("Express")}
						>
							Express
						</button>
						<button
							className="btn btn-primary"
							onClick={() => handleConceptClick("Node")}
						>
							Node
						</button>
						<button
							className="btn btn-primary"
							onClick={() => handleConceptClick("React")}
						>
							React
						</button>
					</div>
				</div>
				<div className="col-12 col-md-10 mb-5">
					{selectedConcept && <ConceptCardStack concept={selectedConcept} />}
				</div>
			</div>
		</div>
	);
};

export default Profile;
