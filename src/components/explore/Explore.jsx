import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../config/UserContext";
import PauseButton from "../../assets/icon/pause.svg";
import PlayButton from "../../assets/icon/play.svg";
import "./Explore.scss";

const Explore = () => {
  const { userProfile } = useUserContext();
  const accessToken = userProfile ? userProfile.accessToken : null;
  const [recherche, setRecherche] = useState("");
  const [artistes, setArtistes] = useState([]);
  const [titres, setTitres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playingTrackUri, setPlayingTrackUri] = useState(null);
  const [ongletActif, setOngletActif] = useState("resultat");
  const [idArtisteSelectionne, setIdArtisteSelectionne] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const chercherSurSpotify = useCallback(async () => {
    if (!accessToken || !recherche) return;

    try {
      const reponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          recherche
        )}&type=track,album,artist`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      const donnees = await reponse.json();
      setTitres(donnees.tracks.items);
      setAlbums(donnees.albums.items);
      setArtistes(donnees.artists.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
    }
  }, [recherche, accessToken]);

  async function obtenirAlbumsArtiste(idArtiste) {
    if (!accessToken || !idArtiste) return;

    try {
      const reponse = await fetch(
        `https://api.spotify.com/v1/artists/${idArtiste}/albums`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      const donnees = await reponse.json();
      setAlbums(donnees.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
    }
  }

  function obtenirNomsArtistes(lesArtistes) {
    return lesArtistes.map((artiste) => artiste.name).join(", ");
  }

  useEffect(() => {
    if (!recherche) {
      setArtistes([]);
      setTitres([]);
      setAlbums([]);
      return;
    }

    chercherSurSpotify();
  }, [recherche, chercherSurSpotify]);

  useEffect(() => {
    obtenirAlbumsArtiste(idArtisteSelectionne);
  }, [idArtisteSelectionne]);

  useEffect(() => {
    if (location.state?.searchTerm) {
      setRecherche(location.state.searchTerm);
    }
  }, []);

  useEffect(() => {
    if (recherche !== location.state?.searchTerm) {
      navigate(location.pathname, { state: { searchTerm: recherche } });
    }
  }, [recherche, navigate, location]);

  const artistesVus = {};
  const artistesUniques = artistes.filter((artiste) => {
    const nomMinuscule = artiste.name.toLowerCase();
    if (artistesVus[nomMinuscule]) {
      return false;
    }
    artistesVus[nomMinuscule] = true;
    return true;
  });

  const obtenirCleUniqueTitre = (titre) => {
    return `${titre.id}-${titre.name}`;
  };

  const playContent = async (uri, isAlbum) => {
    if (!accessToken) return;

    let endpoint = "https://api.spotify.com/v1/me/player/play";
    let body = isAlbum ? { context_uri: uri } : { uris: [uri] };

    try {
      await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      setPlayingTrackUri(uri);
    } catch (error) {
      console.error("Erreur lors de la lecture :", error);
    }
  };

  const PLAYLIST_ID = "37i9dQZF1DXcBWIGoYBM5M";
  const [playlistTracks, setPlaylistTracks] = useState([]);
  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await response.json();
        setPlaylistTracks(data.items);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchPlaylistTracks();
  }, [accessToken]);

  const playTrack = async (trackUri) => {
    if (!accessToken) return;

    try {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });
      setPlayingTrackUri(trackUri);
    } catch (error) {
      console.error("Erreur lors de la lecture de la piste :", error);
    }
  };

  return (
    <main>
      <div className="explore-wrapper">
        <div className="heading-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="11.2%" stopColor="rgb(78, 62, 255)" />
                <stop offset="91.1%" stopColor="rgb(164, 69, 255)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"
            ></path>
          </svg>
          <h1>Explore new sounds</h1>
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Artists, Songs, Albums..."
          />
          {recherche && (
            <svg
              className="clear-input"
              onClick={() => setRecherche("")}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          )}
        </div>
        {recherche && (
          <div className="tabs">
            <div
              className={ongletActif === "resultat" ? "tab active" : "tab"}
              onClick={() => setOngletActif("resultat")}
            >
              Top
            </div>
            <div
              className={ongletActif === "titres" ? "tab active" : "tab"}
              onClick={() => setOngletActif("titres")}
            >
              Songs
            </div>
            <div
              className={ongletActif === "artistes" ? "tab active" : "tab"}
              onClick={() => setOngletActif("artistes")}
            >
              Artists
            </div>
            <div
              className={ongletActif === "albums" ? "tab active" : "tab"}
              onClick={() => setOngletActif("albums")}
            >
              Albums
            </div>
          </div>
        )}

        {recherche && ongletActif === "resultat" && (
          <ul>
            {albums.length > 0 &&
              albums.map((album, index) => (
                <li key={index}>
                  <div className="image-wrapper">
                    <img
                      src={album.images[0]?.url}
                      alt={album.name}
                      width="50"
                      height="50"
                    />
                    <div className="text-content">
                      <p>{album.name}</p>
                      <p>{obtenirNomsArtistes(album.artists)}</p>
                    </div>
                  </div>
                  <button
                    className="music-link"
                    onClick={() => playContent(album.uri, true)}
                  >
                    <img
                      src={
                        playingTrackUri === album.uri ? PauseButton : PlayButton
                      }
                      alt={playingTrackUri === album.uri ? "Pause" : "Play"}
                    />
                  </button>
                </li>
              ))}

            {[
              ...new Map(
                titres.map((titre) => [obtenirCleUniqueTitre(titre), titre])
              ).values(),
            ].map((titre, index) => (
              <li key={index}>
                <div className="image-wrapper">
                  <img
                    src={titre.album.images[0]?.url}
                    alt={titre.name}
                    width="50"
                    height="50"
                  />
                  <div className="text-content">
                    <p>{titre.name}</p>
                    <p>{obtenirNomsArtistes(titre.artists)}</p>
                  </div>
                </div>
                <button
                  className="music-link"
                  onClick={() => playContent(titre.uri, false)}
                >
                  <img
                    src={
                      playingTrackUri === titre.uri ? PauseButton : PlayButton
                    }
                    alt={playingTrackUri === titre.uri ? "Pause" : "Play"}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {recherche && ongletActif === "titres" && titres.length > 0 && (
          <ul>
            {titres.map((titre, index) => (
              <li key={index}>
                <div className="image-wrapper">
                  <img
                    src={titre.album.images[0]?.url}
                    alt={titre.name}
                    width="50"
                    height="50"
                  />
                  <div className="text-content">
                    <p>{titre.name}</p>
                    <p>{obtenirNomsArtistes(titre.artists)}</p>
                  </div>
                </div>

                <button
                  className="music-link"
                  onClick={() => playContent(titre.uri, false)}
                >
                  <img
                    src={
                      playingTrackUri === titre.uri ? PauseButton : PlayButton
                    }
                    alt={playingTrackUri === titre.uri ? "Pause" : "Play"}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {recherche && ongletActif === "artistes" && artistesUniques.length > 0 && (
          <ul>
            {artistesUniques.map((artiste, index) => (
              <Link key={index} to={`/artiste/${artiste.id}`}>
                <li id="artiste-li">
                  <div className="artiste-resultat">
                    {artiste.images[0] && (
                      <img src={artiste.images[0].url} alt={artiste.name} />
                    )}
                    <span>{artiste.name}</span>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}

        {recherche && ongletActif === "albums" && albums.length > 0 && (
          <ul>
            {albums.map((album) => (
              <li key={album.id}>
                <div className="image-wrapper">
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    width="50"
                    height="50"
                  />
                  <div className="text-content">
                    <p>{album.name}</p>
                    <p>{obtenirNomsArtistes(album.artists)}</p>
                  </div>
                </div>

                <button
                  className="music-link"
                  onClick={() => playContent(album.uri, true)}
                >
                  <img
                    src={
                      playingTrackUri === album.uri ? PauseButton : PlayButton
                    }
                    alt={playingTrackUri === album.uri ? "Pause" : "Play"}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {!recherche && (
          <div className="playlist-today-hits-component">
            <h2>Today's Top Hits 📅</h2>
            <div className="playlist-today-hits-wrapper">
              {playlistTracks.map((item, index) => (
                <div className="playlist-today-hits-content" key={index}>
                  <div className="playlist-today-hits-image">
                    <span className="track-number">{index + 1}</span>
                    <img
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                    />
                    <button onClick={() => playTrack(item.track.uri)}>
                      <img
                        src={
                          playingTrackUri === item.track.uri
                            ? PauseButton
                            : PlayButton
                        }
                        alt="Play Icon"
                      />
                    </button>
                  </div>
                  <p>{item.track.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Explore;
