import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Explore.scss';

const Explore = () => {
  const [recherche, setRecherche] = useState('');
  const [artistes, setArtistes] = useState([]);
  const [titres, setTitres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [idDelai, setIdDelai] = useState(null);
  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

  const [ongletActif, setOngletActif] = useState('titres');
  const [idArtisteSelectionne, setIdArtisteSelectionne] = useState(null);

  async function obtenirJetonAcces() {
    try {
      const reponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      });
      const donnees = await reponse.json();
      return donnees.access_token;
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }

  async function chercherSurSpotify(jetonAcces) {
    try {
      const reponse = await fetch(`https://api.spotify.com/v1/search?q=${recherche}&type=track,album,artist`, {
        headers: {
          Authorization: "Bearer " + jetonAcces,
        },
      });
      const donnees = await reponse.json();
      setTitres(donnees.tracks.items);
      setAlbums(donnees.albums.items);
      setArtistes(donnees.artists.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }

  async function obtenirAlbumsArtiste(idArtiste, jetonAcces) {
    try {
      const reponse = await fetch(`https://api.spotify.com/v1/artists/${idArtiste}/albums`, {
        headers: {
          Authorization: "Bearer " + jetonAcces,
        },
      });
      const donnees = await reponse.json();
      setAlbums(donnees.items);
    } catch (erreur) {
      console.error("Erreur :", erreur);
      throw erreur;
    }
  }

  function obtenirNomsArtistes(lesArtistes) {
    return lesArtistes.map(artiste => artiste.name).join(', ');
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
  }, [idArtisteSelectionne]);

  const artistesVus = {};
  const artistesUniques = artistes.filter(artiste => {
    const nomMinuscule = artiste.name.toLowerCase();
    if (artistesVus[nomMinuscule]) {
      return false;
    }
    artistesVus[nomMinuscule] = true;
    return true;
  });

  const [genres, setGenres] = useState([]);

  async function obtenirGenres(jetonAcces) {
    try {
      const reponse = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
          Authorization: "Bearer " + jetonAcces,
        },
      });
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

  function melanger(tableau) {
    let indiceActuel = tableau.length, indiceAleatoire;

    while (indiceActuel !== 0) {
      indiceAleatoire = Math.floor(Math.random() * indiceActuel);
      indiceActuel--;
      [tableau[indiceActuel], tableau[indiceAleatoire]] = [tableau[indiceAleatoire], tableau[indiceActuel]];
    }

    return tableau;
  }

  const couleurs = melanger([
    'rgba(150,0,0,0.8)',
    'rgba(150,85,0,0.8)',
    'rgba(130,133,20,0.8)',
    'rgba(60,130,55,0.8)',
    'rgba(50,130,120,0.8)',
    'rgba(40,120,130,0.8)',
    'rgba(20,100,150,0.8)',
    'rgba(110,50,140,0.8)',
    'rgba(150,0,130,0.8)',
    'rgba(150,55,55,0.8)'
  ]);

  function obtenirCouleurAleatoire(indice) {
    return couleurs[indice % couleurs.length];
  }

  return (
    <main>
      <div className='explore-wrapper'>
        <div className="heading-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="11.2%" stopColor="rgb(78, 62, 255)" />
                <stop offset="91.1%" stopColor="rgb(164, 69, 255)" />
              </linearGradient>
            </defs>
            <path fill="url(#gradient)" d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z">
            </path>
          </svg>

          <h1>Explore</h1>
        </div>
        <div className="input-wrapper">
          <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Artistes, Chansons, Podcasts & Plus..." />
          {recherche && (
            <svg className="clear-input" onClick={() => setRecherche('')} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          )}
        </div>
        {recherche && (
          <div className="tabs">
            <div className={ongletActif === 'titres' ? 'tab active' : 'tab'} onClick={() => setOngletActif('titres')}>Musiques</div>
            <div className={ongletActif === 'albums' ? 'tab active' : 'tab'} onClick={() => setOngletActif('albums')}>Albums</div>
            <div className={ongletActif === 'artistes' ? 'tab active' : 'tab'} onClick={() => setOngletActif('artistes')}>Artistes</div>
          </div>
        )}

        {ongletActif === 'titres' && (
          <ul>
            {titres.map((titre, index) => (
              <li key={index}>
                <img src={titre.album.images[0]?.url} alt={titre.name} width="50" height="50" />
                <div className="text-wrapper">
                  <p>{titre.name}</p>
                  <p>{obtenirNomsArtistes(titre.artists)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {ongletActif === 'albums' && (
          <ul>
            {albums.map((album, index) => (
              <li key={index}>
                <img src={album.images[0]?.url} alt={album.name} width="50" height="50" />
                <div className="text-wrapper">
                  <p>{album.name}</p>
                  <p>{obtenirNomsArtistes(album.artists)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {ongletActif === 'artistes' && (
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
                style={{ background: obtenirCouleurAleatoire(index) }}
              >
                <p>{genre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Explore;