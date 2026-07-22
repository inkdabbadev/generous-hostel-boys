"use client";

import { BarChart3, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const movies = [
  {
    title: "Love Today",
    image: "lovetoday.jpg",
    year: "2022",
    rating: "8.1 / 10",
    boxOffice: "Rs. 105 Crore",
    budget: "Rs. 5 Crore",
    run: "100+ Days",
  },
  {
    title: "Youth",
    image: "youth.jpg",
    year: "2002",
    rating: "6.5 / 10",
    boxOffice: "~Rs. 15-20 Crore",
    budget: "~Rs. 4-5 Crore",
    run: "100+ Days",
  },
  {
    title: "Dragon",
    image: "dragon.jpeg",
    year: "2025",
    rating: "8.0 / 10",
    boxOffice: "Rs. 150 Crore",
    budget: "Rs. 37 Crore",
    run: "50+ Days",
  },
  {
    title: "K.G.F: Chapter 1",
    image: "kgf1.jpeg",
    year: "2018",
    rating: "8.2 / 10",
    boxOffice: "Rs. 250 Crore",
    budget: "Rs. 80 Crore",
    run: "100+ Days",
  },
  {
    title: "K.G.F: Chapter 2",
    image: "kgf2.jpeg",
    year: "2022",
    rating: "8.3 / 10",
    boxOffice: "Rs. 1,200-1,250 Crore",
    budget: "Rs. 100 Crore",
    run: "100+ Days",
  },
  {
    title: "Kantara",
    image: "kantara.jpeg",
    year: "2022",
    rating: "8.2 / 10",
    boxOffice: "Rs. 400-450 Crore",
    budget: "Rs. 16 Crore",
    run: "100+ Days",
  },
  {
    title: "Premalu",
    image: "Premalu.jpeg",
    year: "2024",
    rating: "7.8 / 10",
    boxOffice: "Rs. 135+ Crore",
    budget: "Rs. 3-5 Crore",
    run: "100+ Days",
  },
  {
    title: "Manjummel Boys",
    image: "Manjummel Boys.jpeg",
    year: "2024",
    rating: "8.3 / 10",
    boxOffice: "Rs. 240+ Crore",
    budget: "Rs. 20 Crore",
    run: "75+ Days",
  },
];

type MovieMetric = (typeof movies)[number];

export default function MovieMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieMetric | null>(null);

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
    if (!selectedMovie) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMovie(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedMovie]);

  return (
    <section
      className={isVisible ? "metricsExperience isVisible" : "metricsExperience"}
      aria-labelledby="metrics-heading"
      ref={sectionRef}
    >
      <div className="metricsShell">
        <div className="metricsHeader">
          <span>
            <BarChart3 aria-hidden="true" size={20} strokeWidth={2.4} />
            Research board
          </span>
          <h2 id="metrics-heading">Recent Hit Metrics</h2>
        </div>

        <div className="movieMetricGrid">
          {movies.map((movie, index) => (
            <article
              className="movieMetricCard"
              key={movie.title}
              onClick={() => setSelectedMovie(movie)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedMovie(movie);
                }
              }}
              role="button"
              tabIndex={0}
              style={{ "--i": index } as CSSProperties & Record<"--i", number>}
            >
              <div className="movieMetricPoster">
                <img
                  alt={`${movie.title} poster`}
                  draggable={false}
                  src={`/moviemetrics/${encodeURIComponent(movie.image)}`}
                />
              </div>
              <div className="movieCardTop">
                <span>{movie.year}</span>
                <strong>{movie.rating}</strong>
              </div>
              <h3>{movie.title}</h3>
              <dl>
                <div>
                  <dt>Worldwide Box Office</dt>
                  <dd>{movie.boxOffice}</dd>
                </div>
                <div>
                  <dt>Estimated Budget</dt>
                  <dd>{movie.budget}</dd>
                </div>
                <div>
                  <dt>Theatrical Run</dt>
                  <dd>{movie.run}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>

      {selectedMovie ? (
        <div
          className="movieMetricOverlay"
          onClick={() => setSelectedMovie(null)}
          role="presentation"
        >
          <article
            aria-label={`${selectedMovie.title} expanded metrics`}
            className="movieMetricExpanded"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close expanded movie metrics"
              className="movieMetricClose"
              onClick={() => setSelectedMovie(null)}
              type="button"
            >
              <X aria-hidden="true" size={24} strokeWidth={2.8} />
            </button>
            <div className="movieMetricExpandedPoster">
              <img
                alt={`${selectedMovie.title} poster`}
                draggable={false}
                src={`/moviemetrics/${encodeURIComponent(selectedMovie.image)}`}
              />
            </div>
            <div className="movieMetricExpandedCopy">
              <div className="movieMetricExpandedTop">
                <span>{selectedMovie.year}</span>
                <strong>{selectedMovie.rating}</strong>
              </div>
              <h3>{selectedMovie.title}</h3>
              <dl>
                <div>
                  <dt>Worldwide Box Office</dt>
                  <dd>{selectedMovie.boxOffice}</dd>
                </div>
                <div>
                  <dt>Estimated Budget</dt>
                  <dd>{selectedMovie.budget}</dd>
                </div>
                <div>
                  <dt>Theatrical Run</dt>
                  <dd>{selectedMovie.run}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
