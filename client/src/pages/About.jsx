import React from "react";
import { Link } from "react-router-dom";
import ExpandableNav from "../components/ExpandableNav";

const About = () => {
  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="card bg-white mt-2">
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            About us
          </h4>
          <div className="card-body mx-2">
            <div className="display-flex align-center">
              <h4>Title</h4>
            </div>
            <hr className="mb-3" />
            <p>Text placeholder</p>
            <h4>Title 2</h4>
            <hr className="mb-3" />
            <p>Text placeholder</p>
            <h4>Title 3</h4>
            <hr className="mb-3" />
            <p>Text placeholder</p>
          </div>
        </div>
      </div>
      {/* ExpandableNav for mobile */}
      <ExpandableNav />
    </>
  );
};

export default About;
