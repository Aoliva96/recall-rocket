import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS, QUERY_FAVORITES } from "../utils/queries";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../utils/mutations";

const CardStack = ({ cards = [] }) => {
  const { concept: urlConcept } = useParams(); // Get concept from URL params

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const {
    loading: loadingCards,
    data: cardsData,
    error: cardsError,
  } = useQuery(QUERY_CARDS, {
    variables: { concept: urlConcept },
  });

  const { loading: loadingFavorites, data: favoritesData } =
    useQuery(QUERY_FAVORITES);

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

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
      const { data } = await addFavorite({
        variables: {
          cardId: card._id,
        },
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
      });
      setFavoriteId(null);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const isFavorite = () => favoriteId !== null;

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
