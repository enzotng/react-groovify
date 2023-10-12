import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Main.scss';

function Main() {
  const [newReleases, setNewReleases] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [left, setLeft] = useState(0);

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
      } catch (error) {
        console.error("Erreur :", error);
      }
    })();
  }, []);

  const prevSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? newReleases.length - 1 : prevIndex - 1;
      setLeft((prevLeft) => prevLeft + 400); // 400 est la largeur d'un slide, vous pouvez changer cela si nécessaire
      return newIndex;
    });
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % newReleases.length;
      setLeft((prevLeft) => prevLeft - 400); // 400 est la largeur d'un slide, vous pouvez changer cela si nécessaire
      return newIndex;
    });
  };

  return (
    <div className="slider-wrapper">
      <Swiper
        spaceBetween={20}
        slidesPerView={2.5}
        speed={1000}
      >
        {newReleases.map((album, index) => (
          <SwiperSlide key={index}>
            <img src={album.images[0].url} alt="" />
            <p>{album.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Main;