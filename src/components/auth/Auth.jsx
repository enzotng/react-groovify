import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/icon/logo.svg";
import NavFooter from "../common/NavFooter";
import './Auth.scss';

const clientId = "5b3a9581c276435d901439ef12ed7fea";
const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";
const redirectUri = 'http://localhost:5173/callback';

const Auth = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isNavFooterVisible, setIsNavFooterVisible] = useState(false);
  const navigate = useNavigate();

  const redirectToSpotifyLogin = () => {
    const scope = 'user-read-private'; 
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const data = await response.json();
      setUsername(data.display_name);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
    }
  };

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');

    if (hasCode) {
      const code = url.split('?code=')[1];

      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.add('overflow-hidden');
      }

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errorData => {
            console.error("Détails de l'erreur:", errorData);
            throw new Error(res.statusText);
          });
        }
        return res.json();
      })    
      .then((data) => {
        if (data.access_token) {
          setToken(data.access_token);
          fetchUserProfile(data.access_token);
          setIsNavFooterVisible(true);
          navigate('/home');
        } else {
          console.error("Erreur lors de l'obtention du token d'accès:", data);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du token d'accès:", error);
      });
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <img src={Logo} alt="Logo"></img>
      <div className="auth-container-wrapper">
        <h1>Spotify account</h1>
        <p>To use our Groovify App, you need to login to your account</p>
      </div>
      {!token ? (
        <button className="auth-button" onClick={redirectToSpotifyLogin}>
          Connect to Spotify
        </button>
      ) : (
        <div>
          <p>Successfully connected! Welcome, {username}!</p>
          <p>Your access token is: {token}</p>
        </div>
      )}
      {isNavFooterVisible && <NavFooter />} {/* Afficher NavFooter lorsque isNavFooterVisible est vrai */}
    </div>
  );
};

export default Auth;
