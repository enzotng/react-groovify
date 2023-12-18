import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/icon/spotify.svg';
import './Auth.scss';
import { useUserContext } from '../config/UserContext';

const Auth = () => {
  const { setUserProfile, setAccessToken, clientId } = useUserContext();
  const navigate = useNavigate();

  // Constantes pour l'authentification
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const redirectUri = 'http://localhost:3001/callback';
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-read-recently-played',
    'user-modify-playback-state',
  ];

  // Redirection vers Spotify pour l'authentification
  const redirectToSpotifyLogin = () => {
    const scopeString = scopes.join('%20');
    window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopeString}&response_type=token&show_dialog=true`;
  };

  // Récupération du token depuis l'URL
  const getTokenFromUrl = () => {
    console.log("URL actuelle:", window.location.href);
    const hash = window.location.hash;
    return hash ? new URLSearchParams(hash.substring(1)).get('access_token') : null;
  };

  // Fetch du profil utilisateur
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Network or token error');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialisation de l'authentification
  useEffect(() => {
    console.log("Composant Auth monté");
    const token = getTokenFromUrl();
    console.log("Token récupéré de l'URL:", token);

    if (!token) {
      console.log("Redirection vers la page de login car le token est absent.");
      navigate('/');
      return;
    }

    setAccessToken(token);
    console.log("Token stocké dans UserContext:", token);

    const initUserProfile = async () => {
      const userProfile = await fetchUserProfile(token);
      if (userProfile) {
        setUserProfile({ ...userProfile, accessToken: token });
        navigate('/home');
      } else {
        navigate('/');
      }
    };

    initUserProfile();
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