import {
  AboutExperience,
  AdaptationProof,
  ActualAskIntro,
  BathroomExperience,
  CommonThread,
  CoreCapabilities,
  GridSlideExperience,
  HostelGenreProof,
  IntroExperience,
  MarketingMediaPlan,
  MarketingMediaPlanTable,
  MovieMetrics,
  Noticeboard,
  Noticeboard2,
  Noticeboard3,
  PosterScroll,
  RegionalAudience,
  SponsorshipExperience,
  TitleScrollAnimation,
  WhyThisFilm,
} from "./components/sections";
import SectionJumpNavigation from "./components/SectionJumpNavigation";

export default function Home() {
  return (
    <main>
      <SectionJumpNavigation />
      <IntroExperience />
      <SponsorshipExperience />
      <PosterScroll />
      <BathroomExperience />
      <GridSlideExperience />

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
      <RegionalAudience />
      <HostelGenreProof />
      <MovieMetrics />
      <CommonThread />
      <WhyThisFilm />
      <Noticeboard />
      <Noticeboard2 />
      <Noticeboard3 />
      <TitleScrollAnimation />
      <AdaptationProof />
      <ActualAskIntro />
      <MarketingMediaPlan />
      <MarketingMediaPlanTable />
    </main>
  );
}
