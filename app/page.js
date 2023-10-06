import GameInputForm from "@/components/client/GameInputForm";
import { DEFAULT_LEAGUE } from "@/utils/constants/constants";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Home() {
  const defaultLeague = DEFAULT_LEAGUE;
  const mostRecentWSeason = "8";
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
