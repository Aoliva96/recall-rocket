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
		<main>
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
						<Link className="nav-btn-home btn m-2 mobile-only" to="/login">
							Login
						</Link>
						<Link className="nav-btn-home btn m-2 mobile-only2" to="/signup">
							Signup
						</Link>
					</div>
				)}
			</div>
			<div className="flex-row justify-center">
				<div className="col-12 col-md-8 mb-3">
					{concepts.map((concept) => (
						<ConceptCardStack
							key={concept._id}
							concept={concept.concept}
							cards={concept.cards}
						/>
					))}
				</div>
			</div>
		</main>
	);
};

export default Home;
