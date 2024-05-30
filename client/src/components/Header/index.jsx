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
      <div className="nav-btns mb-5">
        {Auth.loggedIn() ? (
          <>
            <Link className="btn btn-md btn-white mx-2 nav-btn" to="/me">
              My Profile
            </Link>
            <button
              className="btn btn-md btn-white mx-2 nav-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-md btn-white mx-2 nav-btn" to="/login">
              Login
            </Link>
            <Link className="btn btn-md btn-white mx-2 nav-btn" to="/signup">
              Signup
            </Link>
            <Link className="btn btn-md btn-white mx-2 nav-btn" to="/about">
              About
            </Link>
          </>
        )}
      </div>
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link to="/">
            <img src={bannerLogo} alt="RecallRocket banner logo" />
          </Link>
          <p className="m-0 text-white">
            Launching your knowledge to new heights!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
