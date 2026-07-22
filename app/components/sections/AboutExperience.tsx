"use client";

import { Clapperboard, Film, Globe2, MapPin, MonitorPlay, Satellite, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const chapters = [
  {
    id: "base",
    label: "Base",
    title: "Chennai Base",
    tag: "Origin point",
    icon: MapPin,
    headline: "A company built close to the pulse of South Indian cinema.",
    body: "GENEROUS Entertainments is a film distribution and production company based in Chennai, India, shaped by hands-on industry experience and regional market understanding.",
    progress: 25,
  },
  {
    id: "craft",
    label: "Craft",
    title: "12+ Years",
    tag: "Industry XP",
    icon: Trophy,
    headline: "More than a decade of release thinking, rights work and production context.",
    body: "Built on 12+ years of industry expertise, the company bridges regional film industries and mainstream Indian cinema with the confidence of people who know how films move from makers to audiences.",
    progress: 50,
  },
  {
    id: "global",
    label: "Global",
    title: "2024 Unlock",
    tag: "Marvel title",
    icon: Globe2,
    headline: "The story expanded from Indian screens into the global film market.",
    body: "In 2024, GENEROUS Entertainments entered the global market through the acquisition of a Marvel title, turning a regional foundation into an international distribution lane.",
    progress: 75,
  },
  {
    id: "windows",
    label: "Windows",
    title: "3 Screens",
    tag: "Release lanes",
    icon: Clapperboard,
    headline: "International and pan-Indian films, moved across every major window.",
    body: "Today, the company distributes international and pan-Indian films across theatrical, digital and satellite windows, connecting stories with audiences across formats.",
    progress: 100,
  },
];

const windows = [
  { label: "Theatrical", icon: Film },
  { label: "Digital", icon: MonitorPlay },
  { label: "Satellite", icon: Satellite },
];

export default function AboutExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const active = chapters[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={isVisible ? "aboutExperience isVisible" : "aboutExperience"}
      aria-labelledby="about-heading"
      ref={sectionRef}
    >
      <div className="verticalAboutLabel" aria-hidden="true">
        <span>Who We Are</span>
      </div>
      <div className="storyShell">
        <div className="storyHeader">
          <h2 id="about-heading">
            <span>From Chennai</span>
            <span>to Global Screens</span>
          </h2>
        </div>

        <div className="explorer">
          <div className="checkpointRail" role="tablist" aria-label="About story checkpoints">
            {chapters.map((chapter, index) => {
              const Icon = chapter.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  aria-selected={isActive}
                  className={isActive ? "checkpoint active" : "checkpoint"}
                  key={chapter.id}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  type="button"
                >
                  <Icon aria-hidden="true" size={20} strokeWidth={2.3} />
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{chapter.label}</span>
                </button>
              );
            })}
          </div>

          <article className="storyStage" key={active.id}>
            <div className="stageTag">
              <ActiveIcon aria-hidden="true" size={22} strokeWidth={2.3} />
              <span>{active.tag}</span>
            </div>
            <p className="chapterTitle">{active.title}</p>
            <h3>{active.headline}</h3>
            <p>{active.body}</p>
            <div className="progressTrack" aria-label={`Story progress ${active.progress}%`}>
              <span style={{ width: `${active.progress}%` }} />
            </div>
          </article>
        </div>

        <div className="windowDock" aria-label="Distribution windows">
          {windows.map((item) => {
            const Icon = item.icon;

            return (
              <div className="windowToken" key={item.label}>
                <Icon aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
