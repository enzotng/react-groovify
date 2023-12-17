import { useState, useEffect } from 'react';
import { useUserContext } from '../../config/UserContext';
import './Player.scss';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [progressMs, setProgressMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const { accessToken } = useUserContext();

    // console.log("Access Token:", accessToken);

    const getCurrentTrack = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { Authorization: "Bearer " + accessToken }
            });
            // console.log("Response Status:", response.status);

            if (response.status === 204) {
                setCurrentTrack(null);
                setProgress(0);
            } else if (response.status === 401) {
                // console.error("Erreur d'authentification. Veuillez vérifier votre token.");
            } else {
                const data = await response.json();
                // console.log("Currently Playing Data:", data);
                setCurrentTrack(data.item);
                setProgressMs(data.progress_ms);
                setDurationMs(data.item.duration_ms);
            }
        } catch (error) {
            // console.error("Erreur lors de la récupération de la piste actuelle:", error);
        }
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const calculateRemainingTime = () => {
        const remainingMs = durationMs - progressMs;
        return "-" + formatTime(remainingMs);
    };

    const controlPlayback = async (action) => {
        const endpoint = {
            play: 'https://api.spotify.com/v1/me/player/play',
            pause: 'https://api.spotify.com/v1/me/player/pause',
            next: 'https://api.spotify.com/v1/me/player/next'
        }[action];

        try {
            const method = action === 'next' ? 'POST' : 'PUT';

            await fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                body: action === 'next' ? null : JSON.stringify({})
            });

            if (action === 'play' || action === 'next') setIsPlaying(true);
            if (action === 'pause') setIsPlaying(false);
            getCurrentTrack();
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            getCurrentTrack();
        }
    }, [accessToken, currentTrack]);

    return (
        <div className="player-wrapper">
            <div className="player-container">
                <div className="player-infos">
                    {currentTrack && (
                        <>
                            <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
                            <div className="player-content">
                                <p>{currentTrack.name}</p>
                                <p>{currentTrack.artists.map(artist => artist.name).join(", ")}</p>
                            </div>
                        </>
                    )}
                </div>
                <button onClick={() => controlPlayback(isPlaying ? 'pause' : 'play')}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <div className="progress-container">
                <div className="progress" style={{ width: `${(progressMs / durationMs) * 100}%` }}></div>
                <div className="time-info">
                    <span>{formatTime(progressMs)}</span>
                    <span>{calculateRemainingTime()}</span>
                </div>
            </div>
        </div>
    );
};

export default Player;