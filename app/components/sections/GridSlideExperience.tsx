"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const galleryItems = [
  { id: 1, src: "/grid/image_1.png", alt: "Group sleeping", className: "col-span-4 row-span-2" },
  { id: 2, src: "/grid/Frame 14.png", alt: "Carrom board", className: "col-span-2 row-span-2" },
  { id: 3, src: "/grid/Frame 12.png", alt: "Desk study", className: "col-span-2 row-span-4" },
  { id: 4, src: "/grid/Frame 13.png", alt: "Group hanging out", className: "col-span-4 row-span-4" },
  { id: 5, src: "/grid/Frame 11.png", alt: "Card game", className: "col-span-2 row-span-2" },
  { id: 6, src: "/grid/Frame 10.png", alt: "Building view", className: "col-span-4 row-span-2" },
  { id: 7, src: "/grid/Frame 8.png", alt: "Living room chill", className: "col-span-3 row-span-2" },
  { id: 8, src: "/grid/Frame 7.png", alt: "Guitar playing", className: "col-span-2 row-span-2" },
  { id: 9, src: "/grid/Frame 6.png", alt: "Bunk beds room", className: "col-span-2 row-span-2" },
  { id: 10, src: "/grid/Frame 5.png", alt: "Clothes rack", className: "col-span-2 row-span-2" },
  { id: 11, src: "/grid/Frame 4.png", alt: "Bottles on floor", className: "col-span-3 row-span-2" },
];

export default function GridSlideExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      { threshold: [0, 0.55] },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);

    tweenRef.current?.kill();

    if (!isVisible) {
      gsap.set(items, { opacity: 0, scale: 0.96 });
      return;
    }

    gsap.set(items, { opacity: 0, scale: 0.96 });
    tweenRef.current = gsap.to(items, {
      opacity: 1,
      scale: 1,
      duration: 1.3,
      ease: "power2.out",
      stagger: {
        amount: 0.7,
        from: "random",
      },
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [isVisible]);

  return (
    <section
      id="grid-slide"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(90deg,rgba(8,4,2,0.72),rgba(120,13,6,0.76)),url('/background.png')] bg-[length:100%_100%] bg-center bg-no-repeat p-4 text-white md:p-8"
      aria-label="Grid slide"
    >
      <div className="grid w-[125vw] max-w-[1750px] grid-cols-12 auto-rows-[93.75px] gap-4 md:auto-rows-[112.5px] md:gap-5">
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              itemsRef.current[index] = node;
            }}
            className={`relative overflow-hidden rounded-[8px] border-2 border-transparent shadow-lg ${item.className}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out hover:scale-105"
              priority
            />
          </div>
        ))}
      </div>
    </section>
  );
}
