import { useState, useEffect } from 'react';
import { useUserContext } from '../../config/UserContext';
import ColorThief from 'colorthief';
import Play from '../../../assets/icon/play.svg';
import Pause from '../../../assets/icon/pause.svg';
import Previous from '../../../assets/icon/previous.svg';
import Next from '../../../assets/icon/next.svg';
import './Player.scss';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [lastPlayedTrack, setLastPlayedTrack] = useState(null);
    const [progressMs, setProgressMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const [lyrics, setLyrics] = useState('');
    const { accessToken, musixAPI } = useUserContext();

    const [isExpanded, setIsExpanded] = useState(false);

    const [backgroundColor, setBackgroundColor] = useState('rgba(11, 9, 28, 1)');
    const [backgroundColor2, setBackgroundColor2] = useState('rgba(11, 9, 28, 1)');

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (currentTrack) {
            fetchLyrics(currentTrack.name, currentTrack.artists[0].name);

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack?.album?.images[0]?.url;

            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                setBackgroundColor(`rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.3)`);
                setBackgroundColor2(`rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.75)`);
            };
        }
    }, [currentTrack]);

    const getCurrentTrack = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { Authorization: "Bearer " + accessToken }
            });

            if (response.status === 204) {
                setCurrentTrack(null);
                setProgressMs(0);
                setIsPlaying(false);
            } else if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After'), 10) * 1000;
                setTimeout(getCurrentTrack, retryAfter);
            } else if (response.status === 401) {
                console.error("Erreur d'authentification. Veuillez vérifier votre token.");
            } else {
                const data = await response.json();
                setCurrentTrack(data.item);
                setProgressMs(data.progress_ms);
                setDurationMs(data.item.duration_ms);
                setIsPlaying(data.is_playing);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la piste actuelle:", error);
        }
    };

    const getLastPlayedTrack = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After'), 10) * 1000;
                setTimeout(getLastPlayedTrack, retryAfter);
            } else {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    setLastPlayedTrack(data.items[0].track);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la dernière piste écoutée:", error);
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
            getLastPlayedTrack();
        }
    }, [accessToken, currentTrack]);

    console.log(currentTrack);

    const cleanLyrics = (lyrics) => {
        const unwantedText = "\n...\n\n******* This Lyrics is NOT for Commercial use *******";
        let cleanedLyrics = lyrics.replace(unwantedText, '');

        cleanedLyrics = cleanedLyrics.replace(/\n/g, '<br/>');

        return cleanedLyrics;
    };

    const fetchLyrics = async (trackName, artistName) => {
        const encodedTrackName = encodeURIComponent(trackName);
        const encodedArtistName = encodeURIComponent(artistName);
        const url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodedTrackName}&q_artist=${encodedArtistName}&apikey=${musixAPI}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur API Musixmatch: ${response.status}`);
            }
            const data = await response.json();
            if (data.message.body && data.message.body.lyrics) {
                const cleanedLyrics = cleanLyrics(data.message.body.lyrics.lyrics_body);
                setLyrics(cleanedLyrics);
            } else {
                setLyrics('Aucune parole trouvée.');
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des paroles :", error);
            setLyrics('Erreur lors de la récupération des paroles.');
        }
    };

    useEffect(() => {
        if (currentTrack) {
            fetchLyrics(currentTrack.name, currentTrack.artists[0].name);
        }
    }, [currentTrack]);

    const playerWrapperClass = isExpanded ? "player-wrapper expanded" : "player-wrapper";

    return (
        <div className={playerWrapperClass} onClick={toggleExpansion} style={{ backgroundColor: backgroundColor }}>
            <div className="player-container">
                <div className="player-infos">
                    {currentTrack || lastPlayedTrack ? (
                        <>
                            <img src={(currentTrack || lastPlayedTrack)?.album?.images[0]?.url} alt={(currentTrack || lastPlayedTrack)?.name} />
                            <div className="player-content">
                                <p>{(currentTrack || lastPlayedTrack)?.name}</p>
                                <p>{(currentTrack || lastPlayedTrack)?.artists?.map(artist => artist.name).join(", ")}</p>
                            </div>
                        </>
                    ) : "Aucune piste sélectionnée"}
                </div>
                <div className="bouton-wrapper">
                    <button className="cta-bouton" onClick={() => controlPlayback('previous')}>
                        <img src={Previous} alt="Previous" />
                    </button>
                    <button className="pauseplay-bouton" onClick={() => controlPlayback(isPlaying ? 'pause' : 'play')}>
                        {isPlaying ? <img src={Pause} alt="Pause" /> : <img src={Play} alt="Play" />}
                    </button>
                    <button className="cta-bouton" onClick={() => controlPlayback('next')}>
                        <img src={Next} alt="Next" />
                    </button>
                </div>
            </div>
            <div className="progress-container">
                <div className="progress" style={{ width: `${(progressMs / durationMs) * 100}%`, backgroundColor: backgroundColor }}></div>
            </div>
            <div className="time-info">
                <span>{formatTime(progressMs)}</span>
                <span>{calculateRemainingTime()}</span>
            </div>
            <div className="parole-container" style={{ backgroundColor: backgroundColor2 }}>
                <p>Paroles</p>
                <div dangerouslySetInnerHTML={{ __html: lyrics }} />
            </div>
        </div>
    );
};

export default Player;