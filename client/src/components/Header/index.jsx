import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import bannerLogo from "../../assets/logo.svg";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-primary text-light py-3 flex-row align-center nav-header">
      <div className="container flex-row justify-space-between-lg mt-5">
        <div>
          <Link to="/">
            <img src={bannerLogo} alt="RecallRocket banner logo" />
          </Link>
          <p className="m-0 text-white">
            Launching your knowledge to new heights!
          </p>
        </div>

        <div className="nav-btns m-0 mb-1">
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-md btn-white mr-2 nav-btn" to="/me">
                My Profile
              </Link>
              <Link
                className="btn btn-md btn-white mr-2 nav-btn"
                onClick={logout}
              >
                Logout
              </Link>
              <Link className="btn btn-md btn-white m-0 nav-btn" to="/about">
                About
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-md btn-white mr-2 nav-btn" to="/login">
                Login
              </Link>
              <Link className="btn btn-md btn-white mr-2 nav-btn" to="/signup">
                Signup
              </Link>
              <Link className="btn btn-md btn-white m-0 nav-btn" to="/about">
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
