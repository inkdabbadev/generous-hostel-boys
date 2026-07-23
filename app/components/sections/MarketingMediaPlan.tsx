"use client";

import { motion } from "framer-motion";

const mediaPlanRows = [
  {
    no: 1,
    item: "All Over Tamil Nadu Bus Stand LED Screen - 35 Districts",
    count: "196 screens with audio, 43 inch to 15 x 20",
    cost: "Rs. 3,50,000",
    days: "15",
  },
  { no: 2, item: "Standees All Over TN", count: "Yes", cost: "Rs. 1,200", days: "15" },
  { no: 3, item: "Chennai Premium Hoardings", count: "7", cost: "Rs. 40,000", days: "10" },
  { no: 4, item: "ROTN Premium Hoardings", count: "30", cost: "Rs. 23,000", days: "15" },
  { no: 5, item: "Chennai Hoardings", count: "25", cost: "Rs. 30,000", days: "10" },
  { no: 6, item: "ROTN Hoardings", count: "50", cost: "Rs. 18,000", days: "20" },
  { no: 7, item: "Bus Back Panel 4x3 (ROTN)", count: "1000", cost: "Rs. 1,400 / bus", days: "20" },
  { no: 8, item: "Bus Wrap 1 Nos", count: "No", cost: "Rs. 20,000", days: "30" },
  {
    no: 9,
    item: "Chennai, Trichy, Kovai Airport 150 Screens",
    count: "Only for branding",
    cost: "Rs. 7,50,000",
    days: "10",
  },
  { no: 10, item: "Bus Shelter Chennai", count: "50", cost: "Rs. 18,000", days: "10" },
  { no: 11, item: "Bus Shelter ROTN", count: "100", cost: "Rs. 15,000", days: "15" },
  { no: 12, item: "Metro Train Interior 1 Nos", count: "Only for branding", cost: "Rs. 95,000", days: "10" },
  {
    no: 13,
    item: "Metro Train Exterior & Interior 1 Nos",
    count: "Only for branding",
    cost: "Rs. 13,00,000",
    days: "30",
  },
  { no: 14, item: "Metro Station Branding 10 Stations 20 Boards", count: "No", cost: "Rs. 2,75,000", days: "15" },
  { no: 15, item: "Metro Pillar - 10", count: "Yes", cost: "Rs. 50,000", days: "15" },
  { no: 16, item: "Metro Platform TV Board 45 Stations 360 LEDs", count: "No", cost: "Rs. 5,10,000", days: "12" },
  {
    no: 17,
    item: "Chennai Traffic Signal LED 35 Nos",
    count: "15 days before and 15 days after release",
    cost: "Rs. 40,000",
    days: "10",
  },
  { no: 18, item: "Lamp Post Cutout", count: "No", cost: "Rs. 650", days: "7" },
  { no: 19, item: "Chennai Forum Mall", count: "Yes", cost: "Rs. 1,10,000", days: "10" },
  { no: 20, item: "Kovai Brookfield Mall", count: "Yes", cost: "Rs. 25,000", days: "10" },
  { no: 21, item: "Vadapalani Nexus Mall Pillar Drop Down", count: "Yes", cost: "Rs. 95,000", days: "10" },
  { no: 22, item: "Marina Mall", count: "Yes", cost: "Rs. 30,000", days: "10" },
  { no: 23, item: "Madurai Vishal D Mall", count: "Yes", cost: "Rs. 20,000", days: "10" },
  { no: 24, item: "Salem Reliance Mall", count: "Yes", cost: "Rs. 20,000", days: "20" },
  { no: 25, item: "Thanjavur Lwang Mall", count: "Yes", cost: "Rs. 20,000", days: "10" },
  { no: 26, item: "Tata Ace Branding TN 1 Van", count: "70", cost: "Rs. 25,000", days: "10" },
  { no: 27, item: "Railway Platform LED 7 District", count: "No", cost: "Rs. 2,10,000", days: "10" },
  { no: 28, item: "Petrol Bunk LED Chennai 5 Bunk", count: "Yes", cost: "Rs. 50,000", days: "10" },
  { no: 29, item: "Chennai Corporation LED 1 LED", count: "Total 200 locations", cost: "Rs. 8,400", days: "7" },
  { no: 30, item: "Chennai City Major LED Wall 15 Location", count: "Yes", cost: "Rs. 12,00,000", days: "10" },
  { no: 31, item: "Mini Hoardings Don't Drink & Drive", count: "TBD", cost: "Rs. 1,100", days: "7" },
  { no: 32, item: "Auto Sticker Chennai & ROTN Size 30x8", count: "3000", cost: "Rs. 100", days: "20" },
  { no: 33, item: "Auto Full Wrap", count: "1000", cost: "Rs. 1,200", days: "30" },
  {
    no: 34,
    item: "Train - Electric: Chengalpattu to Beach, Tiruthani to Central",
    count: "5 trains",
    cost: "Rs. 8,00,000 / train",
    days: "30",
  },
];

