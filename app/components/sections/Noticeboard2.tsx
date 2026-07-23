"use client";

import { motion } from "framer-motion";
import { useState, type CSSProperties } from "react";

type Notice = {
  alt: string;
  className: string;
  delay: number;
  src: string;
  style: CSSProperties;
};

const notices: Notice[] = [
  {
    alt: "Kannada Screens review of Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardLeft",
    delay: 0.16,
    src: "/board2/Asset%2013%201.png",
    style: { left: "12.6%", top: "26.2%", width: "16.25%" },
  },
  {
    alt: "South First review of Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardTopSecond",
    delay: 0.28,
    src: "/board2/Asset%2015%201.png",
    style: { left: "29.9%", top: "26.2%", width: "12%" },
  },
  {
    alt: "News report about the box office performance of Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardBottomSecond",
    delay: 0.4,
    src: "/board2/Asset%2014%201.png",
    style: { left: "29.9%", top: "49.8%", width: "12%" },
  },
  {
    alt: "India Today review of Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardTopCenter",
    delay: 0.52,
    src: "/board2/Asset%2010%201.png",
    style: { left: "42.8%", top: "26.2%", width: "21.8%" },
  },
  {
    alt: "Kannada film listing for Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardBottomCenterLeft",
    delay: 0.64,
    src: "/board2/Asset%2011%201.png",
    style: { left: "42.8%", top: "57.6%", width: "10.2%" },
  },
  {
    alt: "Pinkvilla article about Hostel Hudugaru Bekagiddare",
    className: "noticeboard2Card noticeboard2CardBottomCenterRight",
    delay: 0.76,
    src: "/board2/Asset%2012%201.png",
    style: { left: "53.8%", top: "57.6%", width: "10.8%" },
  },
  {
    alt: "Daily News Karnataka report about the Hostel Hudugaru Bekagiddare press meet",
    className: "noticeboard2Card noticeboard2CardRight",
    delay: 0.88,
    src: "/board2/Asset%2016%201.png",
    style: { left: "65.6%", top: "26.2%", width: "20.7%" },
  },
];

const stickers = [
  {
    delay: 0.08,
    src: "/board2/Group%2028.png",
    style: { left: "42.95%", top: "71.8%", width: "10.1%" },
  },
  {
    delay: 0.26,
    src: "/board2/Group%2033.png",
    style: { left: "67.1%", top: "64.5%", width: "19.3%" },
  },
] satisfies Array<{
  delay: number;
  src: string;
  style: CSSProperties;
}>;

export default function Noticeboard2() {
  const [completedNotices, setCompletedNotices] = useState(0);
  const allNoticesComplete = completedNotices === notices.length;

  return (
    <motion.section
      aria-label="Noticeboard press coverage"
      className="noticeboardSection noticeboard2Section"
      initial="hidden"
      onViewportEnter={() => setCompletedNotices(0)}
      onViewportLeave={() => setCompletedNotices(0)}
      viewport={{ once: false, amount: 0.32 }}
      whileInView="show"
    >
      <motion.h2
        className="noticeboardOverlayTitle"
        transition={{ delay: 0.04, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        variants={{
          hidden: { opacity: 0, y: -34, scale: 0.94, filter: "blur(10px)" },
          show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        }}
      >
        Noticeboard
      </motion.h2>
      <div className="noticeboard2Shell">
        {notices.map((notice, index) => (
          <motion.img
            alt={notice.alt}
            className={notice.className}
            draggable={false}
            key={notice.src}
            onAnimationComplete={(definition) => {
              if (definition === "show") {
                setCompletedNotices((count) =>
                  Math.min(count + 1, notices.length),
                );
              }
            }}
            src={notice.src}
            style={notice.style}
            transition={{
              delay: notice.delay,
              duration: 0.78,
              ease: [0.16, 1, 0.3, 1],
            }}
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.82,
                rotateZ: index % 2 === 0 ? -2.5 : 2.5,
                y: 52,
                filter: "blur(10px) brightness(1.25)",
              },
              show: {
                opacity: 1,
                scale: 1,
                rotateZ: 0,
                y: 0,
                filter: "blur(0px) brightness(1)",
              },
            }}
          />
        ))}
        {stickers.map((sticker, index) => (
          <motion.img
            alt=""
            aria-hidden="true"
            animate={allNoticesComplete ? "show" : "hidden"}
            className="noticeboard2Sticker"
            draggable={false}
            key={sticker.src}
            src={sticker.src}
            style={sticker.style}
            transition={{
              delay: sticker.delay,
              duration: 0.62,
              ease: [0.14, 1.32, 0.28, 1],
            }}
            variants={{
              hidden: {
                opacity: 0,
                scale: 1.32,
                rotateZ: index === 0 ? -7 : 6,
                y: -30,
                filter: "blur(7px) brightness(1.25)",
              },
              show: {
                opacity: 1,
                scale: [1, 0.94, 1.025, 1],
                rotateZ: 0,
                y: 0,
                filter: "blur(0px) brightness(1)",
              },
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
