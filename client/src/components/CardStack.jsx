import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS, QUERY_FAVORITES } from "../utils/queries";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../utils/mutations";
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
  } = useQuery(QUERY_CARDS, {
    variables: { concept: urlConcept },
  });

  const { loading: loadingFavorites, data: favoritesData } =
    useQuery(QUERY_FAVORITES);

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

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

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
    setCardToUpdate(card); // Set the cardToUpdate to the current card
  };

  return (
    <>
      <div>
        {/* Card concept */}
        <div className="card bg-primary text-white text-center mt-2 px-0 pt-2 pb-1">
          <h4>{card && card.concept}</h4>
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
                    <span>&#10004;</span>Add to Favorites<span>&#10004;</span>
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
            </>
          )}
        </div>

        {showUpdateForm && (
          <UpdateCardForm
            cardToUpdate={cardToUpdate} // Pass the cardToUpdate state
            onUpdate={(updatedCard) => {
              // Implement update logic here
              console.log("Updated card:", updatedCard);
              setShowUpdateForm(false); // Close the update form after updating
              setCardToUpdate(null); // Reset cardToUpdate after updating
            }}
            onCancel={() => {
              setShowUpdateForm(false); // Close the update form on cancel
              setCardToUpdate(null); // Reset cardToUpdate on cancel
            }}
            userId={userId} // Pass the user ID to the update form
          />
        )}
      </div>
    </>
  );
};

export default CardStack;
