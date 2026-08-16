import {
  AboutExperience,
  AdaptationProof,
  ActualAskIntro,
  BathroomExperience,
  CommonThread,
  CoreCapabilities,
  GridSlideExperience,
  HostelGenreProof,
  HistorySection,
  IntroExperience,
  MarketingMediaPlan,
  MarketingMediaPlanTable,
  MovieMetrics,
  Noticeboard,
  PlotIntro,
  PostTitleCampaBadge,
  PosterScroll,
  PremiumSlot,
  RegionalAudience,
  SponsorshipExperience,
  ThankYou,
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
      {/* <GridSlideExperience /> */}

      {/* <section className="hero">
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
      </section> */}
      {/* <CoreCapabilities /> */}
      <RegionalAudience />
      <HostelGenreProof />
      {/* <MovieMetrics /> */}
      <CommonThread />
      <WhyThisFilm />
      <Noticeboard />
      <TitleScrollAnimation />
      <PostTitleCampaBadge />
      <AdaptationProof />
      <PlotIntro />
      <ActualAskIntro />
      <MarketingMediaPlan />
      <HistorySection />
      <PremiumSlot />
      <AboutExperience />
      <MarketingMediaPlanTable />
      <ThankYou />
    </main>
  );
}


