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
  [
    "/slot/5%20CR/Asset%2013.svg",
    "/slot/5%20CR/Asset%2016.svg",
    "/slot/5%20CR/Asset%2017.svg",
    "/slot/5%20CR/Asset%2018.svg",
    "/slot/5%20CR/Asset%2046.svg",
  ],
  [
    "/slot/10%20CR/Asset%2059.svg",
    "/slot/10%20CR/Asset%2060.svg",
    "/slot/10%20CR/Asset%2062.svg",
    "/slot/10%20CR/Asset%2063.svg",
    "/slot/10%20CR/Asset%2064.svg",
    "/slot/10%20CR/Asset%2065.svg",
    "/slot/10%20CR/Layer_1%20(2).svg",
  ],
  [20, 21, 22, 23, 24, 25].map((asset) => `/slot/20x/Asset%20${asset}.svg`),
  [66, 67, 68, 69, 70, 71, 72].map((asset) => `/slot/20%20CR/Asset%20${asset}.svg`),
  [73, 74, 75, 76, 77, 78].map((asset) => `/slot/3%20CR/Asset%20${asset}.svg`),
  [40, 42, 43, 44, 45, 60].map((asset) => `/slot/10%20Lakhs/Asset%20${asset}.svg`),
  [46, 48, 49, 50, 51, 52].map((asset) => `/slot/240+/Asset%20${asset}.svg`),
  [53, 54, 56, 57, 58].map((asset) => `/slot/8K+/Asset%20${asset}.svg`),
  [
    "/slot/Infinity/Asset%2080.svg",
    "/slot/Infinity/Asset%2081.svg",
    "/slot/Infinity/Asset%2082.svg",
    "/slot/Infinity/Icon%20(3).svg",
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
  [
    "/slot/5%20CR/Asset%2013.svg",
    "/slot/5%20CR/Asset%2018.svg",
    "/slot/5%20CR/Asset%2017.svg",
    "/slot/5%20CR/Asset%2016.svg",
  ],
  [
    "/slot/10%20CR/Asset%2065.svg",
    "/slot/10%20CR/Asset%2063.svg",
    "/slot/10%20CR/Asset%2064.svg",
    "/slot/10%20CR/Asset%2062.svg",
  ],
  [
    "/slot/20x/Asset%2022.svg",
    "/slot/20x/Asset%2025.svg",
    "/slot/20x/Asset%2024.svg",
    "/slot/20x/Asset%2023.svg",
  ],
  [
    "/slot/20%20CR/Asset%2070.svg",
    "/slot/20%20CR/Asset%2071.svg",
    "/slot/20%20CR/Asset%2072.svg",
    "/slot/20%20CR/Asset%2069.svg",
  ],
  [
    "/slot/3%20CR/Asset%2078.svg",
    "/slot/3%20CR/Asset%2077.svg",
    "/slot/3%20CR/Asset%2076.svg",
    "/slot/3%20CR/Asset%2072.svg",
  ],
  [
    "/slot/10%20Lakhs/Asset%2045.svg",
    "/slot/10%20Lakhs/Asset%2044.svg",
    "/slot/10%20Lakhs/Asset%2043.svg",
    "/slot/10%20Lakhs/Asset%2042.svg",
  ],
  [
    "/slot/240+/Asset%2052.svg",
    "/slot/240+/Asset%2051.svg",
    "/slot/240+/Asset%2050.svg",
    "/slot/240+/Asset%2049.svg",
  ],
  [
    "/slot/8K+/Asset%2053.svg",
    "/slot/8K+/Asset%2058.svg",
    "/slot/8K+/Asset%2057.svg",
    "/slot/8K+/Asset%2056.svg",
  ],
  [
    "/slot/Infinity/Asset%2082.svg",
    "/slot/Infinity/Asset%2080.svg",
    "/slot/Infinity/Asset%2082.svg",
    "/slot/Infinity/Asset%2080.svg",
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
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(0);
  const [current, setCurrent] = useState(initialAssets);
  const [spinAssets, setSpinAssets] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState(false);
  const [rollDirection, setRollDirection] = useState<1 | -1>(1);
  const [spinKey, setSpinKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(0);
  const hasSpunRef = useRef(false);
  const introStartedRef = useRef(false);
  const spinInputLockUntilRef = useRef(0);
  const introTimeoutRef = useRef<number | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const spin = useCallback((
    targetStage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = stageRef.current,
    direction: 1 | -1 = 1,
  ) => {
    if (!machineReady || hasSpunRef.current) return;

    const pool = stageReelAssets[targetStage];
    const finals = [...stageFinalAssets[targetStage]];
    stageRef.current = targetStage;
    setStage(targetStage);
    hasSpunRef.current = true;
    spinInputLockUntilRef.current = performance.now() + 1700;
    setSpinning(true);
    setRollDirection(direction);
    setSpinAssets(
      finals.map((finalAsset) =>
        direction === 1
          ? [...Array.from({ length: 10 }, () => randomAsset(pool)), finalAsset]
          : [finalAsset, ...Array.from({ length: 10 }, () => randomAsset(pool))],
      ),
    );
    setSpinKey((value) => value + 1);

    spinTimeoutRef.current = window.setTimeout(() => {
      setCurrent(finals);
      setSpinning(false);
      spinTimeoutRef.current = null;
    }, 1500);
  }, [machineReady]);

  const pullLever = useCallback(() => {
    if (!machineReady || spinning || performance.now() < spinInputLockUntilRef.current) return;

    if (!hasSpunRef.current) {
      spin(stageRef.current, 1);
      return;
    }

    if (stageRef.current < 10) {
      const nextStage = (stageRef.current + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      hasSpunRef.current = false;
      spin(nextStage, 1);
    }
  }, [machineReady, spin, spinning]);

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
      setRollDirection(1);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          if (!introStartedRef.current) {
            introStartedRef.current = true;
            introTimeoutRef.current = window.setTimeout(() => {
              setMachineReady(true);
              introTimeoutRef.current = null;
            }, 1000);
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
        if (customEvent.detail.direction === -1 && stageRef.current === 0) return;
        customEvent.preventDefault();
        spin(stageRef.current, customEvent.detail.direction);
        return;
      }

      if (performance.now() < spinInputLockUntilRef.current) {
        customEvent.preventDefault();
        return;
      }

      if (customEvent.detail.direction === 1 && stageRef.current < 10) {
        customEvent.preventDefault();
        const nextStage = (stageRef.current + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
        hasSpunRef.current = false;
        spin(nextStage, 1);
        return;
      }

      if (customEvent.detail.direction === -1 && stageRef.current > 0) {
        customEvent.preventDefault();
        const previousStage = (stageRef.current - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        hasSpunRef.current = false;
        spin(previousStage, -1);
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
          <h2
            key={`slot-heading-${stage}`}
            className={
              stage === 1
                ? "isInvestment"
                : stage === 2
                  ? "isInvestment isReach"
                  : stage === 3
                    ? "isImpressions"
                    : stage === 4
                      ? "isImpressions isFrequency"
                      : stage === 5
                        ? "isImpressions isVideoViews"
                        : stage === 6
                          ? "isInvestment isSocialEngagement"
                          : stage === 7
                            ? "isImpressions isUserContent"
                            : stage === 8
                              ? "isImpressions isUserContent isInfluencer"
                              : stage === 9
                                ? "isInvestment isPhysicalAssets"
                                : stage === 10
                                  ? "isInvestment isLongTerm"
                    : undefined
            }
          >
            {stage === 10 ? (
              <>
                <span>Long-Term</span>
                <strong>Brand Visibility</strong>
              </>
            ) : stage === 9 ? (
              <>
                <span>Physical</span>
                <strong>Branding Assets</strong>
              </>
            ) : stage === 8 ? (
              <>
                <span>Influencer</span>{" "}
                <strong>Network</strong>
              </>
            ) : stage === 7 ? (
              <>
                <span>User Generated</span>{" "}
                <strong>Content</strong>
              </>
            ) : stage === 6 ? (
              <>
                <span>Estimated</span>
                <strong>Social Engagement</strong>
              </>
            ) : stage === 5 ? (
              <>
                <span>Estimated</span>{" "}
                <strong>Video Views</strong>
              </>
            ) : stage === 4 ? (
              <>
                <span>Avg.</span>{" "}
                <strong>Brand Frequency</strong>
              </>
            ) : stage === 3 ? (
              <>
                <span>Total</span>{" "}
                <strong>Impressions</strong>
              </>
            ) : stage === 2 ? (
              <>
                <span>Estimated</span>
                <strong>Unique Reach</strong>
              </>
            ) : stage === 1 ? (
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
                      <div
                        className={`premiumAssetStrip isSpinning${rollDirection === -1 ? " isReverse" : ""}`}
                        key={`${spinKey}-${reelIndex}`}
                      >
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
              src="/slot/slot/Asset%2083.svg"
            />

            <button
              aria-label="Slot lever"
              className={`premiumSlotLever premiumAssetLever${spinning ? " isPulled" : ""}`}
              disabled={!machineReady || spinning || stage === 10}
              onClick={pullLever}
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
