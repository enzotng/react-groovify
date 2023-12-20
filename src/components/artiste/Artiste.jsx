import { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import ArrowBack from "../../assets/icon/arrow-back.svg";
import SearchIcon from '../../assets/icon/search.svg';
import Play from '../../assets/icon/play.svg';
import "./Artiste.scss";

const Artiste = () => {
  const { userProfile } = useUserContext();
  const accessToken = userProfile?.accessToken;
  const { id } = useParams();
  const [artiste, setArtiste] = useState(null);
  const [latestAlbum, setLatestAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtisteAndAlbums = async () => {
      if (!id || !accessToken) return;

      try {
        const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!artistResponse.ok) {
          throw new Error(`Failed to fetch artist info for id: ${id}`);
        }

        const artistData = await artistResponse.json();
        setArtiste(artistData);

        const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!albumsResponse.ok) {
          throw new Error(`Failed to fetch albums for artist id: ${id}`);
        }

        const albumsData = await albumsResponse.json();
        setAlbums(albumsData.items);
        if (albumsData.items.length > 0) {
          setLatestAlbum(albumsData.items[0]);
        }
      } catch (error) {
        console.error("Error fetching artist info or albums:", error);
      }
    };

    fetchArtisteAndAlbums();
  }, [id, accessToken]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className="artiste-main">
      <Suspense fallback={<div>Loading artist details...</div>}>
        {artiste && (
          <div className="artiste-wrapper">
            <div className="artiste-content">
              {artiste.images[0]?.url ? (
                <img src={artiste.images[0].url} alt={artiste.name} width="50" height="50" />
              ) : (
                <div>No Image Available</div>
              )}
              <div className="artiste-cta">
                <button onClick={handleBackClick}>
                  <img src={ArrowBack} alt="Icone Arrow" />
                </button>
                <button className="cta-bouton">
                  <img src={SearchIcon} alt="Next" />
                </button>
              </div>
              <div className="artiste-info">
                <h1>{artiste.name}</h1>
                <button className="cta-bouton">
                  <img src={Play} alt="Next" />
                </button>
              </div>
            </div>
            <div className="artiste-music-wrapper">
              {latestAlbum && (
                <div className="artiste-new">
                  <div className="artiste-new-pochette">
                    <img src={latestAlbum.images[0]?.url} alt={latestAlbum.name} />
                    <span>New album</span>
                  </div>
                  <div className="artiste-new-infos">
                    <h2>{latestAlbum.name}</h2>
                    <span>{artiste.genres[0]} | {formatDate(latestAlbum.release_date)}</span>
                  </div>
                </div>
              )}
              <div className="artiste-playlist">
                <h2>More albums by {artiste.name}</h2>
                {albums.map(album => (
                  <div key={album.id}>
                    <img src={album.images[0]?.url} alt={album.name} />
                    <p>{album.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </main>
  );
};

export default Artiste;