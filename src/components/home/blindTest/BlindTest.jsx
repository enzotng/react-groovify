import React, { useState } from 'react';
import { useUserContext } from '../../config/UserContext';
import PlaylistSelectionPopup from './PlaylistSelectionPopup';
import AjouterPlaylist from '../../../assets/icon/list-plus.svg';
import JouerBlindtest from '../../../assets/icon/play-circle.svg';
import "./BlindTest.scss";

const BlindTest = () => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [popupAnimation, setPopupAnimation] = useState('');
  const { userProfile } = useUserContext();
  const [currentTrackForPlayer, setCurrentTrackForPlayer] = useState(null);
  const accessToken = userProfile?.accessToken;

  const addPlaylist = (playlist) => {
    if (!selectedPlaylists.some(p => p.id === playlist.id)) {
      setSelectedPlaylists([...selectedPlaylists, playlist]);
    }
  };

  const fetchTracksFromPlaylists = async () => {
    const allTracks = [];
    for (const playlist of selectedPlaylists) {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      allTracks.push(...data.items.map((item) => item.track));
    }
    return shuffleArray(allTracks);
  };

  const playTracks = async (trackUris) => {
    if (!accessToken) return;

    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: trackUris })
      });
    } catch (error) {
      console.error("Erreur lors de la lecture des pistes :", error);
    }
  };

  const controlPlayback = async (action) => {
    let endpoint;
    let method = 'PUT';

    switch (action) {
      case 'play':
      case 'pause':
        endpoint = `https://api.spotify.com/v1/me/player/${action}`;
        break;
      default:
        console.error('Action non reconnue:', action);
        return;
    }

    try {
      await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: method === 'PUT' ? JSON.stringify({}) : null,
      });
    } catch (error) {
      console.error('Erreur lors du contrôle de la lecture:', error);
    }
  };

  const startGame = async () => {
    const tracks = await fetchTracksFromPlaylists();
    if (tracks.length > 0) {
      const validTracks = tracks.filter(track => track && track.uri);
  
      if (validTracks.length > 0) {
        const trackUris = validTracks.map(track => track.uri);
        playTracks(trackUris);
        setCurrentTrackForPlayer(validTracks[0]);
        setTimeout(() => {
          controlPlayback('pause');
        }, 10000);
      } else {
        console.error("Aucune piste valide trouvée dans les playlists sélectionnées.");
      }
    }
  };

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
    setPopupAnimation('open');
  };

  const closePopup = () => {
    setPopupAnimation('close');
    setTimeout(() => setShowPlaylistPopup(false), 500);
  };

  return (
    <main id="blindtest-main">
      <h1>Choose your playlists</h1>
      <div className="blindtest-playlist-wrapper">
        {selectedPlaylists.map(playlist => (
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
        />
      )}
    </main>
  );
};

export default BlindTest;