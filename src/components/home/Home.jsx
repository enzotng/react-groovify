import Latest from "./latestReleases/Latest";
// import Recently from "./recentlyPlayed/Recently";
import NavHome from "./NavHome";

import "./Home.scss";

const Home = () => {
  return (
    <>
      <NavHome />
      <main>
        <div className="homeWrapper">
          <section className="c-section">
            <article className="c-article">
              <h1>Recently played</h1>
              {/* <Recently /> */}
            </article>
            <article className="c-article">
            <h1>Latest releases</h1>
              <Latest />
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
                <div className="c-column-content">
                  <p>Hip/Hop</p>
                </div>
                <div className="c-column-content">
                  <p>Hip/Hop</p>
                </div>
              </div>
            </article>

            <article className="c-article">
              <h1>Top charts</h1>
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
