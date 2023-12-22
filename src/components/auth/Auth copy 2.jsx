import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icon/spotify.svg";
import "./Auth.scss";

import { SpotifyAuth, Scopes } from "react-spotify-auth";
import "react-spotify-auth/dist/index.css";

import { useUserContext } from "../config/UserContext";

const redirectUri = "https://6344-2a01-e0a-b47-8330-a4ad-9556-353c-fcbe.ngrok-free.app/callback";

const Auth = () => {
  const { setUserProfile, clientId } = useUserContext();
  const navigate = useNavigate();

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      data.accessToken = accessToken;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
    }
  };

  const onAccessToken = async (accessToken) => {
    try {
      await fetch('https://back.enzotang.fr/storeToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });
  
      const userProfile = await fetchUserProfile(accessToken);
      if (userProfile) {
        setUserProfile({ ...userProfile, accessToken });
        navigate("/home");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };  

  return (
    <div className="auth-container">
      <img src={Logo} alt="Logo" />
      <div className="auth-container-wrapper">
        <h1>Spotify account</h1>
        <p>To use our Groovify App, you need to login to your account</p>
        <SpotifyAuth
          redirectUri={redirectUri}
          clientID={clientId}
          scopes={[
            Scopes.userReadPrivate,
            Scopes.userReadEmail,
            Scopes.playlistReadPrivate,
            Scopes.userTopRead,
            Scopes.userReadCurrentlyPlaying,
            Scopes.userReadPlaybackState,
            Scopes.userReadRecentlyPlayed,
            Scopes.userModifyPlaybackState,
          ]}
          onAccessToken={onAccessToken}
        />
      </div>
    </div>
  );
};

export default Auth;