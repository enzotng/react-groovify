import Latest from "./latestReleases/Latest";
import BlindTest from "./blindTest/BlindTest";
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

            <article className="c-article">
              <h1>Blindtest</h1>
              <BlindTest />
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;