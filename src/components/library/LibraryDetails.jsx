import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import "./Library.scss";

const LibraryDetails = () => {
  const { userProfile } = useUserContext();
  const [tracks, setTracks] = useState([]);
  const { playlistId } = useParams();

  useEffect(() => {
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
          console.log(data.items);
        } catch (error) {
          console.error("Erreur lors de la récupération des chansons:", error);
        }
      }
    };

    fetchTracks();
  }, [playlistId, userProfile]);

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
          <h1>Nom de la playlist</h1>
        </div>
        <div className="playlist-wrapper">
          {tracks.map((item, index) => (
            <div className="playlist-content" key={index}>
              <div className="playlist-infos">
                <img
                  src={item.track.album.images[0]?.url}
                  alt={`${item.track.album.images[0]?.url} cover`}
                />
                <div className="playlist-details">
                    <p>{item.track.name}</p>
                    <p>{item.track.artists[0].name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LibraryDetails;
