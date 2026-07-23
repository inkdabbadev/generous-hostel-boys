'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

// Image dataset mapping to layout structure
const galleryItems = [
  { id: 1, src: '/images/image_1.png', alt: 'Group sleeping', className: 'col-span-4 row-span-2' },
  { id: 2, src: '/images/Frame 14.png', alt: 'Carrom board', className: 'col-span-2 row-span-2' },
  { id: 3, src: '/images/Frame 12.png', alt: 'Desk study', className: 'col-span-2 row-span-4' },
  { id: 4, src: '/images/Frame 13.png', alt: 'Group hanging out', className: 'col-span-4 row-span-4' },
  { id: 5, src: '/images/Frame 11.png', alt: 'Card game', className: 'col-span-2 row-span-2' },
  { id: 6, src: '/images/Frame 10.png', alt: 'Building view', className: 'col-span-4 row-span-2' },
  { id: 7, src: '/images/Frame 8.png', alt: 'Living room chill', className: 'col-span-3 row-span-2' },
  { id: 8, src: '/images/Frame 7.png', alt: 'Guitar playing', className: 'col-span-2 row-span-2' },
  { id: 9, src: '/images/Frame 6.png', alt: 'Bunk beds room', className: 'col-span-2 row-span-2' },
  { id: 10, src: '/images/Frame 5.png', alt: 'Clothes rack', className: 'col-span-2 row-span-2' },
  { id: 11, src: '/images/Frame 4.png', alt: 'Bottles on floor', className: 'col-span-3 row-span-2' },
];

export default function GalleryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initially set opacity to 0 for all items
      gsap.set(itemsRef.current, { opacity: 0 });

      // 2. Animate items to 100% opacity in a random sequence over 5 seconds
      gsap.to(itemsRef.current, {
        opacity: 1,
        duration: 1.5, // How long each individual photo takes to fade in
        ease: 'power2.inOut',
        stagger: {
          amount: 0.5,       // Total duration (in seconds) spread across all elements
          from: 'random',  // Picks images in a random sequence
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#b30000] min-h-screen text-white overflow-hidden flex items-center justify-center p-4 md:p-8">
      <section ref={containerRef} className="w-full flex items-center justify-center">
        <div className="grid grid-cols-12 auto-rows-[75px] md:auto-rows-[90px] gap-3 md:gap-4 w-full max-w-[1400px] max-h-[800px]">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`relative overflow-hidden rounded-2xl shadow-lg border-2 border-transparent ${item.className}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}