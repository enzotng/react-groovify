import { useState, useEffect, useCallback } from 'react';
import ColorThief from 'colorthief';
import Aleatoire from '../../../assets/icon/shuffle.svg';
import Previous from '../../../assets/icon/previous.svg';
import Play from '../../../assets/icon/play.svg';
import Pause from '../../../assets/icon/pause.svg';
import Next from '../../../assets/icon/next.svg';
import Restart from '../../../assets/icon/restart.svg';
import CloseBouton from '../../../assets/icon/c-vector-chevron.svg';
import ShareBouton from '../../../assets/icon/share.svg';
import { Share } from '@capacitor/share';
import { useUserContext } from '../../config/UserContext';
import './Player.scss';

const Player = ({ externalTrack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [progressMs, setProgressMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const [lyrics, setLyrics] = useState('');
    const [isShuffle, setIsShuffle] = useState(false);
    const { musixAPI } = useUserContext();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const { userProfile } = useUserContext();
    const accessToken = userProfile?.accessToken;

    const [backgroundColor, setBackgroundColor] = useState('rgba(11, 9, 28, 1)');
    const [backgroundColor2, setBackgroundColor2] = useState('rgba(11, 9, 28, 1)');
    const boxShadowColor = backgroundColor.replace(/[^,]+(?=\))/, '0.2');

    const openPlayer = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const closePlayer = (e) => {
        e.stopPropagation();
        setIsExpanded(false);
    };

    const shareTrack = async () => {
        if (currentTrack && currentTrack.external_urls && currentTrack.external_urls.spotify) {
            try {
                await Share.share({
                    title: 'Découvrez cette piste',
                    text: `Écoutez "${currentTrack.name}" sur Spotify!`,
                    url: currentTrack.external_urls.spotify,
                    dialogTitle: 'Partagez cette piste',
                });
            } catch (error) {
                console.error("Erreur lors du partage de la piste :", error);
            }
        } else {
            console.log("Aucun lien de piste disponible pour le partage.");
        }
    };    

    useEffect(() => {
        if (currentTrack) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack?.album?.images[0]?.url;

            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                setBackgroundColor(`rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.2)`);
                setBackgroundColor2(`rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 1)`);
            };
        }
    }, [currentTrack]);

    const fetchCurrentTrack = useCallback(async () => {
        if (!accessToken) {
            console.log("Player: Pas de accessToken disponible.");
            return;
        }

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });

            if (!response.ok) {
                console.error("Erreur lors de la récupération de la piste actuelle:", response.statusText);
                return;
            }

            const data = await response.json();
            setCurrentTrack(data.item);
            setProgressMs(data.progress_ms);
            setDurationMs(data.item.duration_ms);
            setIsPlaying(data.is_playing);
        } catch (error) {
            console.error("Erreur lors de la récupération de la piste actuelle:", error);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 1000);
        return () => clearInterval(interval);
    }, [fetchCurrentTrack]);

    const getCurrentTrack = useCallback(async () => {
        if (!accessToken) {
            console.log("Player: Pas de accessToken disponible.");
            return;
        }
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
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
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            getCurrentTrack();
        }
    }, [accessToken, getCurrentTrack]);

    const playExternalTrack = useCallback(async (track) => {
        const playEndpoint = 'https://api.spotify.com/v1/me/player/play';
        try {
            await fetch(playEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uris: [track.uri] })
            });
            setCurrentTrack(track);
            setIsPlaying(true);
        } catch (error) {
            console.error("Erreur lors de la lecture de la piste :", error);
        }
    }, [accessToken]);

    useEffect(() => {
        console.log('Nouvelle piste reçue:', externalTrack);
        if (externalTrack) {
            playExternalTrack(externalTrack);
        }
    }, [externalTrack, playExternalTrack]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const controlPlayback = async (action) => {
        let endpoint;
        let method = 'PUT';

        switch (action) {
            case 'play':
            case 'pause':
                endpoint = `https://api.spotify.com/v1/me/player/${action}`;
                break;
            case 'next':
            case 'previous':
                endpoint = `https://api.spotify.com/v1/me/player/${action}`;
                method = 'POST';
                break;
            default:
                console.error('Action non reconnue:', action);
                return;
        }

        try {
            await fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                body: method === 'PUT' ? JSON.stringify({}) : null
            });

            if (action === 'play' || action === 'next') setIsPlaying(true);
            if (action === 'pause') setIsPlaying(false);

            getCurrentTrack();
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const toggleShuffle = async () => {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffle}`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + accessToken,
                }
            });
            setIsShuffle(!isShuffle);
        } catch (error) {
            console.error("Erreur lors du changement du mode shuffle :", error);
        }
    };

    const replayCurrentTrack = async () => {
        if (!currentTrack) return;

        try {
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        } catch (error) {
            console.error("Erreur lors de la reprise de la piste :", error);
        }
    };

    const cleanLyrics = (lyrics) => {
        const unwantedText = "\n...\n\n******* This Lyrics is NOT for Commercial use *******\n(1409624065245)";
        let cleanedLyrics = lyrics.replace(unwantedText, '');

        cleanedLyrics = cleanedLyrics.replace(/\n/g, '<br/>');

        return cleanedLyrics;
    };

    const fetchLyrics = useCallback(async (trackName, artistName) => {
        const encodedTrackName = encodeURIComponent(trackName);
        const encodedArtistName = encodeURIComponent(artistName);
        const url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodedTrackName}&q_artist=${encodedArtistName}&apikey=${musixAPI}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Musixmatch Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.message.body && data.message.body.lyrics) {
                const lyricsBody = data.message.body.lyrics.lyrics_body;
                setLyrics(cleanLyrics(lyricsBody));
            } else {
                setLyrics('Aucune parole trouvée.');
            }
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            setLyrics('Error fetching lyrics.');
        }
    }, [musixAPI]);

    useEffect(() => {
        if (currentTrack) {
            fetchLyrics(currentTrack.name, currentTrack.artists.map((artist) => artist.name).join(", "));
        }
    }, [currentTrack, fetchLyrics]);

    const startTimer = () => {
        if (!intervalId) {
            const id = setInterval(() => {
                setElapsedTime((prev) => {
                    if (prev < durationMs) {
                        return prev + 1000;
                    } else {
                        clearInterval(id);
                        return durationMs;
                    }
                });
            }, 1000);
            setIntervalId(id);
        }
    };

    const stopTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            startTimer();
        } else {
            stopTimer();
        }
        return () => stopTimer();
    }, [isPlaying]);

    useEffect(() => {
        if (currentTrack) {
            setDurationMs(currentTrack.duration_ms);
            setElapsedTime(progressMs);
        }
    }, [currentTrack, progressMs]);

    const calculateRemainingTime = () => {
        const remainingMs = durationMs - elapsedTime;
        return "-" + formatTime(remainingMs);
    };

    const playerWrapperClass = isExpanded ? "player-wrapper expanded" : "player-wrapper";

    return (
        <div className={playerWrapperClass} onClick={openPlayer} style={{ backgroundColor: backgroundColor }}>
            {isExpanded && (
                <div className="close-bouton-wrapper">
                    <button className="close-bouton" onClick={closePlayer}>
                        <img src={CloseBouton} alt="Close" />
                    </button>
                    <span>Groovify</span>
                    <button className="share-bouton" onClick={shareTrack}>
                        <img src={ShareBouton} alt="Share Bouton" />
                    </button>
                </div>
            )}
            <div className="player-container">
                <div className="player-infos">
                    {currentTrack ? (
                        <>
                            <img
                                src={(currentTrack)?.album?.images[0]?.url}
                                alt={(currentTrack)?.name}
                                style={{ boxShadow: isExpanded ? `0px 12px 70px 0px ${boxShadowColor}` : 'none' }}
                            />
                            <div className="player-content">
                                <p>{(currentTrack)?.name}</p>
                                <p>{(currentTrack)?.artists?.map(artist => artist.name).join(", ")}</p>
                            </div>
                        </>
                    ) : <p>Aucune piste en cours</p>}
                </div>
                <div className="cta-wrapper">
                    <button className="aleatoire-bouton" onClick={toggleShuffle}>
                        <img src={Aleatoire} alt="Aleatoire" />
                    </button>
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
                    <button className="list-bouton" onClick={replayCurrentTrack}>
                        <img src={Restart} alt="Restart" />
                    </button>
                </div>
            </div>
            <div className="progress-container">
                <div className="progress" style={{ width: `${(progressMs / durationMs) * 100}%` }}></div>
            </div>
            <div className="time-info">
                <span>{formatTime(elapsedTime)}</span>
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