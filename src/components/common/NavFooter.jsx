import React from "react";
import { Link, useLocation } from "react-router-dom";
import House from "../../assets/icon/house.svg";
import ExploreIcon from "../../assets/icon/compass.svg";
import LibraryIcon from "../../assets/icon/books.svg";
import ProfileIcon from "../../assets/icon/user.svg";
import "./NavFooter.scss";

const NavFooter = () => {
  const location = useLocation();

  return (
    <div className="nav-footer-wrapper">
      <nav>
        <ul>
          <li>
            <Link to="/home" className={location.pathname === "/" ? "active" : ""}>
              <img src={House} alt="Home" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/explore"
              className={location.pathname === "/explore" ? "active" : ""}
            >
              <img src={ExploreIcon} alt="Explore" />
              <span>Explore</span>
            </Link>
          </li>
          <li>
            <Link
              to="/library"
              className={location.pathname === "/library" ? "active" : ""}
            >
              <img src={LibraryIcon} alt="Library" />
              <span>Library</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <img src={ProfileIcon} alt="Profile" />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavFooter;
