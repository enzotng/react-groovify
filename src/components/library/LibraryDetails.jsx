import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import ArrowBack from "../../assets/icon/arrow-back.svg";
import SearchIcon from "../../assets/icon/search.svg";
import AleatoireBouton from "../../assets/icon/shuffle.svg";
import ShareBouton from "../../assets/icon/share.svg";
import Play from "../../assets/icon/play.svg";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
defineCustomElements(window);
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
          console.error(
            "Erreur lors de la récupération des détails de la playlist:",
            error
          );
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

  const sharePlaylist = async (playlistDetails) => {
    if (
      playlistDetails &&
      playlistDetails.external_urls &&
      playlistDetails.external_urls.spotify
    ) {
      try {
        await Share.share({
          title: "Découvrez cette playlist",
          text: `Écoutez "${playlistDetails.name}" sur Spotify!`,
          url: playlistDetails.external_urls.spotify,
          dialogTitle: "Partagez cette playlist",
        });
      } catch (error) {
        console.error("Erreur lors du partage de la playlist :", error);
      }
    } else {
      console.log("Aucun lien de playlist disponible pour le partage.");
    }
  };

  const playPlaylist = async () => {
    if (!accessToken || !playlistId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` }),
      });

      await Haptics.impact({ style: ImpactStyle.Medium });
      console.log("Vibration haptique déclenchée pour playPlaylist");
    } catch (error) {
      console.error("Erreur lors de la lecture de la playlist:", error);
    }
  };

  const playTrack = async (trackUri) => {
    if (!accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      await Haptics.impact({ style: ImpactStyle.Medium });
      console.log("Vibration haptique déclenchée pour playTrack");
    } catch (error) {
      console.error("Erreur lors de la lecture de la piste:", error);
    }
  };

  defineCustomElements(window);

  return (
    <main>
      <div className="library-wrapper">
        <div className="heading-wrapper-library">
          <Link to="/library">
            <img src={ArrowBack} alt="Icone Arrow" />
          </Link>
          <img src={SearchIcon} alt="Icone" />
        </div>
        <div className="album-playlist-wrapper">
          {playlistDetails ? (
            <>
              <div className="album-playlist-content">
                <img
                  src={playlistDetails.images[0].url}
                  alt={playlistDetails.name}
                />
                <div className="album-playlist-infos">
                  <h2>
                    {playlistDetails
                      ? playlistDetails.name
                      : "Loading playlist name..."}
                  </h2>
                  <div className="album-playlist-more">
                    <span>{playlistDetails.tracks.total} songs</span>
                  </div>
                  <div className="album-playlist-cta">
                    <button className="aleatoire-bouton">
                      <img src={AleatoireBouton} alt="Aleatoire Bouton" />
                    </button>
                    <button
                      className="share-bouton"
                      onClick={() => sharePlaylist(playlistDetails)}
                    >
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
                {item.track.album && item.track.album.images[0] && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={`${item.track.name} cover`}
                  />
                )}
                <div className="playlist-details">
                  <p>{item.track.name}</p>
                  {item.track.artists && item.track.artists[0] && (
                    <p>{item.track.artists[0].name}</p>
                  )}
                </div>
              </div>
              <button
                className="cta-bouton"
                onClick={() => playTrack(item.track.uri)}
              >
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
