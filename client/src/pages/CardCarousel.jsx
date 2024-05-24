// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useState } from "react";

// import CommentList from '../components/CommentList';
// import CommentForm from '../components/CommentForm';

// import { QUERY_SINGLE_CARD } from "../utils/queries";

const CardCarousel = () => {
	// Use `useParams()` to retrieve value of the route parameter `:profileId`
	const { cardId } = useParams();
	const [currentIndex, setCurrentIndex] = useState(0);

	// const { loading, data } = useQuery(QUERY_SINGLE_CARD, {
	// 	// pass URL parameter
	// 	variables: { cardId: cardId },
	// });
	const sampleCards = [
		{
			_id: 1,
			cardText: "What is the capital of France?",
			cardAnswer: "Paris",
			cardCategory: "Geography",
		},
		{
			_id: 2,
			cardText: "What is the capital of Germany?",
			cardAnswer: "Berlin",
			cardCategory: "Geography",
		},
		{
			_id: 3,
			cardText: "What is the color of the sky?",
			cardAnswer: "Blue",
			cardCategory: "Science",
		},
	];
	// const card = data?.card || {};
	const card = sampleCards[currentIndex];

	function handleNext() {
		setCurrentIndex((currentIndex + 1) % sampleCards.length);
	}

	function handleBack() {
		setCurrentIndex(
			(currentIndex - 1 + sampleCards.length) % sampleCards.length
		);
	}

	// if (loading) {
	// 	return <div>Loading...</div>;
	// }
	return (
		<div className="my-3">
			<h3 className="card-header bg-dark text-light p-2 m-0">
				{card.cardAnswer} <br />
				<span style={{ fontSize: "1rem" }}>
					had this card on {card.cardCategory}
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
					{card.cardText}
				</blockquote>
			</div>
			<button onClick={handleBack}>Back</button>
			<button onClick={handleNext}>Next</button>

			{/* <div className="my-5">
        <CommentList comments={card.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm cardId={card._id} />
      </div> */}
		</div>
	);
};

export default CardCarousel;
