import GameInputForm from "@/components/client/GameInputForm";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
      />
    </>
  );
}
