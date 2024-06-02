import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../utils/mutations";

const CardStack = ({ cards = [] }) => {
	const { concept: urlConcept } = useParams(); // Get concept from URL params

	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [addFavorite] = useMutation(ADD_FAVORITE);
	const [removeFavorite] = useMutation(REMOVE_FAVORITE);

	const createdByIds = cards.map((card) => card.createdBy.id);

	const { loading, data, error } = useQuery(QUERY_CARDS, {
		variables: { concept: urlConcept, createdBy: createdByIds },
	});

	useEffect(() => {}, [loading, data, error, urlConcept, createdByIds]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
		setShowAnswer(false);
	};

	const handleBack = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + cards.length) % cards.length
		);
		setShowAnswer(false);
	};

	const toggleAnswer = () => {
		setShowAnswer((prevShowAnswer) => !prevShowAnswer);
	};

	const card = cards[currentIndex];

	const handleAddFavorite = async () => {
		try {
			console.log("Adding to favorites...");
			console.log("Card ID:", card._id);
			const result = await addFavorite({
				variables: {
					cardId: card._id,
				},
				refetchQueries: [
					{
						query: QUERY_CARDS,
						variables: { concept: urlConcept, createdBy: createdByIds },
					},
				],
			});
		} catch (error) {
			console.error("Error adding favorite:", error);
		}
	};

	const handleRemoveFavorite = async (favoriteId) => {
		try {
			await removeFavorite({
				variables: {
					favoriteId,
				},
				refetchQueries: [
					{
						query: QUERY_CARDS,
						variables: { concept: urlConcept, createdBy: createdByIds },
					},
				],
			});
		} catch (error) {
			console.error("Error removing favorite:", error);
		}
	};

	const isFavorite = (favoriteId) => {
		return (
			card &&
			card.favorites &&
			card.favorites.some((fav) => fav._id === favoriteId)
		);
	};

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
			<div>
				{!isFavorite(card._id) ? (
					<button onClick={handleAddFavorite}>Add to Favorites</button>
				) : (
					<button onClick={() => handleRemoveFavorite(card._id)}>
						Remove from Favorites
					</button>
				)}
			</div>
		</div>
	);
};

export default CardStack;
