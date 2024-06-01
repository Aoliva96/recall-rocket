import React from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import ExpandableNav from "../components/ExpandableNav";

const ConceptCardStack = ({ concept }) => {
  // Capitalize the first letter of the concept
  const capitalizedConcept = concept.charAt(0).toUpperCase() + concept.slice(1);
  let cardConcept;
  if (capitalizedConcept === "Mongo") {
    cardConcept = "MongoDB";
  } else {
    cardConcept = `${capitalizedConcept}.js`;
  }

  return (
    <Link
      to={`/quiz/${concept}`}
      className="card card-mobile card-link mt-2 mx-2 text-center"
      style={{ height: "200px", width: "23%" }}
    >
      <h4 className="mt-3" style={{ textDecoration: "none" }}>
        {cardConcept}
      </h4>
      <div className="card-body">
        <div className="display-flex justify-space-around align-center mt-5">
          <div className="start-btn"></div>
        </div>
      </div>
    </Link>
  );
};

export default ConceptCardStack;
