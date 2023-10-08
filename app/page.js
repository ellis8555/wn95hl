import GameInputForm from "@/components/client/GameInputForm";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  API_READ_SEASON_DATA,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Home() {
  const mostRecentSeason = await API_READ_SEASON_DATA(
    DOMAIN,
    DEFAULT_LEAGUE,
    MOST_RECENT_SEASON,
    "most-recent-season"
  );
  return (
    <>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={mostRecentSeason}
      />
    </>
  );
}
