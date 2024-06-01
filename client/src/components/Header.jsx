import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import bannerLogo from "../assets/logo.svg";

const Header = () => {
  // Logout function
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  // Check device width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth < 992
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
      setIsTablet(window.innerWidth > 768 && window.innerWidth < 992);
      setIsMobile(window.innerWidth < 768);
    };

    // Add/remove event listener as needed
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-primary text-light py-3 flex-row align-center nav-header">
      <div
        className={
          isDesktop
            ? "container flex-row justify-space-between mt-5"
            : "container flex-column align-center mt-5"
        }
      >
        <div>
          <Link to="/">
            <img src={bannerLogo} alt="RecallRocket banner logo" />
          </Link>
          <p className="m-0 text-white">
            Launching your knowledge to new heights!
          </p>
        </div>

        <div
          className={isDesktop ? "nav-btns m-0 mb-1" : "nav-btns m-0 mb-1 mt-3"}
        >
          {Auth.loggedIn() ? (
            <>
              <Link
                className="btn btn-md mobile btn-white mr-2 nav-btn"
                to="/me"
              >
                My Profile
              </Link>
              <Link
                className="btn btn-md mobile btn-white mr-2 nav-btn"
                onClick={logout}
              >
                Logout
              </Link>
              <Link
                className="btn btn-md mobile btn-white m-0 nav-btn"
                to="/about"
              >
                About
              </Link>
            </>
          ) : (
            <>
              <Link
                className="btn btn-md mobile btn-white mr-2 nav-btn"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="btn btn-md mobile btn-white mr-2 nav-btn"
                to="/signup"
              >
                Signup
              </Link>
              <Link
                className="btn btn-md mobile btn-white m-0 nav-btn"
                to="/about"
              >
                About
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
