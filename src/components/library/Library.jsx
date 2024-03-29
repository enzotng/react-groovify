import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import PauseButton from "../../assets/icon/pause.svg";
import Play from "../../assets/icon/play.svg";
import LibraryDetails from "./LibraryDetails";
import "./Library.scss";

const Library = () => {
  const { userProfile } = useUserContext();
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [playingPlaylistUri, setPlayingPlaylistUri] = useState(null);
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/library/details/${playlistId}`);
  };

  const fetchPlaylists = async () => {
    if (!userProfile || !userProfile.accessToken) {
      console.log("AccessToken not found. User needs to login.");
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${userProfile.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des playlists:", error);
    }
  };

  useEffect(() => {
    console.log("Library component mounted");
    if (userProfile && userProfile.accessToken) {
      fetchPlaylists();
    }
  }, [userProfile]);

  const handleSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
  };  

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredPlaylists =
    playlists.length > 0
      ? playlists
          .filter((playlist) =>
            playlist.name.toLowerCase().includes(searchTerm)
          )
          .sort((a, b) => {
            if (sortOrder === "name") {
              return a.name.localeCompare(b.name);
            }
            return 0;
          })
      : [];

  if (!playlists) {
    return <main>Loading playlists...</main>;
  }

  const playPlaylist = async (playlistUri) => {
    if (!userProfile || !userProfile.accessToken) {
      console.log("AccessToken not found. User needs to login.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userProfile.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ context_uri: playlistUri }),
        }
      );
      setPlayingPlaylistUri(playlistUri);
      if (!response.ok) {
        throw new Error("Failed to start playback");
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la playlist:", error);
    }
  };

  return (
    <main>
      <div className="library-wrapper">
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
          <h1>Your library</h1>
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search a playlist..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchTerm && (
            <svg
              className="clear-input"
              onClick={() => handleSearchChange("")}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          )}
        </div>
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="default">Relevance</option>
          <option value="name">Sort by name (A to Z)</option>
        </select>
        <div className="playlist-wrapper">
          {filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-content">
              <div
                className="playlist-list"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <img
                  src={playlist.images[0]?.url}
                  alt={`${playlist.name} cover`}
                />
                <p>{playlist.name}</p>
              </div>
              <button
                className="cta-bouton"
                onClick={(e) => {
                  e.stopPropagation();
                  playPlaylist(playlist.uri);
                }}
              >
              <img 
                src={playingPlaylistUri === playlist.uri ? PauseButton : Play} 
                alt={playingPlaylistUri === playlist.uri ? 'Pause' : 'Play'} 
              />
              </button>
            </div>
          ))}
          {selectedPlaylistId && (
            <LibraryDetails playlistId={selectedPlaylistId} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Library;
