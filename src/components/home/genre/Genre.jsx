import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../Swiper.scss";

function Genre() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    const clientId = "5b3a9581c276435d901439ef12ed7fea";
    const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

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

        async function getAvailableGenres(accessToken) {
            try {
                const response = await fetch(
                    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
                    {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                        },
                    }
                );

                const data = await response.json();
                return data.genres;
            } catch (error) {
                console.error("Erreur :", error);
                throw error;
            }
        }

        (async () => {
            try {
                const accessToken = await getAccessToken();
                const availableGenres = await getAvailableGenres(accessToken);
                setGenres(availableGenres);
                setTimeout(() => setLoading(false), 2000);
            } catch (error) {
                console.error("Erreur :", error);
                setLoading(false);
            }
        })();
    }, []);

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
}

export default Genre;
