// Import général
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/common/Footer";
import NavFooter from "./components/common/NavFooter";

// Import page
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import Profile from "./components/profile/Profile";
import Artiste from "./components/artiste/Artiste";
// import Player from "./components/player/Player";
import Auth from "./components/auth/Auth";

// Import du UserProvider
import { UserProvider } from "./components/config/UserContext";  // Assurez-vous que le chemin est correct

// Import CSS
import "./App.scss";

const App = () => (
    <UserProvider>
        <BrowserRouter>
            <>
                {/* <Nav></Nav> */}
                <Routes>
                    <Route path="/" element={<Auth />} exact />
                    <Route path="/home" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/artiste/:id" element={<Artiste />} />
                    <Route path="/callback" element={<Auth />} />
                </Routes>
                <NavFooter></NavFooter>
                {/* <Player></Player> */}
                <Footer></Footer>
            </>
        </BrowserRouter>
    </UserProvider>
);

export default App;
