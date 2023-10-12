import { useEffect, useState } from "react";

function Main() {
  const [artistName, setArtistName] = useState("");

  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

  useEffect(() => {
    // Fonction pour obtenir un token d'accès à partir de vos identifiants
    async function getAccessToken() {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
          },
          body: "grant_type=client_credentials",
        });

        const data = await response.json();
        return data.access_token;
      } catch (error) {
        console.error("Erreur :", error);
        throw error;
      }
    }

    // Fonction pour obtenir les informations d'un artiste en utilisant le token d'accès
    async function getArtistInfo(artistId, accessToken) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erreur :", error);
        throw error;
      }
    }

    // Fonction pour afficher le nom de l'artiste
    function displayArtistName(name) {
      setArtistName("Nom de l'artiste : " + name);
    }

    // Utilisation des fonctions pour obtenir les informations d'un artiste
    (async () => {
      try {
        const accessToken = await getAccessToken();
        const artistId = "3vUMXQ9kPnZAQkMkZZ7Hfh"; // Remplacez par l'ID de l'artiste que vous souhaitez obtenir
        const artistInfo = await getArtistInfo(artistId, accessToken);
        const artistName = artistInfo.name;
        displayArtistName(artistName); // Appel de la fonction pour afficher le nom de l'artiste
      } catch (error) {
        console.error("Erreur :", error);
      }
    })();
  }, []);

  return (
    <div>
      <h1 id="artistName">{artistName}</h1>
    </div>
  );
}

export default Main;
