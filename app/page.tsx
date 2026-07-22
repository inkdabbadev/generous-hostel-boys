import {
  AboutExperience,
  AdaptationProof,
  CoreCapabilities,
  HostelGenreProof,
  IntroExperience,
  MarketingMediaPlan,
  MovieMetrics,
  RegionalAudience,
  TitleScrollAnimation,
} from "./components/sections";

export default function Home() {
  return (
    <main>
      <IntroExperience />

      <section className="hero">
        <div className="heroImage" aria-hidden="true" />
        <div className="heroShade" aria-hidden="true" />
        <nav className="topbar" aria-label="Deck navigation">
          <span className="brand">
            <img
              src="/GENEROUS%20Logo.png"
              alt="GENEROUS Entertainments"
              draggable={false}
            />
          </span>
        </nav>

        <div className="heroContent">
          <h1>
            <span className="headlineLine headlineLineWhite">Watch this</span>
            <span className="headlineLine headlineLineGold">at your own risk</span>
          </h1>
        </div>
      </section>

      <AboutExperience />
      <CoreCapabilities />
      <MovieMetrics />
      <RegionalAudience />
      <HostelGenreProof />
      <TitleScrollAnimation />
      <AdaptationProof />
      <MarketingMediaPlan />
    </main>
  );
}
