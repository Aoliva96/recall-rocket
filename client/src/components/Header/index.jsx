import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import bannerLogo from "../../assets/logo.svg";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-primary text-light py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link to="/">
            <img src={bannerLogo} alt="RecallRocket banner logo" />
          </Link>
          <p className="m-0">Launching your knowledge to new heights!</p>
        </div>
      </div>
      <div className="nav-btns container flex-row align-center justify-end">
        {Auth.loggedIn() ? (
          <>
            <Link className="btn btn-lg btn-info m-2 nav-btn " to="/me">
              {Auth.getProfile().data.username}'s profile
            </Link>
            <button
              className="btn btn-lg btn-light m-2 nav-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="nav-btns">
            <Link className="nav-btn btn" to="/login">
              Login
            </Link>
            <Link className="nav-btn btn" to="/signup">
              Signup
            </Link>
            <Link className="nav-btn btn" to="/leaderboard">
              Leaderboard
            </Link>
            <Link className="nav-btn btn" to="/about">
              About
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
