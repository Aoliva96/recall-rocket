import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";
import CardSingle from "./CardSingle";

const CardStack = ({ cards = [] }) => {
	const { concept: urlConcept } = useParams(); // Get concept from URL params
	console.log("Cards prop:", cards);
	console.log("Concept:", urlConcept);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	// const [localCards, setLocalCards] = useState([]);

	const createdByIds = cards.map((card) => card.createdBy.id);
	console.log("Created by IDs:", createdByIds);

	const { loading, data, error } = useQuery(QUERY_CARDS, {
		variables: { concept: urlConcept, createdBy: createdByIds },
	});

	useEffect(() => {
		console.log("Loading:", loading);
		console.log("Data:", data);
		console.log("Error:", error);
		console.log("Cards prop in useEffect:", cards);
	}, [loading, data, error, urlConcept, createdByIds]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
		setShowAnswer(false);
	};

	const handleBack = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + localCards.length) % cards.length
		);
		setShowAnswer(false);
	};

	const toggleAnswer = () => {
		setShowAnswer((prevShowAnswer) => !prevShowAnswer);
	};

	const card = cards[currentIndex];

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
