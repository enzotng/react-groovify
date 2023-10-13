import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './Artiste.scss';

const Artiste = () => {
  const [nomArtiste, setNomArtiste] = useState("");
  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";
  const { id } = useParams();
  const [genres, setGenres] = useState([]);
  const [imageArtiste, setImageArtiste] = useState("");

  const obtenirJetonAcces = async () => {
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
  };

  const obtenirInfoArtiste = async (idArtiste, jetonAcces) => {
    const reponse = await fetch(`https://api.spotify.com/v1/artists/${idArtiste}`, {
      headers: {
        Authorization: "Bearer " + jetonAcces,
      },
    });
    const donnees = await reponse.json();
    console.log(donnees);
    setGenres(donnees.genres);
    return donnees;
  };

  useEffect(() => {
    const chercherArtiste = async () => {
      const jetonAcces = await obtenirJetonAcces();
      const infoArtiste = await obtenirInfoArtiste(id, jetonAcces);
      setNomArtiste(infoArtiste.name);
      setImageArtiste(infoArtiste.images[0]?.url);
    };

    chercherArtiste();
  }, [id, imageArtiste]);

  return (
    <main>
      <div className="background-artiste" style={{ backgroundImage: `url(${imageArtiste})` }}></div>
      <div className="artiste-wrapper">
        <div className="artiste-content">
          {imageArtiste ? <img src={imageArtiste} alt={nomArtiste} width="50" height="50" /> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"> ... </svg>}
          <h1>{nomArtiste}</h1>
        </div>
      </div>
      <div className="artiste-infos">
        <p>{genres.join(', ')}</p>
      </div>
    </main>
  );
};

export default Artiste;