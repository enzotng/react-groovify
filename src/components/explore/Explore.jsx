import React, { useState, useEffect } from 'react';
import './Explore.scss';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const clientId = "5b3a9581c276435d901439ef12ed7fea";
  const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

  const [activeTab, setActiveTab] = useState('tracks');
  const [selectedArtistId, setSelectedArtistId] = useState(null);

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

  async function searchSpotify(accessToken) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,album,artist`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      setTracks(data.tracks.items);
      setAlbums(data.albums.items);
      setArtists(data.artists.items);
    } catch (error) {
      console.error("Erreur :", error);
      throw error;
    }
  }

  async function getArtistAlbums(artistId, accessToken) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      setAlbums(data.items);
    } catch (error) {
      console.error("Erreur :", error);
      throw error;
    }
  }

  function getArtistNames(artists) {
    return artists.map(artist => artist.name).join(', ');
  }

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (query) {
      const timer = setTimeout(async () => {
        const accessToken = await getAccessToken();
        searchSpotify(accessToken);
      }, 200);

      setTimeoutId(timer);
    } else {
      setArtists([]);
      setTracks([]);
      setAlbums([]);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (selectedArtistId) {
      const fetchAlbums = async () => {
        const accessToken = await getAccessToken();
        getArtistAlbums(selectedArtistId, accessToken);
      };

      fetchAlbums();
    }
  }, [selectedArtistId]);

  const seenArtists = {};
  const uniqueArtists = artists.filter(artist => {
    const lowercaseName = artist.name.toLowerCase();
    if (seenArtists[lowercaseName]) {
      return false;
    }
    seenArtists[lowercaseName] = true;
    return true;
  });

  const [genres, setGenres] = useState([]);

  async function getGenres(accessToken) {
    try {
      const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Erreur lors de la récupération des genres :", error);
    }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      const accessToken = await getAccessToken();
      getGenres(accessToken);
    };

    fetchGenres();
  }, []);

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const colors = shuffle([
    'rgba(150,0,0,0.8)',
    'rgba(150,85,0,0.8)',
    'rgba(130,133,20,0.8)',
    'rgba(60,130,55,0.8)',
    'rgba(50,130,120,0.8)',
    'rgba(40,120,130,0.8)',
    'rgba(20,100,150,0.8)',
    'rgba(110,50,140,0.8)',
    'rgba(150,0,130,0.8)',
    'rgba(150,55,55,0.8)'
  ]);

  function getRandomColor(index) {
    return colors[index % colors.length];
  }

  return (
    <main>
      <div className='explore-wrapper'>
        <div className="heading-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="11.2%" stopColor="rgb(78, 62, 255)" />
                <stop offset="91.1%" stopColor="rgb(164, 69, 255)" />
              </linearGradient>
            </defs>
            <path fill="url(#gradient)" d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z">
            </path>
          </svg>

          <h1>Explore</h1>
        </div>
        <div className="input-wrapper">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Artists, Songs, Podcasts & More..." />
          {query && (
            <svg className="clear-input" onClick={() => setQuery('')} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          )}
        </div>
        {query && (
          <div className="tabs">
            <div className={activeTab === 'tracks' ? 'tab active' : 'tab'} onClick={() => setActiveTab('tracks')}>Musiques</div>
            <div className={activeTab === 'albums' ? 'tab active' : 'tab'} onClick={() => setActiveTab('albums')}>Albums</div>
            <div className={activeTab === 'artists' ? 'tab active' : 'tab'} onClick={() => setActiveTab('artists')}>Artistes</div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <ul>
            {tracks.map((track, index) => (
              <li key={index}>
                <img src={track.album.images[0]?.url} alt={track.name} width="50" height="50" />
                <div className="text-wrapper">
                  <p>{track.name}</p>
                  <p>{getArtistNames(track.artists)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'albums' && (
          <ul>
            {albums.map((album, index) => (
              <li key={index}>
                <img src={album.images[0]?.url} alt={album.name} width="50" height="50" />
                <div className="text-wrapper">
                  <p>{album.name}</p>
                  <p>{getArtistNames(album.artists)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}


        {activeTab === 'artists' && (
          <ul>
            {uniqueArtists.map((artist, index) => (
              <li key={index}>{artist.name}</li>
            ))}
          </ul>
        )}

        {!query && (
          <div className="genre-cards">
            {genres.map((genre, index) => (
              <div
                key={index}
                className="genre-card"
                style={{ background: getRandomColor(index) }}
              >
                <p>{genre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Explore;