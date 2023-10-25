import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icon/logo.svg";
import NavFooter from "../common/NavFooter";
import "./Auth.scss";

import { SpotifyAuth, Scopes } from "react-spotify-auth";
import "react-spotify-auth/dist/index.css";

import { UserProvider } from "../config/UserContext";
import { useUserContext } from "../config/UserContext";

const clientId = "5b3a9581c276435d901439ef12ed7fea";
const redirectUri = "http://localhost:5173/callback";

const Auth = () => {
  const [token, setToken] = useState(null);
  const { setUserProfile } = useUserContext();

  const navigate = useNavigate();

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du profil utilisateur:",
        error
      );
    }
  };

  return (
    <UserProvider>
      <div className="auth-container">
        <img src={Logo} alt="Logo" />
        <div className="auth-container-wrapper">
          <h1>Spotify account</h1>
          <p>To use our Groovify App, you need to login to your account</p>
        </div>
        {token ? (
          <div>
            <p>Successfully connected! Welcome!</p>
            <p>Your access token is: {token}</p>
          </div>
        ) : (
          <SpotifyAuth
            redirectUri={redirectUri}
            clientID={clientId}
            scopes={[
              Scopes.userReadPrivate,
              Scopes.userReadEmail,
              Scopes.playlistReadPrivate,
            ]}
            onAccessToken={async (token) => {
              try {
                setToken(token);
                const userProfile = await fetchUserProfile(token);
                setUserProfile(userProfile);
                navigate("/home");
              } catch (error) {
                console.error("Erreur:", error);
              }
            }}
          />
        )}
        <NavFooter />
      </div>
    </UserProvider>
  );
};

export default Auth;
