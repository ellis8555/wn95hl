import GameInputForm from "@/components/client/GameInputForm";

export const metadata = {
  title: "wn95hl",
  description: "Test site for wn95hl",
};

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl text-center">wn95hl.com affiliated test area</h1>
      <GameInputForm leagueName="w" seasonNumber="8" />
    </main>
  );
}
