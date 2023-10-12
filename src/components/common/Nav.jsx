import { useState, useEffect } from "react";
import Search from '../../assets/icon/c-vector-search.svg';
import "./Nav.scss";

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen, isSearchOpen]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  return (
    <header>
      <div className="navbar">
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="menu">
            <ul>
              <li>Accueil</li>
              <li>À propos</li>
              <li>Contact</li>
            </ul>
          </div>
        )}
        <div className="c-search-wrapper">
          <img src={Search} className="search-icon" onClick={toggleSearch} alt="Logo search"/>
          {isSearchOpen && (
            <div className="search">
              <input type="search" placeholder="Rechercher..." />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;