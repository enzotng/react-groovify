import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  // const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID_2;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET_2;
  const musixAPI = import.meta.env.VITE_MUSIXMATCH_API_KEY;

  // useEffect(() => {
  //   console.log("AccessToken mis à jour dans UserContext:", accessToken);
  // }, [accessToken]);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, accessToken, setAccessToken, clientId, clientSecret, musixAPI }}>
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

export default UserProvider;