import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/common/Footer";
import NavFooter from "./components/common/NavFooter";
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import Profile from "./components/profile/Profile";
import Artiste from "./components/artiste/Artiste";
import Auth from "./components/auth/Auth";
import Player from './components/common/player/Player';
import { UserProvider, useUserContext } from "./components/config/UserContext";
import "./App.scss";

const ProtectedRoute = ({ children }) => {
  const { userProfile } = useUserContext();
  return userProfile ? children : <Navigate to="/" />;
};

const Content = () => {
  const { userProfile } = useUserContext();
  const token = userProfile ? userProfile.accessToken : null;

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/artiste/:id" element={<ProtectedRoute><Artiste /></ProtectedRoute>} />
        <Route path="/callback" element={<Auth />} />
      </Routes>
      {token && <Player />}
      {token && <NavFooter />}
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Content />
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;