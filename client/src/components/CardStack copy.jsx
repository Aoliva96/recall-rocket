import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS, QUERY_FAVORITES } from "../utils/queries";
import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  UPDATE_USER_CARD,
} from "../utils/mutations";
import UpdateCardForm from "./UpdateCardForm";

const CardStack = ({ cards = [] }) => {
  const { concept: urlConcept } = useParams(); // Get concept from URL params

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const {
    loading: loadingCards,
    data: cardsData,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery(QUERY_CARDS, {
    variables: { concept: urlConcept },
  });

  const { loading: loadingFavorites, data: favoritesData } =
    useQuery(QUERY_FAVORITES);

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);
  const [updateCardMutation] = useMutation(UPDATE_USER_CARD);

  useEffect(() => {
    if (favoritesData && cards[currentIndex]) {
      const favorite = favoritesData.favorites.find(
        (fav) => fav.card._id === cards[currentIndex]._id
      );
      setFavoriteId(favorite ? favorite._id : null);
    }
  }, [favoritesData, cardsData, currentIndex]);
  console.log(cardsData);

  if (loadingCards || loadingFavorites) {
    return <div>Loading...</div>;
  }

  // Handle case where cardsData is not yet defined or does not have cards
  if (!cardsData || !cardsData.cards || cardsData.cards.length === 0) {
    return <div>No cards found for this concept.</div>;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cardsData.cards.length);
    setShowAnswer(false);
  };

  const handleBack = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + cardsData.cards.length) % cardsData.cards.length
    );
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  const card = cardsData.cards[currentIndex];

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

  const toggleUpdateForm = (card) => {
    setSelectedCard(card);
    setShowUpdateForm(true);
  };

  const handleUpdateCard = async (updatedCard) => {
    try {
      const { data } = await updateCardMutation({
        variables: {
          cardId: updatedCard._id,
          concept: updatedCard.concept,
          question: updatedCard.question,
          answer: updatedCard.answer,
        },
      });

      if (data?.updateUserCard) {
        await refetchCards(); // Refetch cards after update
        setShowUpdateForm(false);
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  return (
    <div className="my-3">
      {card && showUpdateForm && selectedCard && (
        <UpdateCardForm
          card={selectedCard}
          onUpdate={handleUpdateCard}
          onCancel={() => setShowUpdateForm(false)}
        />
      )}
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
            onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        )}
        <button onClick={() => toggleUpdateForm(card)}>Update</button>
      </div>
    </div>
  );
};

export default CardStack;
