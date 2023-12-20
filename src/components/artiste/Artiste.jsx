import { useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import "./Artiste.scss";

const Artiste = () => {
  const { userProfile } = useUserContext();
  const accessToken = userProfile?.accessToken;
  const { id } = useParams();
  const [artiste, setArtiste] = useState(null);

  useEffect(() => {
    const fetchArtiste = async () => {
      if (!id || !accessToken) return;

      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch artist info for id: ${id}`);
        }

        const data = await response.json();
        setArtiste(data);
      } catch (error) {
        console.error("Error fetching artist info:", error);
      }
    };

    fetchArtiste();
  }, [id, accessToken]);

  return (
    <main>
      <Suspense fallback={<div>Loading artist details...</div>}>
        {artiste && (
          <div className="artiste-wrapper">
            <div className="artiste-content">
              {artiste.images[0]?.url ? (
                <img src={artiste.images[0].url} alt={artiste.name} width="50" height="50" />
              ) : (
                <div>No Image Available</div>
              )}
              <div className="artiste-info">
                <h1>{artiste.name}</h1>
                <p>{artiste.followers.total} followers</p>
                <div className="genres">
                  {artiste.genres.map((genre, index) => (
                    <span key={index}>{genre}{index < artiste.genres.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </main>
  );
};

export default Artiste;