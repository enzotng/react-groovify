import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../config/UserContext';
import AjouterPlaylist from '../../../assets/icon/plus.svg';
import ClosePlaylist from '../../../assets/icon/close.svg';

const PlaylistSelectionPopup = ({ onClose, onAddPlaylist, popupAnimation }) => {
    const { userProfile } = useUserContext();
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState(new Set());
    const [removedPlaylistIds, setRemovedPlaylistIds] = useState(new Set());

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!userProfile || !userProfile.accessToken) {
                console.log("AccessToken not found. User needs to login.");
                return;
            }

            try {
                const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${userProfile.accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch playlists");
                }

                const data = await response.json();
                setPlaylists(data.items);
            } catch (error) {
                console.error("Erreur lors de la récupération des playlists:", error);
            }
        };

        fetchPlaylists();
    }, [userProfile]);

    const handleAddPlaylist = (playlist) => {
        onAddPlaylist(playlist);
        setSelectedPlaylistIds(new Set([...selectedPlaylistIds, playlist.id]));
        setTimeout(() => {
            setRemovedPlaylistIds(new Set([...removedPlaylistIds, playlist.id]));
        }, 300);
    };

    return (
        <div className={`popup-overlay ${popupAnimation}`}>
            <div className="popup-wrapper">
                <h2>Sélectionnez des playlists</h2>
                <div className="popup-playlist-wrapper">
                    {playlists.map(playlist => (
                        <div
                            className={`popup-playlist-wrapper-content ${selectedPlaylistIds.has(playlist.id) ? 'removed' : ''}`}
                            key={playlist.id}
                            style={{ display: removedPlaylistIds.has(playlist.id) ? 'none' : 'flex' }}
                        >
                            <div className="popup-playlist-wrapper-image">
                                <img
                                    src={playlist.images[0]?.url}
                                    alt={`${playlist.name} cover`}
                                />
                                {!selectedPlaylistIds.has(playlist.id) && (
                                    <button onClick={() => handleAddPlaylist(playlist)}>
                                        <img src={AjouterPlaylist} alt="Add" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>
                    <img src={ClosePlaylist} alt="Icone Close Playlist" />
                </button>
            </div>
        </div>
    );
};

export default PlaylistSelectionPopup;