import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Main.scss';

function Main() {
  const [newReleases, setNewReleases] = useState([]);

  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    async function getNewReleases(accessToken) {
      try {
        const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        const data = await response.json();
        return data.albums.items;
      } catch (error) {
        console.error("Erreur :", error);
        throw error;
      }
    }

    (async () => {
      try {
        const accessToken = await getAccessToken();
        const newReleases = await getNewReleases(accessToken);
        setNewReleases(newReleases);
        setTimeout(() => setLoading(false), 2000); // Add a delay here
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="slider-wrapper">
      <Swiper spaceBetween={15} slidesPerView={2.25} speed={1000} loop={true}>
        {loading ? (
          Array(5).fill(0).map((_, idx) => (
            <SwiperSlide key={idx}>
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </SwiperSlide>
          ))
        ) : (
          newReleases.map((album, index) => (
            <SwiperSlide key={index}>
              <img src={album.images[0].url} alt="" />
              <div className="slider-wrapper-content">
                <p className="artiste-album">{album.name}</p>
                <p className="artiste-nom">{album.artists[0].name}</p>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );  
}

export default Main;