import { useState, useEffect } from 'react';
import { useUserContext } from "../../config/UserContext";
import ArrowBack from "../../../assets/icon/arrow-back.svg";
import { Link } from "react-router-dom";

import "./Notification.scss";

const Notification = () => {
  const { userProfile } = useUserContext();
  const accessToken = userProfile?.accessToken;
  const [activeTab, setActiveTab] = useState("Songs");

  return (
    <div className="notification-wrapper">
      <div className="heading-wrapper">
        <Link to="/home">
          <img src={ArrowBack} alt="Icone Arrow" />
        </Link>
        <h1>Notification(s)</h1>
      </div>
      <div className="notification-content">
        <div className="tabs">
          <button
            className={activeTab === "Songs" ? "active" : ""}
            onClick={() => setActiveTab("Songs")}
          >
            Songs
          </button>
          <button
            className={activeTab === "Podcasts" ? "active" : ""}
            onClick={() => setActiveTab("Podcasts")}
          >
            Podcasts
          </button>
        </div>

        <div className="tabs-content-wrapper">
          <div className={`tab-content ${activeTab}`}>
            <div className="songs">
              <h2>Songs</h2>
            </div>
            <div className="podcasts">
              <h2>Podcasts</h2>
            </div>
          </div>
        </div>      </div>
    </div>
  );
};

export default Notification;
