import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import bannerLogo from "../../assets/logo.svg";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center nav-header">
      <div className='nav-btns '>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-info m-2 nav-btn " to="/me">
                {Auth.getProfile().data.username}'s profile
              </Link>
              <button className="btn btn-lg btn-light m-2 nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className='nav-btns m-0 '>
              <Link className=" nav-btn  m-1 " to="/login">
                Login 
              </Link>
              <p class='nav-btn'> | </p>
              <Link className=" nav-btn  m-1 " to="/signup">
                Signup 
              </Link>
              <p class='nav-btn'> | </p>
              <Link className="nav-btn   m-1 " to="/leaderboard">
                Leaderboard
              </Link>
              <p class='nav-btn'> | </p>
              <Link className=" nav-btn  m-1 " to="/about">
                About
              </Link>
            </div>
          )}
        </div>
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        
        <div>
          <Link to="/">
            <img src={bannerLogo} alt="RecallRocket banner logo" />
          </Link>
          <p className="m-0">Launching your knowledge to new heights!</p>
        </div>
        
        <div>
          
        </div>
        
      </div>
      
    
    </header>
  );
};

export default Header;
