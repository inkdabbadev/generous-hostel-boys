import OfflineDeck from "../components/history/OfflineDeck";

export default function OfflinePage() {
  return (
    <main className="offlineStandalonePage">
      <section className="offlineStandaloneSection" aria-label="Offline">
        <OfflineDeck />
      </section>
    </main>
  );
}
