"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const movies = [
  {
    title: "Love Today",
    year: "2022",
    image: "lovetoday.jpg",
    footfall: "6.5M+",
    boxOffice: "105C",
    adSpend: "10M+",
    theatricalRun: "100",
  },
  {
    title: "Youth",
    year: "2026",
    image: "youth.jpg",
    footfall: "4.5M+",
    boxOffice: "72C",
    adSpend: "10M+",
    theatricalRun: "4",
  },
  {
    title: "Dragon",
    year: "2025",
    image: "dragon.jpeg",
    footfall: "9M+",
    boxOffice: "150C",
    adSpend: "10M+",
    theatricalRun: "50",
  },
  {
    title: "K.G.F: Chapter 1",
    year: null,
    image: "kgf1.jpeg",
    footfall: "35M+",
    boxOffice: "250C",
    adSpend: "10M+",
    theatricalRun: "100+",
  },
  {
    title: "Kantara",
    year: "2022",
    image: "kantara.jpeg",
    footfall: "10M+",
    boxOffice: "450C",
    adSpend: "10M+",
    theatricalRun: "100",
  },
  {
    title: "Premalu",
    year: "2024",
    image: "Premalu.jpeg",
    footfall: "5M+",
    boxOffice: "136C",
    adSpend: "10M+",
    theatricalRun: "50+",
  },
  {
    title: "Manjummel Boys",
    year: "2024",
    image: "Manjummel Boys.jpeg",
    footfall: "11.5M+",
    boxOffice: "240C",
    adSpend: "10M+",
    theatricalRun: "100",
  },
  {
    title: "K.G.F: Chapter 2",
    year: null,
    image: "kgf2.jpeg",
    footfall: "53M+",
    boxOffice: "1250C",
    adSpend: "10M+",
    theatricalRun: "100",
  },
];

type Movie = (typeof movies)[number];

export default function MovieMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedMovie ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMovie]);

  return (
    <section
      className={isVisible ? "metricsExperience isVisible" : "metricsExperience"}
      aria-label="Recent hit metrics"
      ref={sectionRef}
    >
      <div className="metricsShell">
        <header className="metricsHeader">
          <img
            alt="Recent hit metrics"
            className="metricsTitleAsset"
            draggable={false}
            src="/moviemetrics/recent.svg"
          />
        </header>

        <div className="movieMetricGrid">
          {movies.map((movie, index) => (
            <button
              aria-label={movie.title}
              className="movieMetricPosterCard"
              key={movie.title}
              onClick={() => setSelectedMovie(movie)}
              style={{ "--i": index } as CSSProperties & Record<"--i", number>}
              type="button"
            >
              <img
                alt={`${movie.title} poster`}
                draggable={false}
                src={`/moviemetrics/${encodeURIComponent(movie.image)}`}
              />
            </button>
          ))}
        </div>
      </div>
      {selectedMovie ? (
        <div
          className="movieMetricPaperOverlay"
          aria-modal="true"
          role="dialog"
          onClick={() => setSelectedMovie(null)}
        >
          <div className="movieMetricPaperSheet" onClick={(event) => event.stopPropagation()}>
            <img
              alt=""
              aria-hidden="true"
              className="movieMetricPaperImage"
              draggable={false}
              src="/moviemetrics/paper.png"
            />
            <div className="movieMetricPaperCopy">
              <div className="movieMetricPaperHeading">
                <h3
                  className={
                  selectedMovie.title.startsWith("K.G.F:")
                    ? "isKgfTitle"
                    : selectedMovie.title === "Youth"
                      ? "isYouthTitle"
                    : selectedMovie.title.length > 12
                      ? "isLongTitle"
                      : undefined
                  }
                >
                  {selectedMovie.title.startsWith("K.G.F:") ? (
                    <>
                      <span className="movieMetricTitleLine">K.G.F</span>
                      <span className="movieMetricTitleLine">
                        {selectedMovie.title.replace("K.G.F:", "").trim()}
                      </span>
                    </>
                  ) : selectedMovie.title === "Manjummel Boys" ? (
                    <span className="movieMetricTitleLine">
                      Manjummel
                      <br />
                      Boys
                    </span>
                  ) : (
                    <span className="movieMetricTitleLine">{selectedMovie.title}</span>
                  )}
                  {selectedMovie.year && selectedMovie.title !== "Manjummel Boys" ? (
                    <span className="movieMetricReleaseYear">({selectedMovie.year})</span>
                  ) : null}
                </h3>
              </div>
              <div className="movieMetricPaperStats" aria-label={`${selectedMovie.title} metrics`}>
                <span>
                  <strong>{selectedMovie.footfall}</strong>
                  Footfall
                </span>
                <span>
                  <strong>{selectedMovie.boxOffice}</strong>
                  Box Office
                </span>
                <span>
                  <strong>{selectedMovie.adSpend}</strong>
                  Ad Spend
                </span>
                <span>
                  <strong>{selectedMovie.theatricalRun}</strong>
                  Theatrical Run
                </span>
              </div>
            </div>
            <img
              alt={`${selectedMovie.title} poster`}
              className="movieMetricPaperPoster"
              draggable={false}
              src={`/moviemetrics/${encodeURIComponent(selectedMovie.image)}`}
            />
            <button
              aria-label="Close movie metric paper"
              className="movieMetricPaperClose"
              onClick={() => setSelectedMovie(null)}
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
