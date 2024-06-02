import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../utils/mutations";

const CardStack = ({ cards = [] }) => {
  const { concept: urlConcept } = useParams(); // Get concept from URL params

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

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
    if (isFavorite()) {
      alert("This card is already in your favorites.");
      return;
    }
    try {
      const response = await addFavorite({
        variables: {
          cardId: card._id,
        },
        update: (cache, { data: { addFavorite } }) => {
          // Update cache after adding favorite
          setFavoriteId(addFavorite._id);
        },
      });
      console.log("Add favorite mutation response:", response); // Log addFavorite response
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const response = await removeFavorite({
        variables: {
          favoriteId: favoriteId, // Use the favoriteId state
        },
        update: () => {
          // Update cache after removing favorite
          setFavoriteId(null);
        },
      });
      console.log("Remove favorite mutation response:", response); // Log removeFavorite response
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const isFavorite = () => {
    const favoriteStatus =
      card &&
      card.favorites &&
      card.favorites.some((fav) => fav.card._id === card._id);
    if (favoriteStatus) {
      const fav = card.favorites.find((fav) => fav.card._id === card._id);
      setFavoriteId(fav._id);
    }
    return favoriteStatus;
  };

  console.log("Card:", card);

  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        <span style={{ fontSize: "1rem" }}>
          This card is about {card && card.concept}
        </span>
        <br />
        {card && card.question}
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
          {showAnswer ? card && card.answer : "Click to reveal the answer"}
        </blockquote>
      </div>

      <button onClick={handleBack}>Back</button>
      <button onClick={handleNext}>Next</button>
      <div>
        {card && (
          <button
            onClick={isFavorite() ? handleRemoveFavorite : handleAddFavorite}
          >
            {isFavorite() ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardStack;
