import React from "react";
import { Link } from "react-router-dom";

const CardStack = ({ cards, title, showTitle = true, showUsername = true }) => {
  console.log(`CardStack received cards: `, cards);
  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {cards.map((card) => (
        <div key={card._id} className="card mb-3">
          <h4 className="card-header bg-primary text-light p-2 m-0">
            {showUsername ? (
              <Link className="text-light" to={`/profiles/${card.cardAuthor}`}>
                {card.cardAuthor} <br />
                <span style={{ fontSize: "1rem" }}>
                  had this card on {card.createdAt}
                </span>
              </Link>
            ) : (
              <>
                <span style={{ fontSize: "1rem" }}>
                  You had this card on {card.createdAt}
                </span>
              </>
            )}
          </h4>
          <div className="card-body bg-light p-2">
            <p>{card.cardText}</p>
          </div>
          <Link
            className="btn btn-primary btn-block btn-squared"
            to={`/cards/${card._id}`}
          >
            Join the discussion on this card.
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CardStack;
