import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const musixAPI = import.meta.env.VITE_MUSIXMATCH_API_KEY;
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  // const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID_2;
  // const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET_2;

  useEffect(() => {
    const userProfileData = localStorage.getItem("userProfile");
    if (userProfileData) {
      try {
        const parsedData = JSON.parse(userProfileData);
        if (parsedData.userProfile && parsedData.accessToken) {
          setUserProfile(parsedData.userProfile);
          setAccessToken(parsedData.accessToken);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    if (userProfile && accessToken) {
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ userProfile, accessToken })
      );
    }
  }, [userProfile, accessToken]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        accessToken,
        setAccessToken,
        clientId,
        clientSecret,
        musixAPI,
      }}
    >
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

export default UserContext;
