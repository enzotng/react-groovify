import { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';

export const useApi = () => {
  const [playlists, setPlaylists] = useState(null);
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchPlaylists = async (retries = 3) => {
      if (!userProfile || !userProfile.accessToken) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${userProfile.accessToken}`,
          },        
        });
    
        if (response.status === 429 && retries > 0) {
          const retryAfter = response.headers.get("Retry-After") || 5;
          setTimeout(() => fetchPlaylists(retries - 1), retryAfter * 1000);
          return;
        }
    
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

    fetchPlaylists();
  }, [userProfile]);

  return playlists;
};