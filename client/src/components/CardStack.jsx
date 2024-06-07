import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_ME, QUERY_FAVORITES } from "../utils/queries";
import {
	ADD_FAVORITE,
	REMOVE_FAVORITE,
	REMOVE_USER_CARD,
} from "../utils/mutations";
import UpdateCardForm from "./UpdateCardForm";

const CardStack = ({ cards = [], userId }) => {
	const { concept: urlConcept } = useParams(); // Get concept from URL params

	const [currentIndex, setCurrentIndex] = useState(0);
	const [favoriteId, setFavoriteId] = useState(null);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [cardToUpdate, setCardToUpdate] = useState(null);

	const {
		loading: loadingCards,
		data: cardsData,
		error: cardsError,
		refetch: refetchCards,
	} = useQuery(QUERY_ME, {
		variables: { concept: urlConcept },
	});

	const { loading: loadingFavorites, data: favoritesData } =
		useQuery(QUERY_FAVORITES);

	const [addFavorite] = useMutation(ADD_FAVORITE, {
		onCompleted: () => refetchCards(),
	});
	const [removeFavorite] = useMutation(REMOVE_FAVORITE, {
		onCompleted: () => refetchCards(),
	});
	const [removeUserCard] = useMutation(REMOVE_USER_CARD, {
		onCompleted: () => refetchCards(),
	});

	// React card flip
	const [isFlipped, setIsFlipped] = useState(false);
	const handleFlip = () => {
		setIsFlipped(!isFlipped);
	};

	useEffect(() => {
		if (favoritesData && cards[currentIndex]) {
			const favorite = favoritesData.favorites.find(
				(fav) => fav.card._id === cards[currentIndex]._id
			);
			setFavoriteId(favorite ? favorite._id : null);
		}
	}, [favoritesData, cards, currentIndex]);

	if (loadingCards || loadingFavorites) {
		return <div>Loading...</div>;
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
		setShowUpdateForm(false);
		setCardToUpdate(null);
		setIsFlipped(false);
	};

	const handleBack = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + cards.length) % cards.length
		);
		setShowUpdateForm(false);
		setCardToUpdate(null);
		setIsFlipped(false);
	};

	const card = cards[currentIndex];

	const handleAddFavorite = async () => {
		try {
			const { data } = await addFavorite({
				variables: {
					cardId: card._id,
				},
				refetchQueries: [QUERY_ME, "me", QUERY_FAVORITES, "getFavorites"],
			});
			setFavoriteId(data.addFavorite._id);
		} catch (error) {
			console.error("Error adding favorite:", error);
		}
	};

	const handleRemoveFavorite = async () => {
		try {
			await removeFavorite({
				variables: {
					favoriteId: favoriteId, // Use the favoriteId state
				},
				refetchQueries: [QUERY_ME, "me", QUERY_FAVORITES, "getFavorites"],
			});
			setFavoriteId(null);
			handleNext();
		} catch (error) {
			console.error("Error removing favorite:", error);
		}
	};

	const handleDeleteCard = async () => {
		try {
			const { data } = await removeUserCard({
				variables: {
					cardId: card._id,
				},
				refetchQueries: [QUERY_ME, "me"],
			});
			handleNext();
		} catch (error) {
			console.error("Error deleting card:", error);
		}
	};

	const isFavorite = () => favoriteId !== null;

	const toggleUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm);
		setCardToUpdate(card); // Set the cardToUpdate to the current card
	};

	// Format concept name for display
	let cardConcept = "Loading..."; // Default text while card is loading
	if (card && card.concept) {
		const capitalizedConcept =
			card.concept.charAt(0).toUpperCase() + card.concept.slice(1);
		if (capitalizedConcept === "Mongo") {
			cardConcept = "MongoDB";
		} else if (
			capitalizedConcept === "Express" ||
			capitalizedConcept === "Node" ||
			capitalizedConcept === "React"
		) {
			cardConcept = `${capitalizedConcept}.js`;
		} else {
			cardConcept = capitalizedConcept;
		}
	}

	return (
		<>
			<div>
				{/* Card concept */}
				<div className="card bg-primary text-white text-center mt-2 px-0 pt-2 pb-1">
					<h4>{card && cardConcept}</h4>
				</div>
				<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
					{/* Card front */}
					<div
						onClick={handleFlip}
						className="card bg-white text-center mt-2 p-0"
					>
						<h5 className="card-header bg-primary text-white p-2 pl-3">
							{card && card.question}
						</h5>
						<div className="p-4 m-3 bg-white btn btn-white flip-content">
							<span style={{ fontStyle: "italic" }}>Click to show answer</span>
						</div>
					</div>
					{/* Card back */}
					<div
						onClick={handleFlip}
						className="card bg-white text-center mt-2 p-0"
					>
						<h5 className="card-header bg-primary text-white p-2 pl-3">
							{card && card.question}
						</h5>
						<div className="p-4 m-3 bg-white btn btn-white flip-content">
							{card && card.answer}
						</div>
					</div>
				</ReactCardFlip>
				{/* Card nav buttons */}
				<div className="card bg-primary text-white text-center mt-2 p-0">
					<div className="w-100 text-center">
						<button
							onClick={handleBack}
							className="btn btn-lg btn-primary w-50"
							style={{
								borderRight: "1px solid slateGray",
								borderRadius: "5px 0 0 5px",
							}}
						>
							&#9666; Back
						</button>
						<button
							onClick={handleNext}
							className="btn btn-lg btn-primary w-50"
							style={{
								borderLeft: "1px solid slateGray",
								borderRadius: "0 5px 5px 0",
							}}
						>
							Next &#9656;
						</button>
					</div>
					{card && (
						<>
							<button
								onClick={
									isFavorite() ? handleRemoveFavorite : handleAddFavorite
								}
								className="btn btn-lg btn-primary w-50"
								style={{
									borderRight: "1px solid slateGray",
									borderTop: "1px solid slateGray",
									borderRadius: "0 0 0 5px",
								}}
							>
								{isFavorite() ? (
									<>
										<span>&#10060;</span>Remove
									</>
								) : (
									<>
										<span>&#10004;</span>Favorite
									</>
								)}
							</button>
							<button
								onClick={toggleUpdateForm}
								disabled={!userId || userId !== card.createdBy._id}
								className={`btn btn-lg btn-primary w-50 ${
									!userId || userId !== card.createdBy._id ? "disabled-btn" : ""
								}`}
								style={{
									borderLeft: "1px solid slateGray",
									borderTop: "1px solid slateGray",
									borderRadius: "0 0 5px 0",
									cursor:
										!userId || userId !== card.createdBy._id
											? "not-allowed"
											: "pointer",
									opacity: !userId || userId !== card.createdBy._id ? 0.5 : 1,
								}}
							>
								Update<span>&#9999;</span>
							</button>
							{userId === card.createdBy._id && (
								<button
									onClick={handleDeleteCard}
									disabled={!userId || userId !== card.createdBy._id}
									className={`btn btn-lg btn-danger w-100 ${
										!userId || userId !== card.createdBy._id
											? "disabled-btn"
											: ""
									}`}
									style={{
										borderRadius: "0 0 5px 5px",
										borderTop: "1px solid slateGray",
										cursor:
											!userId || userId !== card.createdBy._id
												? "not-allowed"
												: "pointer",
										opacity: !userId || userId !== card.createdBy._id ? 0.5 : 1,
									}}
								>
									<span>&#128465;</span>Delete<span>&#128465;</span>
								</button>
							)}
						</>
					)}
				</div>
				{/* Update card */}
				{showUpdateForm && (
					<UpdateCardForm
						cardToUpdate={cardToUpdate}
						onUpdate={(updatedCard) => {
							setShowUpdateForm(false);
							setCardToUpdate(null);
						}}
						onCancel={() => {
							setShowUpdateForm(false);
							setCardToUpdate(null);
						}}
						userId={userId}
					/>
				)}
			</div>
		</>
	);
};

export default CardStack;
