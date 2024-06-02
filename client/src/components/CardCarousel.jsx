import React, { useState, useEffect } from "react";
import ExpandableNav from "../components/ExpandableNav";
import ReactCardFlip from "react-card-flip";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_CARDS } from "../utils/queries";

const CardCarousel = ({ cards, concept }) => {
  const { concept: urlConcept } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Check for loading or no cards
  if (loading) {
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
        </div>
      </div>
      {/* ExpandableNav for mobile */}
      <ExpandableNav />
    </>
  );
};

export default CardCarousel;
