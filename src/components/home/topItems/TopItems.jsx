import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { UserContext } from "../../config/UserContext";

const TopItems = ({ type = 'tracks', time_range = 'short_term' }) => {
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useContext(UserContext);

    useEffect(() => {
        const fetchTopItems = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=6`;
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!response.ok) {
                    throw new Error(`Erreur de réponse : ${response.status}`);
                }

                const data = await response.json();
                setTopItems(data.items);
            } catch (error) {
                console.error("Erreur :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopItems();
    }, [accessToken, type, time_range]);

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
                    ? Array(10).fill(0).map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="squelette-image"></div>
                        </SwiperSlide>
                    ))
                    : topItems.map((item, index) => (
                        <SwiperSlide className="top-items" key={index}>
                            <img src={type === 'tracks' ? item.album.images[0]?.url : item.images[0]?.url} alt={item.name} />
                            <div className="slider-wrapper-content">
                                <p className="artiste-album">{item.name}</p>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default TopItems;