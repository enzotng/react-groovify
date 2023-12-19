import { useEffect, useState } from "react";
import "./Recently.scss";
import { useUserContext } from "../../config/UserContext";

const Recently = () => {
    const [recentTracks, setRecentTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userProfile } = useUserContext();
    const accessToken = userProfile?.accessToken;

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchRecentTracks = async () => {
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
        <div className="grid-wrapper">
            {loading ? (
                Array(6).fill(0).map((_, idx) => (
                    <div key={idx} className="grid-item skeleton-item">
                        {/* Contenu du squelette */}
                    </div>
                ))
            ) : (
                recentTracks.slice(0, 6).map((track, index) => (
                    <div key={index} className="grid-item">
                        <img src={track.track.album.images[0]?.url} alt={track.track.name} />
                        <div className="grid-item-content">
                            <p className="artiste-album">{track.track.name}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Recently;