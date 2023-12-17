import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { UserContext } from "../../config/UserContext";

const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { accessToken } = useContext(UserContext);

    useEffect(() => {
        const getAvailableGenres = async () => {
            if (!accessToken) {
                setError("Token d'accès non disponible.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                if (response.status === 429) {
                    const retryAfter = response.headers.get("Retry-After") || 30;
                    setTimeout(getAvailableGenres, retryAfter * 1000);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Erreur de réponse : ${response.status}`);
                }

                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error("Erreur :", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        getAvailableGenres();
    }, [accessToken]);

    if (error) {
        return <div>Erreur de chargement des genres : {error.message || error}</div>;
    }

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
                    : genres.map((genre, index) => (
                        <SwiperSlide key={index}>
                            <p className="genre">{genre}</p>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default Genre;
