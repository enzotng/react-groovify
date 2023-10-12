// Import général
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/common/Nav";
import Footer from "./components/common/Footer";
import NavFooter from "./components/common/NavFooter";
// Import mainpage
import Main from "./components/mainpage/Main";
import Artiste from "./components/mainpage/Artiste";

// Import page
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Library from "./components/library/Library";
import Profile from "./components/profile/Profile";

// Import CSS
import "./App.scss";

const App = () => (
    <>
      <Nav></Nav>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/library" component={Library} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
      <main>
        <section className="c-section">
          <article className="c-article">
            <h2>Upcomings</h2>
            <Main></Main>
            <div className="c-article-column">
              <div className="c-column-content"></div>
              <div className="c-column-content"></div>
            </div>
          </article>

          <article className="c-article">
            <h2>Recently played</h2>
            <Artiste></Artiste>
          </article>
        </section>
      </main>
      <NavFooter></NavFooter>
      <Footer></Footer>
    </>
);

export default App;