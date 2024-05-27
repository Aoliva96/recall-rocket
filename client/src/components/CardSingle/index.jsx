import React from "react";
import { Link } from "react-router-dom";

const CardSingle = ({
	cards,
	title,
	showTitle = true,
	showUsername = true,
}) => {
	if (!cards.length) {
		return <h3>No cards about this concept yet.</h3>;
	}

	return (
		<div className="my-3" onClick={toggleAnswer}>
			<h3 className="card-header bg-dark text-light p-2 m-0">
				{card.question} <br />
				<span style={{ fontSize: "1rem" }}>
					This card is about {card.concept}
				</span>
			</h3>
			<div className="bg-light py-4">
				<blockquote
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

export default CardSingle;