export const mediaPlanRowsData = mediaPlanRows;

const mediaImpactCards = [
  {
    label: "Different",
    value: "34",
    title: "Touch Points",
    copy: "Bus stands, hoardings, malls, metro, transit, airport, LED walls, auto, rail and city media.",
  },
  {
    label: "Sustained",
    value: "30",
    title: "Days of Promotion",
    copy: "A release-window burst designed to stay visible before, during and after the theatrical push.",
  },
  {
    label: "Core Market",
    value: "Tamil",
    title: "Core TN Youth",
    copy: "Built around Tamil Nadu's youth-heavy audience routes, public spaces and daily commute moments.",
  },
];

export default function MarketingMediaPlan() {
  return (
    <motion.section
      className="mediaPlan"
      aria-label="Marketing media plan highlights"
      initial="hidden"
      viewport={{ once: false, amount: 0.4 }}
      whileInView="show"
    >
      <div className="mediaPlanShell">
        <div className="mediaPlanImpactGrid" aria-label="Marketing media plan highlights">
          {mediaImpactCards.map((card, index) => (
            <motion.article
              className="mediaPlanImpactCard"
              key={card.title}
              transition={{
                delay: index * 0.18,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              variants={{
                hidden: { opacity: 0, y: 54, scale: 0.96, filter: "blur(14px)" },
                show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
              }}
            >
              <motion.strong
                transition={{ delay: 0.22 + index * 0.18, duration: 0.64, ease: [0.18, 1.25, 0.28, 1] }}
                variants={{
                  hidden: { opacity: 0, y: 34, scale: 0.82 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                {card.value}
              </motion.strong>
              <motion.h3
                transition={{ delay: 0.34 + index * 0.18, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                variants={{
                  hidden: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
                  show: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
                }}
              >
                {card.title}
              </motion.h3>
              <motion.p
                transition={{ delay: 0.46 + index * 0.18, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                {card.copy}
              </motion.p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const splitIndex = Math.ceil(mediaPlanRows.length / 2);
const mediaPlanColumns = [
  mediaPlanRows.slice(0, splitIndex),
  mediaPlanRows.slice(splitIndex),
];

export function MarketingMediaPlanTable() {
  return (
    <section className="mediaPlan mediaPlanDetail" aria-labelledby="media-plan-table-title">
      <div className="mediaPlanShell mediaPlanDetailShell">
        <header className="mediaPlanTableHeader">
          <span>Touchpoint detail</span>
          <h2 id="media-plan-table-title">Visibility Plan Breakdown</h2>
        </header>

        <div className="mediaPlanTables">
          {mediaPlanColumns.map((rows, index) => (
            <table className="mediaPlanTable" key={index === 0 ? "first" : "second"}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Particulars</th>
                  <th>Count</th>
                  <th>Cost / Unit</th>
                  <th>Days</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.no}>
                    <td>{row.no}</td>
                    <td>{row.item}</td>
                    <td>{row.count}</td>
                    <td>{row.cost}</td>
                    <td>{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </section>
  );
}
