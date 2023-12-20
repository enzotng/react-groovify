import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../config/UserContext';

const BlindTest = () => {
  const { userProfile } = useUserContext();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackOptions, setTrackOptions] = useState([]);
  const [timer, setTimer] = useState(10); // 10 secondes pour chaque extrait

  useEffect(() => {
    // TODO: Charger les playlists disponibles
  }, [userProfile]);

  const fetchTracks = async (playlistId) => {
    // TODO: Récupérer les morceaux de la playlist sélectionnée
  };

  const startGame = () => {
    if (!selectedPlaylist) {
      alert("Veuillez sélectionner une playlist.");
      return;
    }

    fetchTracks(selectedPlaylist).then(tracks => {
      // TODO: Mélanger les morceaux et démarrer le jeu
      setIsGameStarted(true);
      nextTrack();
    });
  };

  const nextTrack = () => {
    // TODO: Sélectionner le prochain morceau et démarrer le timer
  };

  useEffect(() => {
    let interval = null;

    if (isGameStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      // TODO: Afficher les options pour deviner le morceau
    }

    return () => clearInterval(interval);
  }, [isGameStarted, timer]);

  return (
    <div>
      <h1>Blind Test Musical</h1>
      <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
        ))}
      </select>
      <button onClick={startGame}>Lancer le Blind Test</button>

      {isGameStarted && (
        <div>
          <p>Écoutez l'extrait : {timer} secondes restantes</p>
          {/* Ici, ajoutez le composant ou la logique pour jouer l'extrait musical */}
        </div>
      )}

      {timer === 0 && (
        <div>
          {/* Ici, ajoutez la logique pour afficher les options de morceaux */}
          {trackOptions.map((track, index) => (
            <div key={index}>
              {/* Affichez les informations sur les morceaux ici */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlindTest;
