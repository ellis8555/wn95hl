import GameInputForm from "@/components/client/GameInputForm";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm leagueName="w" seasonNumber="8" />
    </main>
  );
}
