"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                className="hostelViewsProof"
                exit={{ opacity: 0, x: 90, rotate: 1.4 }}
                initial={{ opacity: 0, x: 160, rotate: 2.4 }}
                transition={{ duration: 0.58, ease: [0.2, 0.9, 0.25, 1] }}
              >
                <img
                  alt="Hostel genre video views proof"
                  draggable={false}
                  src="/hostelgenre/v1.png"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
