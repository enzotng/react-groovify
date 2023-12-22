import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../config/UserContext";
import ArrowBack from "../../../assets/icon/arrow-back.svg";

import "./Notification.scss";

const Notification = () => {
  const { userProfile } = useUserContext();
  const accessToken = userProfile ? userProfile.accessToken : null;
  const [activeTab, setActiveTab] = useState("Albums");
  const [latestAlbums, setLatestAlbums] = useState([]);
  const [latestSingles, setLatestSingles] = useState([]);
  const [latestCompilations, setLatestCompilations] = useState([]);

  useEffect(() => {
    if (accessToken) {
      fetchNewReleases(accessToken).then(data => {
        setLatestAlbums(data.filter(item => item.album_type === "album"));
        setLatestSingles(data.filter(item => item.album_type === "single"));
        setLatestCompilations(data.filter(item => item.album_type === "compilation"));
      });
    }
  }, [accessToken]);

  async function fetchNewReleases(token) {
    const url = 'https://api.spotify.com/v1/browse/new-releases';
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.albums.items;
    } catch (error) {
      console.error("Error fetching new releases:", error);
      return [];
    }
  }

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
            className={activeTab === "Albums" ? "active" : ""}
            onClick={() => setActiveTab("Albums")}
          >
            Albums
          </button>
          <button
            className={activeTab === "Singles" ? "active" : ""}
            onClick={() => setActiveTab("Singles")}
          >
            Singles
          </button>
          <button
            className={activeTab === "Compilations" ? "active" : ""}
            onClick={() => setActiveTab("Compilations")}
          >
            Compilations
          </button>
        </div>
        <div className="tabs-content-wrapper">
          {activeTab === "Albums" && (
            <div className="notification-wrapper-item">
              {latestAlbums.map((album, index) => (
                <div key={index} className="notification-item">
                  <img src={album.images[0].url} alt={album.name} />
                  <div className="notification-info">
                    <p className="notification-name">{album.name}</p>
                    <p className="notification-artist">{album.artists.map(artist => artist.name).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Singles" && (
            <div className="notification-wrapper-item">
              {latestSingles.map((single, index) => (
                <div key={index} className="notification-item">
                  <img src={single.images[0].url} alt={single.name} />
                  <div className="notification-info">
                    <p className="notification-name">{single.name}</p>
                    <p className="notification-artist">{single.artists.map(artist => artist.name).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Compilations" && (
            <div className="notification-wrapper-item">
              {latestCompilations.map((compilation, index) => (
                <div key={index} className="notification-item">
                  <img src={compilation.images[0].url} alt={compilation.name} />
                  <div className="notification-info">
                    <p className="notification-name">{compilation.name}</p>
                    <p className="notification-artist">{compilation.artists.map(artist => artist.name).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;