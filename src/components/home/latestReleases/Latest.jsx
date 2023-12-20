import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { useUserContext } from "../../config/UserContext";

const Latest = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userProfile } = useUserContext();
  const accessToken = userProfile ? userProfile.accessToken : null;

  useEffect(() => {
    async function getNewReleases() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur de réponse : ${response.status}`);
        }

        const data = await response.json();
        return data.albums.items;
      } catch (error) {
        console.error("Erreur :", error);
        throw error;
      }
    }

    (async () => {
      try {
        const releases = await getNewReleases();
        setNewReleases(releases);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  const playAlbum = async (albumUri) => {
    if (!accessToken) return;

    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ context_uri: albumUri })
      });
    } catch (error) {
      console.error("Erreur lors de la lecture de l'album :", error);
    }
  };

  return (
    <div className="slider-wrapper">
      <Swiper className={loading ? "" : "swiper-fade"}
        slidesPerView={2.25}
        speed={1000}
        loop={true}
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
        {loading
          ? Array(5)
            .fill(0)
            .map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="squelette-image"></div>
                <div className="squelette-text"></div>
                <div className="squelette-text-second"></div>
              </SwiperSlide>
            ))
          : newReleases.map((album, index) => (
            <SwiperSlide key={index} onClick={() => playAlbum(album.uri)}>
              <img src={album.images[0].url} alt="" />
              <div className="slider-wrapper-content">
                <p className="artiste-album">{album.name}</p>
                <p className="artiste-nom">{album.artists[0].name}</p>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default Latest;