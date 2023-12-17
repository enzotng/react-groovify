import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { UserContext } from "../../config/UserContext";

const Latest = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { clientId, clientSecret } = useContext(UserContext);

  useEffect(() => {
    const getAccessToken = async () => {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du token");
      }

      return (await response.json()).access_token;
    };

    const getNewReleases = async (accessToken) => {
      const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des nouvelles sorties");
      }

      return (await response.json()).albums.items;
    };

    const fetchNewReleases = async () => {
      try {
        const accessToken = await getAccessToken();
        const releases = await getNewReleases(accessToken);
        setNewReleases(releases);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [clientId]);

  return (
    <div className="slider-wrapper">
      <Swiper
        className={loading ? "" : "swiper-fade"}
        slidesPerView={2.25}
        speed={1000}
        grabCursor={true}
        breakpoints={{
          320: { slidesPerView: 2.25, spaceBetween: 15 },
          768: { slidesPerView: 5.25, spaceBetween: 25 },
        }}
      >
        {loading
          ? Array(5).fill(0).map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="squelette-image"></div>
              </SwiperSlide>
            ))
          : newReleases.map((album, index) => (
              <SwiperSlide key={index}>
                <img src={album.images[0]?.url} alt={album.name} />
                <div className="slider-wrapper-content">
                  <p className="artiste-album">{album.name}</p>
                  <p className="artiste-nom">{album.artists[0]?.name}</p>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default Latest;