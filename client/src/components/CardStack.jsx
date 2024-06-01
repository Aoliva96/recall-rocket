import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardSingle from "./CardSingle";

const CardStack = ({ cards, title, showTitle = true, showUsername = true }) => {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [showSingleCard, setShowSingleCard] = useState(false);

	const toggleAnswer = () => {
		setShowSingleCard(!showSingleCard);
	};

	const handleBack = () => {
		if (currentCardIndex > 0) {
			setCurrentCardIndex(currentCardIndex - 1);
		}
	};

	const handleNext = () => {
		if (currentCardIndex < cards.length - 1) {
			setCurrentCardIndex(currentCardIndex + 1);
		}
	};

	if (!cards.length) {
		return <h3>No cards about this concept yet.</h3>;
	}

	console.log("Cards array:", cards);
	return (
		<div>
			{showTitle && <h3>{title}</h3>}
			{cards.map((card, index) => (
				<div key={card._id} className="card mb-3">
					<h4 className="card-header bg-primary text-light p-2 m-0">
						{showUsername ? (
							<Link
								className="text-light"
								to={`/profiles/${card.createdBy._id}`}
							>
								{card.createdBy.username} <br />
								<span style={{ fontSize: "1rem" }}>
									had this card on {card.createdAt}
								</span>
							</Link>
						) : (
							<>
								<span style={{ fontSize: "1rem" }}>
									You had this card on {card.createdAt}
								</span>
							</>
						)}
					</h4>
					<div className="card-body bg-light p-2">
						<p>{card.cardText}</p>
					</div>
					<Link
						className="btn btn-primary btn-block btn-squared"
						to={`/cards/${card._id}`}
					>
						Join the discussion on this card.
					</Link>
				</div>
			))}
		</div>
	);
};

export default CardStack;
