import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from '../config/UserContext';
import PlayButton from "../../assets/icon/play.svg";
import "./Explore.scss";

const Explore = () => {
  const { clientId, clientSecret } = useUserContext();
  const [recherche, setRecherche] = useState("");
  const [artistes, setArtistes] = useState([]);
  const [titres, setTitres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [ongletActif, setOngletActif] = useState("titres");
  const [idArtisteSelectionne, setIdArtisteSelectionne] = useState(null);

  const obtenirJetonAcces = useCallback(async () => {
    try {
      const reponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
        },
        body: "grant_type=client_credentials",
      });
      const donnees = await reponse.json();
      return donnees.access_token;
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }, [clientId, clientSecret]);

  const chercherSurSpotify = useCallback(async (jetonAcces) => {
    try {
      const reponse = await fetch(
        `https://api.spotify.com/v1/search?q=${recherche}&type=track,album,artist`,
        {
          headers: {
            Authorization: "Bearer " + jetonAcces,
          },
        }
      );
      const donnees = await reponse.json();
      setTitres(donnees.tracks.items);
      setAlbums(donnees.albums.items);
      setArtistes(donnees.artists.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }, [recherche]);

  async function obtenirAlbumsArtiste(idArtiste, jetonAcces) {
    try {
      const reponse = await fetch(
        `https://api.spotify.com/v1/artists/${idArtiste}/albums`,
        {
          headers: {
            Authorization: "Bearer " + jetonAcces,
          },
        }
      );
      const donnees = await reponse.json();
      setAlbums(donnees.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }

  function obtenirNomsArtistes(lesArtistes) {
    return lesArtistes.map((artiste) => artiste.name).join(", ");
  }

  useEffect(() => {
    if (idDelai) {
      clearTimeout(idDelai);
    }

    if (recherche) {
      const temporisateur = setTimeout(async () => {
        const jetonAcces = await obtenirJetonAcces();
        chercherSurSpotify(jetonAcces);
      }, 200);

      setIdDelai(temporisateur);
    } else {
      setArtistes([]);
      setTitres([]);
      setAlbums([]);
    }

    return () => clearTimeout(idDelai);
  }, [recherche]);

  useEffect(() => {
    if (idArtisteSelectionne) {
      const chercherAlbums = async () => {
        const jetonAcces = await obtenirJetonAcces();
        obtenirAlbumsArtiste(idArtisteSelectionne, jetonAcces);
      };

      chercherAlbums();
    }
  }, [idArtisteSelectionne, obtenirJetonAcces]);

  const artistesVus = {};
  const artistesUniques = artistes.filter((artiste) => {
    const nomMinuscule = artiste.name.toLowerCase();
    if (artistesVus[nomMinuscule]) {
      return false;
    }
    artistesVus[nomMinuscule] = true;
    return true;
  });

  useEffect(() => {
    obtenirJetonAcces().then(jetonAcces => {
      obtenirGenres(jetonAcces);
    });
  }, [obtenirJetonAcces]);

  async function obtenirGenres(jetonAcces) {
    try {
      const reponse = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: {
            Authorization: "Bearer " + jetonAcces,
          },
        }
      );
      const donnees = await reponse.json();
      setGenres(donnees.genres);
    } catch (erreur) {
      console.error("Erreur lors de la récupération des genres :", erreur);
    }
  }

  useEffect(() => {
    const chercherGenres = async () => {
      const jetonAcces = await obtenirJetonAcces();
      obtenirGenres(jetonAcces);
    };

    chercherGenres();
  }, []);

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

          <h1>Explore</h1>
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Artistes, Chansons, Albums..."
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
              Meilleur résultat
            </div>
            <div
              className={ongletActif === "titres" ? "tab active" : "tab"}
              onClick={() => setOngletActif("titres")}
            >
              Musiques
            </div>
            <div
              className={ongletActif === "albums" ? "tab active" : "tab"}
              onClick={() => setOngletActif("albums")}
            >
              Albums
            </div>
            <div
              className={ongletActif === "artistes" ? "tab active" : "tab"}
              onClick={() => setOngletActif("artistes")}
            >
              Artistes
            </div>
          </div>
        )}

        {ongletActif === "resultat" && titres.length > 0 && (
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

                <Link className="music-link" to={`/artiste/`}>
                  <img src={PlayButton} alt="Icon Play"></img>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {ongletActif === "titres" && titres.length > 0 && (
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

                <Link className="music-link" to={`/artiste/`}>
                  <img src={PlayButton} alt="Icon Play"></img>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {ongletActif === "albums" && albums.length > 0 && (
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

                <Link
                  className="music-link"
                  to={`/artiste/${album.artists[0].id}/${album.name}`}
                >
                  <img src={PlayButton} alt="Icon Play"></img>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {ongletActif === "artistes" && artistesUniques.length > 0 && (
          <ul>
            {artistesUniques.map((artiste, index) => (
              <li key={index}>
                <Link to={`/artiste/${artiste.id}`}>{artiste.name}</Link>
              </li>
            ))}
          </ul>
        )}

        {!recherche && (
          <div className="genre-cards">
            {genres.map((genre, index) => (
              <div
                key={index}
                className="genre-card"
                // style={{ background: obtenirGradientAleatoire(index) }}
              >
                <p>{genre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Explore;
