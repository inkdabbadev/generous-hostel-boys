"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const viewProofImages = [
  {
    alt: "Hostel genre video views proof",
    src: "/hostelgenre/v1.png",
  },
  {
    alt: "Additional hostel genre audience proof",
    src: "/hostelgenre/v2.png",
  },
  {
    alt: "Third hostel genre audience proof",
    src: "/hostelgenre/v3.png",
  },
  {
    alt: "Fourth hostel genre audience proof",
    src: "/hostelgenre/v4.png",
  },
];

const proofEase = [0.16, 1, 0.3, 1] as const;

export default function HostelGenreProof() {
  const [showViews, setShowViews] = useState(false);

  return (
    <section className="hostelGenreProof" aria-labelledby="hostel-genre-title">
      <div className="hostelGenreShell">
        <motion.div
          className="hostelGenreCopy"
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.72, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.42 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 id="hostel-genre-title">
            <span>TN audience already</span>
            <span>love hostel as a genre</span>
          </h2>
          <p>Yes even we couldn&apos;t believe it!</p>
        </motion.div>

        <motion.div
          className="hostelProofBay"
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          transition={{ delay: 0.12, duration: 0.72, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.35 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
        >
          <button
            aria-label="Show hostel genre views proof"
            className="hostelPrimaryProof"
            onClick={() => setShowViews(true)}
            type="button"
          >
            <img
              alt="Alumbunaties hostel genre proof"
              draggable={false}
              src="/hostelgenre/primary.png"
            />
            <span>Click to reveal views proof</span>
          </button>

          <AnimatePresence>
            {showViews ? (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="hostelViewsProof"
                exit={{ opacity: 0, x: 90 }}
                initial={{ opacity: 0, x: 150 }}
                transition={{ duration: 0.58, ease: [0.2, 0.9, 0.25, 1] }}
              >
                {viewProofImages.map((image, index) => (
                  <motion.div
                    animate="visible"
                    className="hostelViewShot"
                    initial={{
                      opacity: 0,
                    }}
                    key={image.src}
                    transition={{
                      delay: 0.05 + index * 0.12,
                      duration: 0.56,
                    }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <motion.img
                      animate={{
                        filter:
                          "blur(0px) drop-shadow(0 12px 16px rgba(0, 0, 0, 0.2))",
                        opacity: 1,
                        scale: [0.88, 1.08, 0.985, 1],
                        x: [150, -20, 8, 0],
                        y: [18, -8, 3, 0],
                      }}
                      alt={image.alt}
                      draggable={false}
                      initial={{
                        filter:
                          "blur(10px) drop-shadow(0 24px 32px rgba(0, 0, 0, 0.24))",
                        opacity: 0,
                      }}
                      src={image.src}
                      transition={{
                        delay: 0.04 + index * 0.12,
                        duration: 0.76,
                        ease: proofEase,
                      }}
                    />
                  </motion.div>
                ))}
                <motion.span
                  animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1, 1], x: ["-10%", "110%", "120%"] }}
                  aria-hidden="true"
                  className="hostelRevealSweep"
                  initial={{ opacity: 0 }}
                    transition={{
                    delay: 0.28,
                    duration: 1.05,
                    ease: [0.2, 0.8, 0.2, 1],
                    }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
