import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";
import { useUserContext } from "../../config/UserContext";

const TopHits = () => {
    const [topFranceTracks, setTopFranceTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setTrackToPlay } = useUserContext();
    const { userProfile } = useUserContext();
    const accessToken = userProfile ? userProfile.accessToken : null;
    const playlistId = '37i9dQZEVXbIPWwFssbupI';

    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=6`;
                console.log(url);
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!response.ok) {
                    throw new Error(`Erreur de réponse : ${response.status}`);
                }

                const data = await response.json();
                setTopFranceTracks(data.items.map(item => item.track));
            } catch (error) {
                console.error("Erreur :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistTracks();
    }, [accessToken]);

    const playSelectedTrack = (track) => {
        setTrackToPlay(track);
    };

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
                    ? Array(6).fill(0).map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="squelette-image"></div>
                        </SwiperSlide>
                    ))
                    : topFranceTracks.map((track, index) => (
                        <SwiperSlide className="top-france" key={index} onClick={() => playSelectedTrack(track)}>
                            <img src={track.album.images[0]?.url} alt={track.name} />
                            <div className="slider-wrapper-content">
                                <p className="artiste-album">{track.name}</p>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default TopHits;