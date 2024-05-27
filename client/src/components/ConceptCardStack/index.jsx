import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardCarousel from "../CardCarousel/index";

const ConceptCardStack = ({ concept, cards }) => {
	const [showCarousel, setShowCarousel] = useState(false);

	const toggleVisibility = () => {
		setShowCarousel(!showCarousel);
	};

	return (
		<div>
			<h2>{concept}</h2>
			<button onClick={toggleVisibility}>
				{showCarousel ? "Hide Carousel" : "Show Carousel"}
			</button>
			{showCarousel && <CardCarousel cards={cards} concept={concept} />}
			<Link to={`/quiz/${concept}`}>Go to {concept} Quiz</Link>
		</div>
	);
};

export default ConceptCardStack;
