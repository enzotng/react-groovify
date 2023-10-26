// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/common/Footer";
import NavFooter from "./components/common/NavFooter";
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import Profile from "./components/profile/Profile";
import Artiste from "./components/artiste/Artiste";
import Auth from "./components/auth/Auth";
import { UserProvider, useUserContext } from "./components/config/UserContext";
import "./App.scss";

const Content = () => {
  const { userProfile } = useUserContext();
  const token = userProfile ? userProfile.accessToken : null;

  // if (!token) {
  //   return <Navigate to="/" />;
  // }

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} exact />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/artiste/:id" element={<Artiste />} />
        <Route path="/callback" element={<Auth />} />
      </Routes>
      {token && <NavFooter />}
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <>
          <Content />
          <Footer />
        </>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
