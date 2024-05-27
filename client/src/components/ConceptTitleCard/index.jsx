import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_CARDS } from "../../utils/queries";
import CardCarousel from "../CardCarousel/index";

const ConceptTitleCard = ({ concept }) => {
	const { loading, data } = useQuery(QUERY_CARDS, {
		variables: { concept: concept.concept },
	});
	const cards = data?.cards || [];

	const [showCarousel, setShowCarousel] = useState(false);

	const toggleVisibility = () => {
		setShowCarousel(!showCarousel);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>{concept.concept}</h2>
			<button onClick={toggleVisibility}>
				{showCarousel ? "Hide Carousel" : "Show Carousel"}
			</button>
			{showCarousel && <CardCarousel cards={cards} />}
			<Link to={`/quiz/${concept.concept}`}>Go to {concept.concept} Quiz</Link>
		</div>
	);
};

export default ConceptTitleCard;
