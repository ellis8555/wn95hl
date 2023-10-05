import GameInputForm from "@/components/client/GameInputForm";
import W_Season from "@/schemas/season/w_season";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Home() {
  const defaultLeague = "w";
  const mostRecentWSeason = await W_Season.getMostRecentSeasonNumber();
  return (
    <>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm
        leagueName={defaultLeague}
        seasonNumber={mostRecentWSeason}
      />
    </>
  );
}
