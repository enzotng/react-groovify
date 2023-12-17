import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { UserContext } from "../../config/UserContext";

const Recently = () => {
    const [recentTracks, setRecentTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useContext(UserContext);

    useEffect(() => {
        const fetchRecentTracks = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!response.ok) {
                    throw new Error(`Erreur de réponse : ${response.status}`);
                }

                const data = await response.json();
                setRecentTracks(data.items);
            } catch (error) {
                console.error("Erreur :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentTracks();
    }, [accessToken]);

    return (
        <div className="slider-wrapper">
            <Swiper
                className={loading ? "" : "swiper-fade"}
                slidesPerView={2.25}
                speed={1000}
                loop={true}
                grabCursor={true}
                breakpoints={{
                    320: { slidesPerView: 2.25, spaceBetween: 15 },
                    768: { slidesPerView: 5.25, spaceBetween: 25 },
                }}
            >
                {loading ? (
                    Array(5).fill(0).map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="squelette-image"></div>
                            <div className="squelette-text"></div>
                            <div className="squelette-text-second"></div>
                        </SwiperSlide>
                    ))
                ) : (
                    recentTracks.map((track, index) => (
                        <SwiperSlide key={index}>
                            <img src={track.track.album.images[0]?.url} alt={track.track.name} />
                            <div className="slider-wrapper-content">
                                <p className="artiste-album">{track.track.name}</p>
                                <p className="artiste-nom">{track.track.artists.map(artist => artist.name).join(", ")}</p>
                            </div>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </div>
    );
};

export default Recently;
