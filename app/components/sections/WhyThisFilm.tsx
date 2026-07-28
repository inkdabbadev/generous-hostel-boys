"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const reviewDurationMs = 18000;

export default function WhyThisFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewTimeoutRef = useRef<number | null>(null);
  const wasVisibleRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [stage, setStage] = useState<"video" | "review">("video");

  useEffect(() => {
    return () => {
      if (reviewTimeoutRef.current) {
        window.clearTimeout(reviewTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const resetVideo = () => {
      if (reviewTimeoutRef.current) {
        window.clearTimeout(reviewTimeoutRef.current);
        reviewTimeoutRef.current = null;
      }

      setStage("video");

      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.currentTime = 0;
      video.muted = true;
      setIsMuted(true);
      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (isVisible && !wasVisibleRef.current) {
          resetVideo();
        }

        wasVisibleRef.current = isVisible;
      },
      { threshold: 0.42 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleVideoEnded = () => {
    setStage("review");

    if (reviewTimeoutRef.current) {
      window.clearTimeout(reviewTimeoutRef.current);
    }

    reviewTimeoutRef.current = window.setTimeout(() => {
      setStage("video");
      const video = videoRef.current;

      if (video) {
        video.currentTime = 0;
        video.muted = true;
        setIsMuted(true);
        void video.play().catch(() => undefined);
      }
    }, reviewDurationMs);
  };

  const toggleSound = () => {
    const video = videoRef.current;
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);

    if (video) {
      video.muted = nextMuted;
      void video.play().catch(() => undefined);
    }
  };

  return (
    <section
      className={stage === "review" ? "whyThisFilm isReviewing" : "whyThisFilm"}
      aria-labelledby="why-this-film-title"
      ref={sectionRef}
    >
      <div className="whyThisFilmShell">
        <h2 id="why-this-film-title">Why This Film</h2>
        <div className="whyVideoFrame">
          <video
            autoPlay
            muted={isMuted}
            onEnded={handleVideoEnded}
            playsInline
            preload="metadata"
            ref={videoRef}
            src="/why/video.mp4"
          />
          <button
            aria-label={isMuted ? "Turn video sound on" : "Turn video sound off"}
            className="whyVideoSoundButton"
            onClick={toggleSound}
            type="button"
          >
            {isMuted ? <VolumeX aria-hidden="true" size={24} /> : <Volume2 aria-hidden="true" size={24} />}
            <span>{isMuted ? "Sound" : "On"}</span>
          </button>
        </div>
      </div>
      {stage === "review" ? (
        <div className="whyReviewStage" aria-hidden="true">
          <img draggable={false} src="/why/review.gif" alt="" />
        </div>
      ) : null}
    </section>
  );
}
