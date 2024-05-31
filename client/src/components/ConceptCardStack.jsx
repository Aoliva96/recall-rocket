import React from "react";
import { Link } from "react-router-dom";

const ConceptCardStack = ({ concept }) => {
  const capitalizedConcept = concept.charAt(0).toUpperCase() + concept.slice(1);
  let cardConcept;
  if (capitalizedConcept === "Mongo") {
    cardConcept = "MongoDB";
  } else {
    cardConcept = `${capitalizedConcept}.js`;
  }

  return (
    <div
      className="card bg-primary mt-2 mx-2 text-center"
      style={{ height: "200px", width: "23%" }}
    >
      <h4 className="bg-primary text-white mt-3">{cardConcept}</h4>
      <div className="card-body mx-2">
        <div className="display-flex justify-center align-center mt-5">
          <Link className="start-btn" to={`/quiz/${concept}`}></Link>
        </div>
      </div>
    </div>
  );
};

export default ConceptCardStack;
