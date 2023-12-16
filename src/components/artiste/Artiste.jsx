import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Artiste.scss";

const Artiste = () => {
  const [nomArtiste, setNomArtiste] = useState("");
  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";
  const { id } = useParams();
  const [genres, setGenres] = useState([]);
  const [imageArtiste, setImageArtiste] = useState("");
  const [followersArtiste, setFollowers] = useState("");

  const obtenirJetonAcces = async () => {
    const reponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    if (!reponse.ok) {
      throw new Error("Failed to fetch access token");
    }
    const donnees = await reponse.json();
    return donnees.access_token;
  };

  const obtenirInfoArtiste = async (idArtiste, jetonAcces) => {
    const reponse = await fetch(
      `https://api.spotify.com/v1/artists/${idArtiste}`,
      {
        headers: {
          Authorization: "Bearer " + jetonAcces,
        },
      }
    );
    if (!reponse.ok) {
      throw new Error(`Failed to fetch artist info for id: ${idArtiste}`);
    }
    const donnees = await reponse.json();
    setGenres(donnees.genres || []);
    return donnees;
  };

  useEffect(() => {
    if (!id) return;

    const chercherArtiste = async () => {
      try {
        const jetonAcces = await obtenirJetonAcces();
        const infoArtiste = await obtenirInfoArtiste(id, jetonAcces);
        setNomArtiste(infoArtiste.name);
        setFollowers(infoArtiste.followers.total);
        setImageArtiste(infoArtiste.images[0]?.url);
      } catch (error) {
        console.error("Error fetching artist info:", error);
      }
    };

    chercherArtiste();
  }, [id]);

  return (
    <main>
      <Suspense fallback={<div>Loading artist details...</div>}>
        <div className="artiste-wrapper">
          <div className="artiste-content">
            {imageArtiste ? (
              <img src={imageArtiste} alt={nomArtiste} width="50" height="50" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                {/* ... */}
              </svg>
            )}
            <div className="artiste-test">
              <h1>{nomArtiste}</h1>
              <h1>{followersArtiste}</h1>
            </div>
          </div>

          <div className="artiste-infos">
            {genres &&
              genres.map((genre, index) => (
                <p key={index}>
                  {genre}
                  {index < genres.length - 1 ? ", " : ""}
                </p>
              ))}
          </div>

          <div className="followers"></div>
        </div>
      </Suspense>
      <h2>Popularity</h2>

      <div className="artiste-main">
        <h2>Latest releases</h2>
        <p>Gazoooo</p>
      </div>
    </main>
  );
};

export default Artiste;
