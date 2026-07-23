"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const movies = [
  {
    title: "Love Today",
    image: "lovetoday.jpg",
    footfall: "6.5M+",
  },
  {
    title: "Youth",
    image: "youth.jpg",
    footfall: "4.5M+",
  },
  {
    title: "Dragon",
    image: "dragon.jpeg",
    footfall: "9M+",
  },
  {
    title: "K.G.F: Chapter 1",
    image: "kgf1.jpeg",
    footfall: "35M+",
  },
  {
    title: "Kantara",
    image: "kantara.jpeg",
    footfall: "10M+",
  },
  {
    title: "Premalu",
    image: "Premalu.jpeg",
    footfall: "5M+",
  },
  {
    title: "Manjummel Boys",
    image: "Manjummel Boys.jpeg",
    footfall: "11.5M+",
  },
  {
    title: "K.G.F: Chapter 2",
    image: "kgf2.jpeg",
    footfall: "53M+",
  },
];

type Movie = (typeof movies)[number];

function splitTitleLines(title: string) {
  if (title.startsWith("K.G.F:")) {
    return ["K.G.F", title.replace("K.G.F:", "").trim()];
  }

  const words = title.split(" ");

  if (words.length <= 1) {
    return [title];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

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
          <button
            aria-label="Close movie metric paper"
            className="movieMetricPaperClose"
            onClick={() => setSelectedMovie(null)}
            type="button"
          >
            x
          </button>
          <div className="movieMetricPaperSheet" onClick={(event) => event.stopPropagation()}>
            <img
              alt=""
              aria-hidden="true"
              className="movieMetricPaperImage"
              draggable={false}
              src="/moviemetrics/paper.png"
            />
            <div className="movieMetricPaperCopy">
              <h3>
                {splitTitleLines(selectedMovie.title).map((line, index) => (
                  <span key={line} className={`movieMetricTitleLine movieMetricTitleLine${index + 1}`}>
                    {line}
                  </span>
                ))}
              </h3>
              <div className="movieMetricPaperStats" aria-label={`${selectedMovie.title} metrics`}>
                <span>
                  <strong>{selectedMovie.footfall}</strong>
                  Footfall
                </span>
                <span>
                  <strong>10M+</strong>
                  Box Office
                </span>
                <span>
                  <strong>10M+</strong>
                  Ad Spend
                </span>
                <span>
                  <strong>10M+</strong>
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
          </div>
        </div>
      ) : null}
    </section>
  );
}
