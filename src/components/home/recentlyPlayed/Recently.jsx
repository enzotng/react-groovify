// import { useEffect, useState } from "react";

// const Recently = () => {
//   const [recentlyPlayed, setRecentlyPlayed] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const clientId = "5b3a9581c276435d901439ef12ed7fea";
//   const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

//   useEffect(() => {
//     const getAccessToken = async () => {
//       try {
//         const response = await fetch("https://accounts.spotify.com/api/token", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
//           },
//           body: "grant_type=client_credentials",
//         });

//         const data = await response.json();
//         return data.access_token;
//       } catch (error) {
//         console.error("Error:", error);
//         throw error;
//       }
//     };

//     const getRecentlyPlayed = async (accessToken) => {
//       try {
//         const response = await fetch(
//           "https://api.spotify.com/v1/me/player/recently-played?limit=10",
//           {
//             headers: {
//               Authorization: "Bearer " + accessToken,
//             },
//           }
//         );

//         const data = await response.json();
//         return data.items;
//       } catch (error) {
//         console.error("Error:", error);
//         throw error;
//       }
//     };

//     (async () => {
//       try {
//         const accessToken = await getAccessToken();
//         const recentlyPlayed = await getRecentlyPlayed(accessToken);
//         setRecentlyPlayed(recentlyPlayed);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error:", error);
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className="recently-played-wrapper">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {recentlyPlayed.map((track, index) => (
//             <li key={index}>
//               <img src={track.track.album.images[0].url} alt={track.track.name} />
//               <p>{track.track.name}</p>
//               <p>{track.track.artists[0].name}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Recently;
