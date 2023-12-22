import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Footer from "./components/common/footer/Footer";
import NavbarMenu from "./components/common/navbarMenu/NavbarMenu";
import Home from "./components/home/Home";
import BlindTest from "./components/home/blindTest/BlindTest";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import LibraryDetails from "./components/library/LibraryDetails";
import Profile from "./components/profile/Profile";
import Artiste from "./components/artiste/Artiste";
import Auth from "./components/auth/Auth";
import Player from './components/common/player/Player';
import { UserProvider, useUserContext } from "./components/config/UserContext";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
import "./App.scss";

const ProtectedRoute = ({ children }) => {
  const { userProfile } = useUserContext();
  return userProfile ? children : <Navigate to="/" />;
};

const Content = ({ setCurrentTrackForPlayer, currentTrackForPlayer }) => {
  const { userProfile } = useUserContext();
  const token = userProfile ? userProfile.accessToken : null;
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/blindtest" element={<ProtectedRoute><BlindTest /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/library/details/:playlistId" element={<ProtectedRoute><LibraryDetails /></ProtectedRoute>} />
        <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/artiste/:id" element={<ProtectedRoute><Artiste /></ProtectedRoute>} />
        <Route path="/callback" element={<Auth />} />
      </Routes>
      {token && <Player externalTrack={currentTrackForPlayer} />}
      <NavbarMenu />
    </>
  );
};

const App = () => {
  const [currentTrackForPlayer, setCurrentTrackForPlayer] = useState(null);
  return (
    <UserProvider>
      <BrowserRouter>
        <Content setCurrentTrackForPlayer={setCurrentTrackForPlayer} currentTrackForPlayer={currentTrackForPlayer} />
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;