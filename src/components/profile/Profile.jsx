import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const clientId = "5b3a9581c276435d901439ef12ed7fea";
    const clientSecret = "f59b7f4d04394c2ab79b8a19d34cb72e";

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

    async function getUserInfo(accessToken) {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Erreur :", error);
        throw error;
      }
    }

    async function fetchData() {
      try {
        const accessToken = await getAccessToken();
        await getUserInfo(accessToken);
      } catch (error) {
        console.error("Erreur :", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h2>User Profile</h2>
        <p>Name: {userInfo.display_name}</p>
        <p>Email: {userInfo.email}</p>
        <p>Country: {userInfo.country}</p>
        <img src={userInfo?.images?.[0]?.url} alt="Profile" />
      </div>
    </main>
  );
}

export default Profile;
