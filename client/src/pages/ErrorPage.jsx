import React from "react";
import { useRouteError } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import errorLogo from "../assets/404.svg";
import ExpandableNav from "../components/ExpandableNav";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Header />
      <main className="container col-12 flex-row text-center justify-center p-5">
        <div id="error-page">
          <div className="card bg-primary text-white mt-2 py-1">
            <h1>Oops!</h1>
          </div>
          <img src={errorLogo} alt="Error image" />
          <div className="card bg-primary text-white mt-2 p-3">
            <p>Looks like we encountered an unexpected issue.</p>
            <h3 className="text-danger">
              Error: {error.status} {error.statusText || error.message}
            </h3>
          </div>
        </div>
        {/* ExpandableNav for mobile */}
        <ExpandableNav />
      </main>
      <Footer />
    </>
  );
}
