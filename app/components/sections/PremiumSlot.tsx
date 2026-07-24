"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const stageReelAssets = [
  [1, 2, 3, 4, 5, 6].map((asset) => `/slot/60%20days/Asset%20${asset}.svg`),
  [
    "/slot/9%20CR/Asset%208.svg",
    "/slot/9%20CR/Asset%209.svg",
    "/slot/9%20CR/Asset%2010.svg",
    "/slot/9%20CR/Asset%2011.svg",
    "/slot/9%20CR/Currency.svg",
    "/slot/9%20CR/Icon.svg",
  ],
] as const;

const stageFinalAssets = [
  [
    "/slot/60%20days/Asset%203.svg",
    "/slot/60%20days/Asset%206.svg",
    "/slot/60%20days/Asset%205.svg",
    "/slot/60%20days/Asset%204.svg",
  ],
  [
    "/slot/9%20CR/Asset%208.svg",
    "/slot/9%20CR/Asset%2011.svg",
    "/slot/9%20CR/Asset%2010.svg",
    "/slot/9%20CR/Asset%209.svg",
  ],
] as const;

const initialAssets = [
  "/slot/60%20days/Asset%201.svg",
  "/slot/60%20days/Asset%202.svg",
  "/slot/60%20days/Asset%201.svg",
  "/slot/60%20days/Asset%202.svg",
];

function randomAsset(pool: readonly string[]) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function PremiumSlot() {
  const [machineReady, setMachineReady] = useState(false);
  const [stage, setStage] = useState<0 | 1>(0);
  const [current, setCurrent] = useState(initialAssets);
  const [spinAssets, setSpinAssets] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<0 | 1>(0);
  const hasSpunRef = useRef(false);
  const introStartedRef = useRef(false);
  const spinInputLockUntilRef = useRef(0);
  const introTimeoutRef = useRef<number | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const spin = useCallback((targetStage: 0 | 1 = stageRef.current) => {
    if (!machineReady || hasSpunRef.current) return;

    const pool = stageReelAssets[targetStage];
    const finals = [...stageFinalAssets[targetStage]];
    stageRef.current = targetStage;
    setStage(targetStage);
    hasSpunRef.current = true;
    spinInputLockUntilRef.current = performance.now() + 1700;
    setSpinning(true);
    setSpinAssets(
      finals.map((finalAsset) => [
        ...Array.from({ length: 10 }, () => randomAsset(pool)),
        finalAsset,
      ]),
    );
    setSpinKey((value) => value + 1);

    spinTimeoutRef.current = window.setTimeout(() => {
      setCurrent(finals);
      setSpinning(false);
      spinTimeoutRef.current = null;
    }, 1500);
  }, [machineReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reset = () => {
      if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
      if (spinTimeoutRef.current !== null) window.clearTimeout(spinTimeoutRef.current);
      introTimeoutRef.current = null;
      spinTimeoutRef.current = null;
      introStartedRef.current = false;
      hasSpunRef.current = false;
      stageRef.current = 0;
      spinInputLockUntilRef.current = 0;
      setMachineReady(false);
      setStage(0);
      setCurrent(initialAssets);
      setSpinAssets([]);
      setSpinning(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          if (!introStartedRef.current) {
            introStartedRef.current = true;
            introTimeoutRef.current = window.setTimeout(() => {
              setMachineReady(true);
              introTimeoutRef.current = null;
            }, 2000);
          }
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio < 0.1) reset();
      },
      { threshold: [0, 0.1, 0.55] },
    );

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== section) return;

      if (!machineReady) {
        customEvent.preventDefault();
        return;
      }

      if (!hasSpunRef.current) {
        customEvent.preventDefault();
        spin();
        return;
      }

      if (performance.now() < spinInputLockUntilRef.current) {
        customEvent.preventDefault();
        return;
      }

      if (stageRef.current === 0) {
        customEvent.preventDefault();
        hasSpunRef.current = false;
        spin(1);
      }
    };

    observer.observe(section);
    window.addEventListener("section-jump:intent", onSectionJumpIntent);

    return () => {
      observer.disconnect();
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
      if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
      if (spinTimeoutRef.current !== null) window.clearTimeout(spinTimeoutRef.current);
    };
  }, [machineReady, spin]);

  return (
    <section className="premiumSlot premiumAssetSlot" aria-label="Campaign impact and ROI" ref={sectionRef}>
      {!machineReady ? (
        <div className="premiumSlotIntro" aria-label="Campaign impact and ROI">
          <span>Campaign</span>
          <strong>Impact</strong>
          <b>&amp; ROI</b>
        </div>
      ) : (
        <div className="premiumAssetScene">
          <h2 className={stage === 1 ? "isInvestment" : undefined}>
            {stage === 1 ? (
              <>
                <span>Total</span>
                <strong>Marketing Investment</strong>
              </>
            ) : (
              <>
                <span>Campaign</span> Duration
              </>
            )}
          </h2>

          <div className="premiumAssetMachine">
            <div className="premiumAssetReels" aria-live="polite">
              {current.map((asset, reelIndex) => {
                const strip = spinning ? spinAssets[reelIndex] : null;
                const style = { "--asset-delay": `${reelIndex * 120}ms` } as CSSProperties;

                return (
                  <div className="premiumAssetReel" key={reelIndex} style={style}>
                    {strip ? (
                      <div className="premiumAssetStrip isSpinning" key={`${spinKey}-${reelIndex}`}>
                        {strip.map((item, itemIndex) => (
                          <span className="premiumAssetCell" key={`${item}-${itemIndex}`}>
                            <img alt="" aria-hidden="true" draggable={false} src={item} />
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="premiumAssetCell">
                        <img alt="" aria-hidden="true" draggable={false} src={asset} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <img
              alt=""
              aria-hidden="true"
              className="premiumAssetOverlay"
              draggable={false}
              src="/slot/slot/Asset%205.svg"
            />

            <button
              aria-label="Slot lever"
              className={`premiumSlotLever premiumAssetLever${spinning ? " isPulled" : ""}`}
              disabled={!machineReady || hasSpunRef.current}
              onClick={() => spin()}
              type="button"
            >
              <span className="premiumSlotLeverTrack" aria-hidden="true">
                <i className="premiumSlotLeverArm" />
                <i className="premiumSlotLeverKnob" />
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
