import React from "react";
import { useRouteError } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header/index.jsx";
import Footer from "../components/Footer/index.jsx";
import errorLogo from "../assets/404.svg";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Header />
      <main>
        <div className="flex-row text-center justify-center">
          <div className="col-12 col-md-8 p-5 m-5">
            <div id="error-page">
              <h1>Oops!</h1>
              <img src={errorLogo} alt="Error image" style={{ width: "50%" }} />
              <p className="mt-3">
                Looks like we encountered an unexpected issue.
              </p>
              <h3>
                Error: {error.status} {error.statusText || error.message}
              </h3>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
