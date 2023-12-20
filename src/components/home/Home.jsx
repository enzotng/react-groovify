import BlindTestPopup from "./blindTest/BlindTestPopup";
import Latest from "./latestReleases/Latest";
import Recently from "./recentlyPlayed/Recently";
import NavHome from "./NavHome";
import TopHits from "./topHits/TopHits";
import TopItems from "./topItems/TopItems";

import "./Home.scss";

const Home = () => {
  return (
    <>
      <NavHome />
      <main>
        <div className="homeWrapper">
          <section className="c-section">
            <article className="c-article">
              <h1>Groovify's Blind Test</h1>
              <BlindTestPopup />
            </article>
            <article className="c-article">
              <h1>Recently played</h1>
              <Recently />
            </article>
            <article className="c-article">
              <h1>Latest releases</h1>
              <Latest />
            </article>

            <article className="c-article">
              <h1>Current Favorites</h1>
              <TopItems type="tracks" time_range="short_term" />
            </article>

            <article className="c-article">
              <h1>Top charts</h1>
              <TopHits />
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;