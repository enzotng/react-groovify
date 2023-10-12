import React from "react";

import Main from "../mainpage/Main";
import Artiste from "../mainpage/Artiste";

import "./Home.scss";

function Home() {
  return (
    <main>
      <div className="homeWrapper">
        <section className="c-section">
          <h1>Latest releases</h1>
          <article className="c-article">
            <Main></Main>
          </article>

          <article className="c-article">
            <h1>Musics genre</h1>
            <div className="c-article-column">
              <div className="c-column-content">
                <p>Rap</p>
              </div>
              <div className="c-column-content">
                <p>Hip/Hop</p>
              </div>
            </div>
          </article>

          <article className="c-article">
            <h1>Top charts</h1>
            <Artiste></Artiste>
          </article>
        </section>
      </div>
    </main>

  );
}

export default Home;
