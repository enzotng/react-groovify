import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(
    JSON.parse(Cookies.get('userProfile') || 'null')
  );
  const [playlists, setPlaylists] = useState(null);
  
  useEffect(() => {
    Cookies.set('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${userProfile.accessToken}`,
        },        
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur lors de la récupération des playlists:', errorData);
        return;
      }
      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, playlists, fetchPlaylists }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => {
  return useContext(UserContext);
};