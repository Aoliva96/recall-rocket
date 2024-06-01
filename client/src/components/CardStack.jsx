import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";
import CardSingle from "./CardSingle";

const CardStack = ({ cards, title, showTitle = true, showUsername = true }) => {
	const { concept: urlConcept } = useParams(); // Get concept from URL params

	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [localCards, setLocalCards] = useState([]);

	const { loading, data, error } = useQuery(QUERY_CARDS, {
		variables: { concept: urlConcept },
	});

	useEffect(() => {
		console.log("Loading:", loading);
		console.log("Data:", data);
		console.log("Error:", error);

		if (data) {
			setLocalCards(data.cards);
		}
	}, [loading, data, error, urlConcept]);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (!localCards || localCards.length === 0) {
		return <div>No cards found.</div>;
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % localCards.length);
		setShowAnswer(false);
	};

	const handleBack = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + localCards.length) % localCards.length
		);
		setShowAnswer(false);
	};

	const toggleAnswer = () => {
		setShowAnswer((prevShowAnswer) => !prevShowAnswer);
	};

	const card = localCards[currentIndex];

	return (
		<div className="my-3">
			<h3 className="card-header bg-dark text-light p-2 m-0">
				{card.question} <br />
				<span style={{ fontSize: "1rem" }}>
					This card is about {card.concept}
				</span>
			</h3>
			<div className="bg-light py-4">
				<blockquote
					onClick={toggleAnswer}
					className="p-4"
					style={{
						fontSize: "1.5rem",
						fontStyle: "italic",
						border: "2px dotted #1a1a1a",
						lineHeight: "1.5",
					}}
				>
					{showAnswer ? card.answer : "Click to reveal the answer"}
				</blockquote>
			</div>
			<button onClick={handleBack}>Back</button>
			<button onClick={handleNext}>Next</button>
		</div>
	);
};

export default CardStack;
