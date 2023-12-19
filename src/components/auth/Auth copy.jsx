import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/icon/spotify.svg';
import './Auth.scss';
import { useUserContext } from '../config/UserContext';

const Auth = () => {
  const { setUserProfile, setAccessToken, clientId } = useUserContext();
  const navigate = useNavigate();

  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const redirectUri = 'http://localhost:3001/callback';
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-read-recently-played',
    'user-modify-playback-state',
  ];

  const redirectToSpotifyLogin = () => {
    const scopeString = scopes.join('%20');
    window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopeString}&response_type=token&show_dialog=true`;
  };

  const getTokenFromUrl = () => {
    const hash = window.location.hash;
    return hash ? new URLSearchParams(hash.substring(1)).get('access_token') : null;
  };

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

      if (!response.ok) {
        console.error('Error fetching user profile: Response not ok');
        throw new Error('Network or token error');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/');
      setAccessToken(null);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const existingToken = getTokenFromUrl();
  
    if (!existingToken) {
      navigate('/');
      return;
    }
  
    setAccessToken(existingToken);
  
    const initUserProfile = async () => {
      const userProfile = await fetchUserProfile(existingToken);
      if (userProfile) {
        setUserProfile({ ...userProfile, accessToken: existingToken });
        navigate('/home');
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