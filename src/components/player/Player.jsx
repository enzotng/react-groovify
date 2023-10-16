import { useState } from 'react';
import './Player.scss';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const clientId = "5b3a9581c276435d901439ef12ed7fea";
    const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";
    const accessToken = getAccessToken();

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
        }
    }

    async function controlPlayback(action) {
        const endpoint = {
            play: 'https://api.spotify.com/v1/me/player/play',
            pause: 'https://api.spotify.com/v1/me/player/pause',
            next: 'https://api.spotify.com/v1/me/player/next'
        }[action];

        try {
            await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + accessToken,
                }
            });
            if (action === 'play') setIsPlaying(true);
            if (action === 'pause') setIsPlaying(false);
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    return (
        <main>
            <div className="player-container">
                <h2>Player Control</h2>
                <button onClick={() => controlPlayback(isPlaying ? 'pause' : 'play')}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={() => controlPlayback('next')}>
                    Next
                </button>
            </div>
        </main>
    );
}

export default Player;