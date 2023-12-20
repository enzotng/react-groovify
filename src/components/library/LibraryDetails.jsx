import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import SearchIcon from '../../assets/icon/search.svg';
import AleatoireBouton from '../../assets/icon/shuffle.svg';
import ShareBouton from '../../assets/icon/share.svg';
import Play from "../../assets/icon/play.svg";
import "./Library.scss";

const LibraryDetails = () => {
  const [tracks, setTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const { playlistId } = useParams();
  const { userProfile } = useUserContext();
  const accessToken = userProfile?.accessToken;

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      console.log("Fetching details for playlist ID:", playlistId);
      if (userProfile?.accessToken && playlistId) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                Authorization: `Bearer ${userProfile.accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch playlist details");
          }

          const data = await response.json();
          setPlaylistDetails(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de la playlist:", error);
        }
      }
    };

    const fetchTracks = async () => {
      console.log("Fetching tracks for playlist ID:", playlistId);
      if (userProfile?.accessToken && playlistId) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              headers: {
                Authorization: `Bearer ${userProfile.accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch tracks");
          }

          const data = await response.json();
          setTracks(data.items);
        } catch (error) {
          console.error("Erreur lors de la récupération des chansons:", error);
        }
      }
    };

    fetchPlaylistDetails();
    fetchTracks();
  }, [playlistId, userProfile]);

  const sharePlaylist = (playlistDetails) => {
    if (playlistDetails && playlistDetails.external_urls && playlistDetails.external_urls.spotify) {
      navigator.clipboard.writeText(playlistDetails.external_urls.spotify)
        .then(() => {
          console.log("Lien de la playlist copié dans le presse-papiers.");
        })
        .catch(err => {
          console.error("Erreur lors de la copie du lien de la playlist :", err);
        });
    } else {
      console.log("Aucun lien de playlist disponible pour le partage.");
    }
  };

  // Ajoutez une fonction pour jouer une playlist entière
  const playPlaylist = async () => {
    if (!accessToken || !playlistId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` })
      });
      // Mettre à jour le player ici si nécessaire
    } catch (error) {
      console.error("Erreur lors de la lecture de la playlist:", error);
    }
  };

  // Ajoutez une fonction pour jouer une piste spécifique
  const playTrack = async (trackUri) => {
    if (!accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [trackUri] })
      });
      // Mettre à jour le player ici si nécessaire
    } catch (error) {
      console.error("Erreur lors de la lecture de la piste:", error);
    }
  };

  return (
    <main>
      <div className="library-wrapper">
        <div className="heading-wrapper-library">
          <Link to="/library">
            {" "}
            <svg
              id="arrow-back"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="c-vector"
                d="M9.86681 1.0489L5.32158 5.59413C5.27937 5.63639 5.22924 5.66992 5.17406 5.69279C5.11888 5.71566 5.05973 5.72744 5 5.72744C4.94027 5.72744 4.88113 5.71566 4.82595 5.69279C4.77077 5.66992 4.72064 5.63639 4.67843 5.59413L0.133201 1.0489C0.0479137 0.963616 0 0.847942 0 0.727328C0 0.606714 0.0479137 0.49104 0.133201 0.405753C0.218488 0.320466 0.334162 0.272552 0.454775 0.272552C0.575389 0.272552 0.691063 0.320466 0.77635 0.405753L5 4.62997L9.22366 0.405753C9.26589 0.363523 9.31602 0.330025 9.3712 0.30717C9.42637 0.284315 9.48551 0.272552 9.54523 0.272552C9.60495 0.272552 9.66409 0.284315 9.71927 0.30717C9.77444 0.330025 9.82458 0.363523 9.86681 0.405753C9.90904 0.447983 9.94253 0.498117 9.96539 0.553293C9.98824 0.608469 10 0.667606 10 0.727328C10 0.78705 9.98824 0.846187 9.96539 0.901363C9.94253 0.956539 9.90904 1.00667 9.86681 1.0489Z"
                fill="white"
              />
            </svg>
          </Link>
          <img src={SearchIcon} alt="Icone" />
        </div>
        <div className="album-playlist-wrapper">
          {playlistDetails ? (
            <>
              <div className="album-playlist-content">
                <img src={playlistDetails.images[0].url} alt={playlistDetails.name} />
                <div className="album-playlist-infos">
                  <h2>{playlistDetails ? playlistDetails.name : "Loading playlist name..."}</h2>
                  <div className="album-playlist-more">
                    <span>{playlistDetails.tracks.total} songs</span>
                  </div>
                  <div className="album-playlist-cta">
                    <button className="aleatoire-bouton">
                      <img src={AleatoireBouton} alt="Aleatoire Bouton" />
                    </button>
                    <button className="share-bouton" onClick={() => sharePlaylist(playlistDetails)}>
                      <img src={ShareBouton} alt="Share Bouton" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="album-playlist-button">
                <button className="aleatoire-bouton">
                  <img src={AleatoireBouton} alt="Aleatoire Bouton" />
                  Shuffle
                </button>
                <button className="play-bouton" onClick={playPlaylist}>
                  <img src={Play} alt="Play" />
                  Play
                </button>
              </div>
            </>
          ) : (
            <p>Loading playlist...</p>
          )}
        </div>
        <div className="playlist-wrapper">
          {tracks.map((item, index) => (
            <div className="playlist-content" key={index}>
              <div className="playlist-list">
                <img
                  src={item.track.album.images[0]?.url}
                  alt={`${item.track.album.images[0]?.url} cover`}
                />
                <div className="playlist-details">
                  <p>{item.track.name}</p>
                  <p>{item.track.artists[0].name}</p>
                </div>
              </div>
              <button className="cta-bouton" onClick={() => playTrack(item.track.uri)}>
                <img src={Play} alt="Play" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LibraryDetails;
