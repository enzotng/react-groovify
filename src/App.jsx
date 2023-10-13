// Import général
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Nav from "./components/common/Nav";
import Footer from "./components/common/Footer";
import NavFooter from "./components/common/NavFooter";


// Import page
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import Profile from "./components/profile/Profile";
import Artiste from "./components/artiste/Artiste";

// Import CSS
import "./App.scss";

const App = () => (
    <BrowserRouter>
        <>
            {/* <Nav></Nav> */}
            <Routes>
                <Route path="/" element={<Home />} exact />
                <Route path="/explore" element={<Explore />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artiste/:id" element={<Artiste />} />
            </Routes>
            <NavFooter></NavFooter>
            <Footer></Footer>
        </>
    </BrowserRouter>
);

export default App;
