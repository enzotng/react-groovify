import { Link, Routes, Route, useOutlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useUserContext } from "../config/UserContext";
import ChangerImage from "../../assets/icon/pencil.svg";
import Logout from "../../assets/icon/logout.svg";
import Dashboard from "./dashboard/Dashboard";
import Notification from "./notification/Notification";
import Audio from "./audio/Audio.jsx";
import Security from "./security/Security.jsx";
import ToggleSwitch from "../common/toogleSwitch/ToggleSwitch.jsx"
import Language from "./language/Language.jsx";
import { Camera, CameraResultType } from '@capacitor/camera';
import "./Profile.scss";

const Profile = () => {
  const { userProfile, setUserProfile, profileImage, setProfileImage } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  const outlet = useOutlet();

  const location = useLocation();

  const isSubPage = location.pathname.includes("dashboard") ||
    location.pathname.includes("notification") ||
    location.pathname.includes("audio") ||
    location.pathname.includes("security") ||
    location.pathname.includes("language");

  if (!userProfile) {
    return <p>Loading profile...</p>;
  }

  const takePhoto = async () => {
    try {
        const cameraResult = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Uri
        });

        setProfileImage(cameraResult.webPath);
    } catch (error) {
        console.error('Erreur lors de la prise de la photo:', error);
    }
};


  return (
    <main>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notification" element={<Notification />} />
        <Route path="audio" element={<Audio />} />
        <Route path="security" element={<Security />} />
        <Route path="language" element={<Language />} />
      </Routes>
      {outlet}
      {!isSubPage && (
        <div className="profile-wrapper">
          <div className="heading-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="11.2%" stopColor="rgb(78, 62, 255)" />
                  <stop offset="91.1%" stopColor="rgb(164, 69, 255)" />
                </linearGradient>
              </defs>
              <path
                fill="url(#gradient)"
                d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z"
              ></path>
            </svg>
            <h1>Welcome back, {userProfile.display_name}</h1>
          </div>
          <div className="profile-container">
            <div className="profile-infos-wrapper">
              <div className="profile-image-wrapper">
                <img id="image-profile" src={profileImage || userProfile.images[1]?.url} alt={`Image profil de ${userProfile.display_name}`}/>
                <button onClick={takePhoto}>
                  <img src={ChangerImage} alt="Changer Image" />
                </button>
              </div>
              <div className="profile-infos-text">
                <p>{userProfile.display_name}</p>
                <p>{userProfile.email}</p>
              </div>
              <div className={userProfile.product === 'premium' ? 'profile-product-premium' : 'profile-product-other'}>
                <p>
                  {userProfile.product}
                </p>
              </div>
            </div>
            <div className="profile-settings">
              <ul>
                <li className="profile">
                  <Link to="dashboard">Profile</Link>
                </li>
                <li className="notification">
                  <Link to="notification">Notification(s)</Link>
                </li>
                <li className="audio">
                  <Link to="audio">Audio & Video</Link>
                </li>
                <li className="security">
                  <Link to="security">Security</Link>
                </li>
                <li className="language">
                  <Link to="language">
                    Language<span>English (UK)</span>
                  </Link>
                </li>
              </ul>
              <ToggleSwitch />
            </div>
            <button onClick={handleLogout}>
            <img src={Logout} alt="Logout" />
            Log off
            </button>
          </div>
        </div>
      )}
      <div className="legal-infos">
        <p>Version 1.0.5</p>
        <p>© Groovify</p>
      </div>
    </main>
  );
};

export default Profile;
