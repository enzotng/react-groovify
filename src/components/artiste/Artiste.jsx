import { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import ArrowBack from "../../assets/icon/arrow-back.svg";
import ShareIcon from "../../assets/icon/share.svg";
import Play from "../../assets/icon/play.svg";
import { Share } from "@capacitor/share";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../home/Swiper.scss";
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
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!artistResponse.ok) {
          throw new Error(`Failed to fetch artist info for id: ${id}`);
        }

        const artistData = await artistResponse.json();
        setArtiste(artistData);

        const albumsResponse = await fetch(
          `https://api.spotify.com/v1/artists/${id}/albums`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

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
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const shareArtiste = async () => {
    if (artiste) {
      try {
        await Share.share({
          title: "Check out this artist!",
          text: `Listen to ${artiste.name} on Spotify!`,
          url: artiste.external_urls.spotify,
          dialogTitle: "Share with friends",
        });
      } catch (error) {
        console.error("Error sharing artist:", error);
      }
    }
  };

  const playArtistTrack = async () => {
    const topTracksResponse = await fetch(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const topTracksData = await topTracksResponse.json();

    if (topTracksData.tracks.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * topTracksData.tracks.length
      );
      const trackUri = topTracksData.tracks[randomIndex].uri;

      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });
    } else {
      console.log("No tracks available for this artist.");
    }
  };

  const playAlbum = async (albumUri) => {
    if (!accessToken) return;

    try {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context_uri: albumUri }),
      });
    } catch (error) {
      console.error("Erreur lors de la lecture de l'album :", error);
    }
  };

  return (
    <main className="artiste-main">
      <Suspense fallback={<div>Loading artist details...</div>}>
        {artiste && (
          <div className="artiste-wrapper">
            <div className="artiste-content">
              {artiste.images[0]?.url ? (
                <img
                  className="artiste-content-image"
                  src={artiste.images[0].url}
                  alt={artiste.name}
                  width="50"
                  height="50"
                />
              ) : (
                <div>No Image Available</div>
              )}
              <div className="artiste-cta">
                <button onClick={handleBackClick}>
                  <img src={ArrowBack} alt="Icone Arrow" />
                </button>
                <button className="cta-bouton" onClick={shareArtiste}>
                  <img src={ShareIcon} alt="Icone Share" />
                </button>
              </div>
              <div className="artiste-info">
                <div className="artiste-info-text">
                  <h1>{artiste.name}</h1>
                  <p>{artiste.followers.total.toLocaleString()} listeners</p>
                </div>
                <button className="cta-bouton" onClick={playArtistTrack}>
                  <img src={Play} alt="Play" />
                </button>
              </div>
            </div>
            <div className="artiste-music-wrapper">
              {latestAlbum && (
                <div className="artiste-new">
                  <div className="artiste-new-pochette" onClick={() => playAlbum(latestAlbum.uri)}>
                    <img src={latestAlbum.images[0]?.url} alt={latestAlbum.name} />
                    <span>New album</span>
                  </div>
                  <div className="artiste-new-infos">
                    <h2>{latestAlbum.name}</h2>
                    <span>{formatDate(latestAlbum.release_date)}</span>
                  </div>
                </div>
              )}
              <div className="artiste-playlist">
                <h2>More albums by {artiste.name}</h2>
                <div className="slider-wrapper">
                  <Swiper
                    slidesPerView={2.25}
                    speed={1000}
                    grabCursor={true}
                    breakpoints={{
                      320: {
                        slidesPerView: 2.25,
                        spaceBetween: 15,
                      },
                      768: {
                        slidesPerView: 5.25,
                        spaceBetween: 25,
                      },
                    }}
                  >
                    {albums.map((album) => (
                      <SwiperSlide
                        key={album.id}
                        onClick={() => playAlbum(album.uri)}
                      >
                        <img src={album.images[0]?.url} alt={album.name} />
                        <div className="slider-wrapper-content">
                          <p className="artiste-album">{album.name}</p>
                          <p className="artiste-nom">{album.artists[0].name}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
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
