"use client";

import { BadgeIndianRupee, Clapperboard, Gauge, Projector, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const movies = [
  { title: "Madame Web", file: "Madame Web.jpg", tag: "Marvel title" },
  { title: "Tumbbad", file: "Tumbbad.jpg", tag: "Regional breakout" },
  { title: "Kadaisi Ulagar Por", file: "Kadaisi Ulagar Por.jpg", tag: "Tamil release" },
  { title: "Manidhargal", file: "Manidhargal.jpg", tag: "Regional title" },
  { title: "Kumara Sambhavan", file: "Kumara Sambhavan.jpg", tag: "Regional title" },
  { title: "Thandakaranyam", file: "Thandakaranyam.jpg", tag: "Regional title" },
  { title: "Yolo", file: "Yolo.jpg", tag: "Youth title" },
  { title: "Sotta Sotta Nanaiyuthu", file: "Sotta Sotta Nanaiyuthu.jpg", tag: "Tamil title" },
];

const metrics = [
  { label: "2 years", text: "Distribution runway" },
  { label: "India", text: "Audience reach" },
  { label: "Marvel", text: "Global title entry" },
];

export default function CoreCapabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeMovie = movies[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.28 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={isVisible ? "capabilityExperience isVisible" : "capabilityExperience"}
      aria-labelledby="capability-heading"
      ref={sectionRef}
    >
      <div className="capabilityShell">
        <div className="capabilityStory">
          <div className="capabilityOverline">
            <Projector aria-hidden="true" size={20} strokeWidth={2.4} />
            <span>Core capabilities</span>
          </div>
          <h2 id="capability-heading">
            <span>Distribution</span>
            <span>Windowing</span>
          </h2>
          <p className="capabilityLead">
            We connect great stories with audiences across India by managing
            theatrical distribution strategies that maximize revenue and audience reach
            across domestic and international markets.
          </p>
          <p className="capabilityNote">
            The journey began with Sony Pictures&apos; Marvel title Madame Web and
            expanded into regional titles including Tumbbad, Kadaisi Ulaga Por,
            Manidhargal, Kumara Sambhavam and many more.
          </p>

          <div className="capabilityMetrics" aria-label="Distribution highlights">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.label}</strong>
                <span>{metric.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="posterConsole">
          <div className="activePoster" key={activeMovie.title}>
            <img
              src={`/movie/${encodeURIComponent(activeMovie.file)}`}
              alt={`${activeMovie.title} poster`}
              draggable={false}
            />
            <div>
              <span>{activeMovie.tag}</span>
              <strong>{activeMovie.title}</strong>
            </div>
          </div>

          <div className="posterGrid" aria-label="Movie references">
            {movies.map((movie, index) => (
              <button
                aria-label={`Show ${movie.title}`}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? "posterTile active" : "posterTile"}
                key={movie.title}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                type="button"
              >
                <img
                  src={`/movie/${encodeURIComponent(movie.file)}`}
                  alt=""
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="windowRibbon" aria-label="Strategic windowing">
          <span>
            <Clapperboard aria-hidden="true" size={17} /> Theatrical releases
          </span>
          <span>
            <Gauge aria-hidden="true" size={17} /> Revenue strategy
          </span>
          <span>
            <BadgeIndianRupee aria-hidden="true" size={17} /> Audience reach
          </span>
          <span>
            <Sparkles aria-hidden="true" size={17} /> Domestic and international
          </span>
        </div>
      </div>
    </section>
  );
}
