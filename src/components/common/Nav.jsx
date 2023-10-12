import React, { useState } from 'react';
import Enzo from '../../assets/imgs/enzo.png';
import Search from '../../assets/icon/c-vector-search.svg';
import './Nav.scss';

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-user">
          <img className="navbar-logo" src={Enzo} alt="Logo" />
          <div className="navbar-user-text">
            <p className="thin">Good Morning 👋</p>
            <p className="gras">Enzo Tang</p>
          </div>
        </div>

        <div className="navbar-icon-wrapper">
          <div className="search-container">
            <svg onClick={() => setIsSearchVisible(!isSearchVisible)} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
            {isSearchVisible && (
              <input
                className="search-input"
                type="text"
                placeholder="Rechercher..."
              />
            )}
          </div>

          <a className="notification-icon" href="/notifications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1ZM35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Zm186.1,103.94A16,16,0,0,1,208,200H167.2a40,40,0,0,1-78.4,0H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM150.62,200H105.38a24,24,0,0,0,45.24,0ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z"></path></svg>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;