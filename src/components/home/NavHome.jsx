import { useState, useEffect } from "react";
import "./NavHome.scss";
import { Link } from "react-router-dom";
import { useUserContext } from "../config/UserContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { userProfile, profileImage } = useUserContext();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getGreetingMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning 👋";
    } else if (hours < 18) {
      return "Good Afternoon 👋";
    } else {
      return "Good Evening 👋";
    }
  };  

  return (
    <header style={{ borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "none" }}>
      <nav className="navbar">
        <div className="navbar-user">
          <img
            className="navbar-logo"
            src={profileImage || (userProfile?.images?.length > 1 ? userProfile.images[1].url : "default-profile-image-url")}
            alt={`Profil de ${userProfile?.display_name || "Utilisateur"}`}
          />
          <div className="navbar-user-text">
            <p className="thin">{getGreetingMessage()}</p>
            <p className="gras">
              {userProfile ? userProfile.display_name : "Loading profile..."}
            </p>
          </div>
        </div>

        <div className="navbar-icon-wrapper">
          <Link className="notification-icon" to="/profile/notification">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1ZM35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Zm186.1,103.94A16,16,0,0,1,208,200H167.2a40,40,0,0,1-78.4,0H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM150.62,200H105.38a24,24,0,0,0,45.24,0ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z"></path>
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
