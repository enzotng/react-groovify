import React, { useState, useEffect } from "react";
import { useUserContext } from "../../config/UserContext";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import AjouterPlaylist from "../../../assets/icon/list-plus.svg";
import JouerBlindtest from "../../../assets/icon/play-circle.svg";
import "./BlindTest.scss";

const BlindTest = () => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [popupAnimation, setPopupAnimation] = useState("");
  const { userProfile } = useUserContext();
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentTrackForPlayer, setCurrentTrackForPlayer] = useState(null);
  const [titleChoices, setTitleChoices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const randomWords = [
    "Love",
    "Dream",
    "Dance",
    "Night",
    "Heart",
    "Star",
    "Sky",
    "Light",
    "Shadow",
    "Journey",
    "Ocean",
    "Fire",
    "Rain",
    "Wind",
    "Echo",
    "Silence",
    "Rhythm",
    "Wave",
    "Smile",
    "Tears",
    "Sunrise",
    "Twilight",
    "Memory",
    "Whisper",
    "Harmony",
    "Mystery",
    "Vision",
    "Desire",
    "Destiny",
    "Freedom",
  ];
  const [hasLost, setHasLost] = useState(false);
  const accessToken = userProfile?.accessToken;

  const addPlaylist = (playlist) => {
    if (!selectedPlaylists.some((p) => p.id === playlist.id)) {
      setSelectedPlaylists([...selectedPlaylists, playlist]);
    }
  };

  const fetchTracksFromPlaylists = async () => {
    const allTracks = [];
    for (const playlist of selectedPlaylists) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      allTracks.push(...data.items.map((item) => item.track));
    }
    return shuffleArray(allTracks);
  };

  const playTracks = async (trackUris) => {
    if (!accessToken) return;

    try {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });
    } catch (error) {
      console.error("Erreur lors de la lecture des pistes :", error);
    }
  };

  const controlPlayback = async (action) => {
    let endpoint;
    let method = "PUT";

    switch (action) {
      case "play":
      case "pause":
        endpoint = `https://api.spotify.com/v1/me/player/${action}`;
        break;
      default:
        console.error("Action non reconnue:", action);
        return;
    }

    try {
      await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: method === "PUT" ? JSON.stringify({}) : null,
      });
    } catch (error) {
      console.error("Erreur lors du contrôle de la lecture:", error);
    }
  };

  const startGame = async () => {
    const tracks = await fetchTracksFromPlaylists();
    if (tracks.length > 0) {
      const validTracks = tracks.filter((track) => track && track.uri);

      if (validTracks.length > 0) {
        const trackUris = validTracks.map((track) => track.uri);
        playTracks(trackUris);
        setCurrentTrackForPlayer(validTracks[0]);
        generateTitleChoices(validTracks[0]);
        setTimeout(() => {
          controlPlayback("pause");
          setShowOverlay(true);
          setTimeLeft(10);
          setHasLost(false);
        }, 10000);
      } else {
        console.error(
          "Aucune piste valide trouvée dans les playlists sélectionnées."
        );
      }
    }
  };

  const generateFakeTitles = (realTitle) => {
    const titleLength = realTitle.split(" ").length;
    const fakeTitles = [];
    for (let i = 0; i < 3; i++) {
      let fakeTitle = "";
      for (let j = 0; j < titleLength; j++) {
        fakeTitle +=
          randomWords[Math.floor(Math.random() * randomWords.length)] + " ";
      }
      fakeTitles.push(fakeTitle.trim());
    }
    return fakeTitles;
  };

  const generateTitleChoices = (currentTrack) => {
    const fakeTitles = generateFakeTitles(currentTrack.name);
    const shuffledTitles = shuffleArray([...fakeTitles, currentTrack.name]);
    setTitleChoices(shuffledTitles);
  };

  const handleTitleClick = (title) => {
    if (title === currentTrackForPlayer.name) {
      setShowOverlay(false);
      setHasLost(false);
      // Autres actions en cas de réussite
    } else {
      setHasLost(true);
      setTimeout(() => {
        setShowOverlay(false);
      }, 2500);
    }
  };
  useEffect(() => {
    let timer;
    if (showOverlay && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setHasLost(true);
      controlPlayback("pause");
    }
    return () => clearTimeout(timer);
  }, [showOverlay, timeLeft]);

  const removePlaylist = (playlistId) => {
    setSelectedPlaylists(selectedPlaylists.filter((p) => p.id !== playlistId));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const openPopup = () => {
    setShowPlaylistPopup(true);
    setPopupAnimation("open");
  };

  const closePopup = () => {
    setPopupAnimation("close");
    setTimeout(() => setShowPlaylistPopup(false), 500);
  };

  return (
    <main id="blindtest-main">
      {showOverlay && (
        <div className="overlay">
          <h1>Choose the right song !</h1>
          <div className="choix-titres">
            {titleChoices.map((title, index) => (
              <button key={index} onClick={() => handleTitleClick(title)}>
                {title}
              </button>
            ))}
          </div>
          {hasLost && (
            <div className="lost-cta">
              <h2>HAHA, You've lost!</h2>
              <button onClick={() => setShowOverlay(false)}>Retry</button>
            </div>
          )}
          {!hasLost && <span>Timer: {timeLeft}</span>}
        </div>
      )}
      <h1>Choose your playlists</h1>
      <div className="blindtest-playlist-wrapper">
        {selectedPlaylists.map((playlist) => (
          <div className="blindtest-playlist-content" key={playlist.id}>
            <p>{playlist.name}</p>
            <button onClick={() => removePlaylist(playlist.id)}>X</button>
          </div>
        ))}
      </div>
      <button onClick={openPopup}>
        <img src={AjouterPlaylist} alt="Icone AjouterPlaylist" />
        Ajouter des playlists
      </button>
      <button onClick={startGame} disabled={selectedPlaylists.length === 0}>
        <img src={JouerBlindtest} alt="Icone Jouer" />
        Jouer
      </button>

      {showPlaylistPopup && (
        <PlaylistSelectionPopup
          onClose={closePopup}
          onAddPlaylist={addPlaylist}
          popupAnimation={popupAnimation}
          selectedPlaylists={selectedPlaylists}
        />
      )}
    </main>
  );
};

export default BlindTest;
