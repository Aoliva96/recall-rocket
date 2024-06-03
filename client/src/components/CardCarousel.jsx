import React, { useState, useEffect } from "react";
import ExpandableNav from "../components/ExpandableNav";
import ReactCardFlip from "react-card-flip";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS, QUERY_FAVORITES } from "../utils/queries";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../utils/mutations";

const CardCarousel = ({ cards, concept }) => {
  const { concept: urlConcept } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteId, setFavoriteId] = useState(null);
  const [localCards, setLocalCards] = useState([]);

  const { loading, data, error } = useQuery(QUERY_CARDS, {
    variables: { concept: urlConcept },
  });

  const { loading: loadingFavorites, data: favoritesData } =
    useQuery(QUERY_FAVORITES);

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

  // Check device width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    // Add/remove event listener as needed
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // React card flip
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Set card content
  useEffect(() => {
    if (data) {
      setLocalCards(data.cards);
    }
  }, [loading, data, error, urlConcept]);

  useEffect(() => {
    if (favoritesData && favoritesData.favorites && localCards[currentIndex]) {
      const favorite = favoritesData.favorites.find(
        (fav) => fav.card._id === localCards[currentIndex]._id
      );
      setFavoriteId(favorite ? favorite._id : null);
    } else {
      setFavoriteId(null); // Reset favoriteId if there are no favorites
    }
  }, [favoritesData, localCards, currentIndex]);

  console.log("Current Index:", currentIndex);
  console.log("Favorite ID:", favoriteId);

  // Check for loading or no cards
  if (loading || loadingFavorites) {
    return <div>Loading...</div>;
  }
  if (!localCards || localCards.length === 0) {
    return <div>No cards found.</div>;
  }

  // Handle next and back buttons
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % localCards.length);
    setIsFlipped(false);
  };
  const handleBack = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + localCards.length) % localCards.length
    );
    setIsFlipped(false);
  };
  const card = localCards[currentIndex];

  // Format concept name for display
  const capitalizedConcept =
    card.concept.charAt(0).toUpperCase() + card.concept.slice(1);
  let cardConcept;
  if (capitalizedConcept === "Mongo") {
    cardConcept = "MongoDB";
  } else {
    cardConcept = `${capitalizedConcept}.js`;
  }

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
    <>
      <div className={isDesktop ? "col-6" : "col-12"}>
        {/* Card concept */}
        <div className="card bg-primary text-white text-center mt-2 px-0 pt-2 pb-1">
          <h4>{cardConcept}</h4>
        </div>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          {/* Card front */}
          <div
            onClick={handleFlip}
            className="card bg-white text-center mt-2 p-0"
          >
            <h5 className="card-header bg-primary text-white p-2 pl-3">
              {card.question}
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
              {card.question}
            </h5>
            <div className="p-4 m-3 bg-white btn btn-white flip-content">
              {card.answer}
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
                  borderLeft: "1px solid slateGray",
                  borderRadius: "0 5px 5px 0",
                }}
              >
                {isFavorite() ? (
                  <>
                    <span>&#10060;</span>Remove from Favorites
                    <span>&#10060;</span>
                  </>
                ) : (
                  <>
                    <span>&#10004;</span>Add to Favorites<span>&#10004;</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {/* ExpandableNav for mobile */}
      <ExpandableNav />
    </>
  );
};

export default CardCarousel;
