import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icon/spotify.svg";
import "./Auth.scss";
import { useUserContext } from "../config/UserContext";

const redirectUri = "http://localhost:5173/callback";
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-modify-playback-state"
];

const Auth = () => {
  const { setUserProfile, setAccessToken, clientId } = useUserContext();
  const navigate = useNavigate();

  const redirectToSpotifyLogin = () => {
    window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur de réseau ou de token.");
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
      return null;
    }
  };

  useEffect(() => {
    const getTokenFromUrl = () => {
      const hash = window.location.hash;
      if (!hash) return null;
      const hashParams = new URLSearchParams(hash.substring(1));
      return hashParams.get("access_token");
    };

    const tokenFromStorage = localStorage.getItem("accessToken");
    const tokenFromUrl = getTokenFromUrl();

    if (tokenFromUrl) {
      localStorage.setItem("accessToken", tokenFromUrl);
      setAccessToken(tokenFromUrl);
      window.history.replaceState(null, null, ' ');
    } else if (tokenFromStorage) {
      setAccessToken(tokenFromStorage);
    } else {
      navigate("/");
      return;
    }

    fetchUserProfile(tokenFromUrl || tokenFromStorage).then(userProfile => {
      if (userProfile) {
        setUserProfile({ ...userProfile, accessToken: tokenFromUrl || tokenFromStorage });
        navigate("/home");
      } else {
        navigate("/");
      }
    });
  }, [navigate, setAccessToken, setUserProfile]);

  return (
    <div className="auth-container">
      <img src={Logo} alt="Logo Spotify" />
      <div className="auth-container-wrapper">
        <h1>Connectez-vous à votre compte Spotify</h1>
        <p>Pour utiliser notre application Groovify, vous devez vous connecter avec votre compte Spotify.</p>
        <button onClick={redirectToSpotifyLogin}>Se connecter à Spotify</button>
      </div>
    </div>
  );
};

export default Auth;