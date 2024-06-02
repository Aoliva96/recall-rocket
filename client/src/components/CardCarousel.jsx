import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";

const CardCarousel = ({ cards, concept }) => {
  const { concept: urlConcept } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [localCards, setLocalCards] = useState([]);

  const { loading, data, error } = useQuery(QUERY_CARDS, {
    variables: { concept: urlConcept },
  });

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

  useEffect(() => {
    if (data) {
      setLocalCards(data.cards);
    }
  }, [loading, data, error, urlConcept]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!localCards || localCards.length === 0) {
    return <div>No cards found.</div>;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % localCards.length);
    setShowAnswer(false);
  };

  const handleBack = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + localCards.length) % localCards.length
    );
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
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

  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="card bg-primary text-white text-center mt-2 px-0 pt-2 pb-1 col-6">
          <h4>{cardConcept}</h4>
        </div>
        <div
          className={
            isDesktop
              ? "card bg-white text-center mt-2 p-0 col-6"
              : "card bg-white text-center mt-2 p-0 col-12"
          }
        >
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            {card.question}
          </h4>
          <div className="card-body m-2">
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
          <div className="w-100 text-center">
            <button
              onClick={handleBack}
              className="btn btn-lg btn-primary w-50"
              style={{
                borderRadius: "0 0 0 5px",
                borderRight: "1px solid slateGray",
              }}
            >
              &#9666; Back
            </button>
            <button
              onClick={handleNext}
              className="btn btn-lg btn-primary w-50"
              style={{ borderRadius: "0 0 5px 0" }}
            >
              Next &#9656;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCarousel;
